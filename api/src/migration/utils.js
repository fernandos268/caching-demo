import { BehaviorSubject, empty, from, of, throwError } from "rxjs";
import {
  bufferTime,
  catchError,
  mergeMap,
  scan,
  mergeScan,
  retry,
  delay
} from "rxjs/operators";

import pick from 'lodash/pick'
import orm from '../utils/thinky-loader-fork'

import low from 'lowdb'
import FileAsync from 'lowdb/adapters/FileAsync'
import logger from '../core/logger/app-logger'

export const options = {
  // batchSize: 5,
  // maxQueueSize: 15,
  // retrieveNodesConcurrency: 1,

  // migrateConcurrency: 5,
  // bulkNestedConcurrency: 5,
  // maxBulkNestedCount: 5,
  batchSize: 20,
  maxQueueSize: 40,
  retrieveNodesConcurrency: 20,

  migrateConcurrency: 10,
  bulkNestedConcurrency: 20,
  maxBulkNestedCount: 20,
};

export const retrieveNodes = (limit, page, node = 'Project', index) => {
  // console.log('index: ', index);
  logger.info(`Retrieving (${node}) - page: ${page} of request: ${index}/${limit}`)
  return orm.models[node].getLimited(limit, page, index);
}

export const ownNode = (pool, parentNode = 'Project', meta = {}) => {
  const { orientNode, parentRid } = meta
  const nodeRid = orientNode['@rid'];
  logger.info(`owning ${parentNode}, ${nodeRid} to ${parentRid}`)
  return new Promise(async (resolve, reject) => {
    if (!parentRid) {
      resolve(meta);
    } else {
      const session = await pool.acquire();
      try {
        const parent = await session.select().from(parentRid).one()
        logger.info(`Retrieved ${parentNode} Parent for ${nodeRid}, version = ${parent['@version']}`);
        const owner = await session.create('EDGE', 'Owns').from(parent['@rid']).to(nodeRid).one();
        // console.log(`${cleanNode.id} owner: `, owner['@rid']);
        logger.info(`Assigned ${parentNode} ${owner['@rid']} - ${parentRid} to ${nodeRid}`);
        resolve(meta)

      } catch (err) {
        console.error(`from ${parentRid} to ${nodeRid} own err: `, err);
        logger.error(`Problem owning ${parentNode} - ${parentRid} to ${nodeRid} err: ${err}`);
        reject(throwError('Errrrr'))
      } finally {
        await session.close()
      }
    }
  })
}

export const migrateNode = (pool, node = 'Project', rethinkNode) => {
  logger.info(`migrating ${node}, ${rethinkNode.id}`)
  return new Promise(async (resolve, reject) => {
    const session = await pool.acquire();
    try {
      const cleanNode = pick(rethinkNode, Object.keys(rethinkNode).filter(key => !key.includes('_id')));
      const orientNode = await session.create('VERTEX', node).set(cleanNode).one();
      logger.info(`${node} - ${cleanNode.id} migrated = ${orientNode['@rid']}`);
      resolve(orientNode)

    } catch (err) {
      // console.error(`from ${rethinkNode.id} migrate err: `, err);
      logger.error(`Problem migrating ${node} - ${rethinkNode.id} err: ${err}`);
      reject(null)
    } finally {
      await session.close()
    }
  })
}

const bulkController = (pool, bulk, subs, prevNode) => {
  // console.log('bulk: ', bulk);
  const [nodeMeta, ...restMeta] = subs
  return from(bulk).pipe(
    // delay(10000),
    mergeMap(
      async (meta) => {
        return await of(meta).pipe(
          mergeMap(
            async (metaRetriable) => {
              logger.info(`Owning start ${metaRetriable.rethinkNode.id}`)

              const ownResult = await ownNode(pool, prevNode, metaRetriable)
              return ownResult
            },
          ),
          retry(20),
        ).toPromise();
      },
      undefined,
      5
    ),
    // retry(20),
    mergeMap(
      async (meta) => {
        console.log('batch meta: ', meta);
        const { orientNode: node } = meta
        console.log('node: ', node);
        return nodeMeta
          ? await nodeController(
            pool,
            nodeMeta.entity,
            restMeta,
            nodeMeta.indexFn(node)
          )
          : 'Last'
      },
      undefined,
      5
    ),
    scan(
      (acc, node) => {
        if (node) {
          acc.totalProcessedCount += 1;
        }
        return acc;
      },
      {
        totalProcessedCount: 0,
      },
    ),
  ).toPromise();
}

export const nodeController = (pool, node, subs, meta = {}) => {
  const { index, parentRid, limit } = meta
  const controller$ = new BehaviorSubject(1);
  return controller$.pipe(
    mergeMap(
      async currPage => {
        logger.info(`Migrating start ${currPage}`)
        const retrieved = await retrieveNodes(options.batchSize, currPage, node, index)
        logger.info(`Got ${retrieved.length} nodes from ${node} offset = ${currPage}`)
        return retrieved
      },
      undefined,
      options.retrieveNodesConcurrency,
    ),
    mergeMap(nodes => {
      if (nodes.length === 0) {
        controller$.complete();
      }
      return from(nodes);
    }),
    mergeMap(
      async rethinkNode => {
        const orientNode = await migrateNode(pool, node, rethinkNode);
        return { rethinkNode, orientNode, parentRid };
      },
      undefined,
      options.migrateConcurrency,
    ),
    bufferTime(500, undefined, options.maxBulkNestedCount),
    mergeMap(nodes => {
      return nodes.length > 0 ? of(nodes) : empty();
    }),
    mergeMap(
      async nodes => {
        logger.info(`Started ${node} batch with `);
        await bulkController(pool, nodes, subs, node);
        return nodes;
      },
      undefined,
      options.bulkNestedConcurrency,
    ),
    scan(
      (acc, nodes) => {
        acc.totalProcessedCount += nodes.length;
        let queueSize = acc.curOffset - acc.totalProcessedCount;
        while (queueSize + options.batchSize <= (limit || options.maxQueueSize)) {
          queueSize += options.batchSize;
          acc.curOffset += options.batchSize;
          acc.page += 1
          logger.info(`Page ended ${node} ${JSON.stringify(acc)}`);
          controller$.next(acc.page);
        }
        return acc;
      },
      {
        curOffset: 0,
        page: 1,
        totalProcessedCount: 0,
      },
    ),
    catchError(async err => {
      logger.error("caught err", err);
      return err;
    }),
  ).toPromise();
}