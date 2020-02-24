import logger from '../core/logger/app-logger'
import { cacheToRedis } from './utils'

export default async (orient) => {
  const keys = [['Visit', 4000]];
  console.log('cache keys: ', keys);

  return Promise.all(keys.map(([key, limit]) => cacheToRedis(orient, key, limit)))
  // return await cacheToRedis(orient, 'Project', 2000)
}