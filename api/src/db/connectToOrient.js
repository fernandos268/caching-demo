import OrientDB, { OrientDBClient, ODatabase } from 'orientjs'
import configDev from '../core/config/config.dev';

const connectToOrient = async () => {
  const [mainServer, ...servers] = configDev.orientHosts
    .split(',').map(hostPort => hostPort.split(':'))
    .map(([host, port = configDev.orientPort]) => ({ host, port }))
  console.log('Orient Servers: ', mainServer, servers);
  const client = await OrientDBClient.connect({
    host: mainServer.host,
    port: mainServer.port,
    servers
    // pool: {
    //   max: 10
    // }
  });

  const dbConfig = {
    name: configDev.orientDb,
    username: configDev.orientUsername,
    password: configDev.orientPass
  }
  console.log('Orient Config: ', dbConfig);

  const exists = await client.existsDatabase(dbConfig);
  console.log('DB exists: ', exists);

  if (!exists) {
    await client.createDatabase(dbConfig);
  }

  const pool = await client.sessions({ ...dbConfig, pool: { max: 10 } });
  // console.log('pool: ', pool);

  const session = await pool.acquire();
  await session.command("create class Project IF NOT EXISTS extends V").one();
  await session.command("create class Visit IF NOT EXISTS extends V").one();
  await session.command("create class Photo IF NOT EXISTS extends V").one();
  await session.command("create class Owns IF NOT EXISTS extends E").one();
  // console.log(session.liveQuery('select from Project').eventNames())
  await session.close();
  // console.log(process.eventNames());

  const errortypes = ['unhandledRejection', 'uncaughtException']
  errortypes.map(type => {
    process.on(type, async () => {
      try {
        logger.error(`process.on ${type}`)
        await pool.close();
        await client.close();
        process.exit(0)
      } catch (_) {
        process.exit(1)
      }
    })
  })

  const signals = ['SIGTERM', 'SIGINT', 'SIGUSR2']
  signals.map(type => {
    process.once(type, async () => {
      try {
        await pool.close();
        await client.close();
      } finally {
        process.kill(process.pid, type)
      }
    })
  })

  return { client, pool };
}

export default connectToOrient