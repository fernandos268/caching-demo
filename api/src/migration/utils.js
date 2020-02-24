import { BehaviorSubject, empty, from, of, throwError } from "rxjs";
import {
  bufferTime,
  catchError,
  mergeMap,
  scan,
  mergeScan,
  retry,
  delay,
  tap
} from "rxjs/operators";

import Redis from 'ioredis'
import pick from 'lodash/pick'
import orm from '../utils/thinky-loader-fork'

import low from 'lowdb'
import FileAsync from 'lowdb/adapters/FileAsync'
import logger from '../core/logger/app-logger'
import configDev from '../core/config/config.dev';


export const options = {
  // batchSize: 5,
  // maxQueueSize: 15,
  // retrieveNodesConcurrency: 1,

  // migrateConcurrency: 5,
  // bulkNestedConcurrency: 5,
  // maxBulkNestedCount: 5,
  batchSize: 600,
  maxQueueSize: 1000,
  retrieveNodesConcurrency: 300,

  migrateConcurrency: 700,
  bulkNestedConcurrency: 50,
  maxBulkNestedCount: 50,
};

export const redis = new Redis(6380, '10.110.3.35');

const redisKey = (nodeName, id, secId) => `${nodeName}:mapping-${configDev.orientDb}:${id}${secId ? `:${secId}` : ''}`

export const cacheToRedis = async ({ pool, client }, nodeName = 'Project', limit = 20) => {
  const session = await pool.acquire();
  // const count = await session.select('count(*)').from(nodeName).scalar()
  // console.log('count: ', count);

  // const limit = 20;
  // const maxQueueSize = 15
  const controller$ = new BehaviorSubject('#-1:-1');
  const threshhold = Math.ceil(limit * 0.75);
  console.log('threshhold: ', threshhold);

  return await controller$.pipe(
    mergeMap(
      lowerRid => {
        return of(lowerRid).pipe(
          mergeMap(
            ridRetriable => {
              logger.info(`Batch ${nodeName} - ${ridRetriable}`);
              return session.select().from(nodeName).where('@rid > :lowerRid').limit(limit).all({ lowerRid: ridRetriable });
            }
          ),
          // delay(2500),
          retry(30)
        ).toPromise();
      }
    ),
    mergeMap(nodes => {
      logger.info(`Got ${nodes.length} - ${nodeName} response`);
      if (nodes.length === 0) {
        controller$.complete();
      } else {
        const last = [...nodes].pop()
        console.log('last: ', last);
        controller$.next(last['@rid'].toString())
      }
      return from(nodes);
    }),
    mergeMap(
      async (data) => {
        const ids = nodeName === 'Owns' ? [data.in, data.out] : [data.id]
        const key = redisKey(nodeName, ...ids)
        console.log('key: ', key);
        const existing = await redis.get(key)
        // console.log('existing: ', existing);
        if (!existing) {
          redis.set(key, data['@rid'])
        }
        return data
      },
      undefined,
      Math.ceil(limit * 0.75),
    ),
    scan(
      ({ totalProcessedCount }) => {
        logger.info(`Total (${nodeName}) procesed: ${totalProcessedCount + 1}`)
        // const queued = [...acc.queued]
        // console.log('queued: ', queued);
        // if (!queued.has(last) && totalProcessedCount >= (queued.size & threshhold)) {
        //   queued.add(last)
        //   controller$.next(last)
        // }
        return {
          // queued,
          totalProcessedCount: totalProcessedCount + 1
        }
      },
      {
        // queued: new Set(),
        totalProcessedCount: 0
      },
    ),
  ).toPromise();
}

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
      const key = redisKey(parentNode, nodeRid, parentRid);
      try {
        // const existing = await session.select().from('Owns').where({ out: parentRid, in: nodeRid }).one();
        const existing = await redis.get(key)
        if (existing) {
          logger.info(`Skipping, Edge: Owns (${orientNode.id}) - ${parentNode}: ${parentRid} to ${nodeRid}`);
          resolve(meta)
        } else {
          const parent = await session.select().from(parentRid).one()
          logger.info(`Retrieved ${parentNode} Parent for ${nodeRid}, version = ${parent['@version']}`);
          const owner = await session.create('EDGE', 'Owns').from(parent['@rid']).to(nodeRid).one();
          await redis.set(key, owner['@rid']);
          // console.log(`${cleanNode.id} owner: `, owner['@rid']);
          logger.info(`Assigned ${parentNode} (${orientNode.id}) : ${owner['@rid']} - ${parentRid} to ${nodeRid}`);
          resolve(meta)
        }

      } catch (err) {
        // console.error(`from ${parentRid} to ${nodeRid} own err: `, err);
        logger.error(`Problem owning ${parentNode} (${orientNode.id}) - ${parentRid} to ${nodeRid} err: ${err}`);
        reject(throwError(`Problem owning ${parentNode} (${orientNode.id}) - ${parentRid} to ${nodeRid} err: ${err}`))
      } finally {
        await session.close()
      }
    }
  })
}

// export const resetEdgeOut = async (pool, ids) => new Promise(async (resolve) => {
//   const session = await pool.acquire();

//   const [node, ...duplicates] = await session.select().from('Photo').where({ id: ids.node }).all();
//   console.log('node: ', Boolean(node));
//   console.log('duplicates', duplicates.length())
//   if (node) {
//     await redis.set(redisKey('Photo', ids.node), node['@rid']);
//     if (duplicates.length) {
//       await from(duplicates).pipe(
//         mergeMap((duplicate) => session.delete('VERTEX', 'Photo').where({ id: duplicate.id }))
//       ).toPromise();
//     }
//     const edge = await session.select().from('Owns').where({ in: node['@rid'] });
//     if (edge) {
//       await session.delete('EDGE', 'Owns').from(edge.out).to(edge.in).one();
//     }
//     resolve(node);
//   } else {
//     resolve();
//   }
//   session.close();
// })

export const migrateNode = (pool, node = 'Project', rethinkNode) => {
  logger.info(`migrating ${node}, ${rethinkNode.id}`)
  return new Promise(async (resolve, reject) => {
    const session = await pool.acquire();
    const key = redisKey(node, rethinkNode.id);
    try {
      // const existing = await session.select().from(node).where({ id: rethinkNode.id }).one()
      const existing = await redis.get(key)
      // logger.info(`${node} existing: ${existing}`)
      if (existing) {
        logger.info(`Skipping, ${node} - ${rethinkNode.id} migrated already = ${existing}`);
        // await redis.set(key, existing['@rid'])
        resolve({ ['@rid']: existing, id: rethinkNode.id })
      } else {
        // const existing = await session.select().from(node).where({ id: rethinkNode.id }).one()
        const cleanNode = pick(rethinkNode, Object.keys(rethinkNode).filter(key => !key.includes('_id')));
        const orientNode = await session.create('VERTEX', node).set(cleanNode).one();
        await redis.set(key, orientNode['@rid'])
        logger.info(`${node} - ${cleanNode.id} migrated = ${orientNode['@rid']}`);
        resolve(orientNode)
      }

    } catch (err) {
      // console.error(`from ${rethinkNode.id} migrate err: `, err);
      logger.error(`Problem migrating ${node} - ${rethinkNode.id} err: ${err}`);
      reject(throwError(`Problem migrating ${node} - ${rethinkNode.id} err: ${err}`))
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
          retry(50),
        ).toPromise();
      },
      undefined,
      50
    ),
    mergeMap(
      async (meta) => {
        // console.log('batch meta: ', meta);
        const { orientNode: node } = meta
        // console.log('node: ', node);
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
      50
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

export const nodeController = (pool, node, subs = [], meta = {}) => {
  const { index, parentRid, limit } = meta
  const controller$ = new BehaviorSubject(1);
  return controller$.pipe(
    mergeMap(
      async currPage => {
        logger.info(`Migrating start ${currPage}`)
        const retrieved = await retrieveNodes(options.batchSize, currPage, node, index)
        logger.info(`Got ${retrieved.length} nodes from ${node} page = ${currPage}`)
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
        // const orientNode = await migrateNode(pool, node, rethinkNode);
        return await of(rethinkNode).pipe(
          mergeMap(
            async nodeRetrieable => {
              // const resetNode = await resetEdgeOut(pool, { node: nodeRetrieable.id });
              // console.log('resetNode: ', resetNode);
              const orientNode = await migrateNode(pool, node, nodeRetrieable);
              // console.log('orientNode: ', orientNode);
              // return { rethinkNode: nodeRetrieable, orientNode, parentRid };
              // const orientRid = redis.get(redisKey(node, nodeRetrieable.id));
              // const orientNode = { ['@rid']: orientRid, id: nodeRetrieable.id };
              // const parentRid = await redis.get(redisKey('Visit', nodeRetrieable.visit_id || ''))
              const result = await ownNode(pool, 'Visit', { orientNode })
              return result
            },
            undefined,
            options.migrateConcurrency,
          ),
          retry(50),
        ).toPromise();
      },
      undefined,
      options.migrateConcurrency,
    ),
    bufferTime(1700, undefined, options.maxBulkNestedCount),
    mergeMap(nodes => {
      return nodes.length > 0 ? of(nodes) : empty();
    }),
    // mergeMap(
    //   async nodes => {
    //     logger.info(`Started ${node} batch with `);
    //     await bulkController(pool, nodes, subs, node);
    //     return nodes;
    //   },
    //   undefined,
    //   options.bulkNestedConcurrency,
    // ),
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