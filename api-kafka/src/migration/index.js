import { BehaviorSubject, empty, from, of } from "rxjs";
import { bufferTime, catchError, mergeMap, scan } from "rxjs/operators";

import pick from 'lodash/pick'
import orm from '../utils/thinky-loader-fork'

import low from 'lowdb'
import FileAsync from 'lowdb/adapters/FileAsync'
import logger from '../core/logger/app-logger'
import { nodeController } from "./utils";


export default async ({ client, pool }) => {
  console.log('Migrating');
  // const mapDb = await low(new FileAsync('src/db/mappings.json'));
  // await mapDb.defaults({ projects: {}, visits: {}, photos: {} }).write();

  const result = await nodeController(pool, 'Project', [
    // {
    //   entity: 'Photo',
    //   // limit: 2,
    //   indexFn: parent => ({
    //     index: ['visit_id', parent.id],
    //     parentRid: parent['@rid']
    //   })
    // }
  ])
  // {
  //   entity: 'Visit',
  //   // limit: 2,
  //   indexFn: parent => ({
  //     index: ['project_id', parent.id],
  //     parentRid: parent['@rid']
  //   })
  // },
  // {
  //   entity: 'Photo',
  //   // limit: 2,
  //   indexFn: parent => ({
  //     index: ['visit_id', parent.id],
  //     parentRid: parent['@rid']
  //   })
  // }
  console.log('result: ', result);
}