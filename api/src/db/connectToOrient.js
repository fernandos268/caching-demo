import OrientDB, { OrientDBClient, ODatabase } from 'orientjs'
import configDev from '../core/config/config.dev';

const connectToOrient = async () => {
  const client = await OrientDBClient.connect({
    host: configDev.orientHost,
    // pool: {
    //   max: 10
    // }
  });

  const dbConfig = {
    name: configDev.orientDb,
    username: configDev.orientUsername,
    password: configDev.orientPass
  }
  console.log('dbConfig: ', dbConfig);

  const exists = await client.existsDatabase(dbConfig);
  console.log('exists: ', exists);

  if (!exists) {
    await client.createDatabase(dbConfig);
  }

  const pool = await client.sessions(dbConfig);

  const session = await pool.acquire();
  await session.command("create class Project IF NOT EXISTS extends V").one();
  await session.command("create class Visit IF NOT EXISTS extends V").one();
  await session.command("create class Photo IF NOT EXISTS extends V").one();
  await session.command("create class Owns IF NOT EXISTS extends E").one();
  await session.close();

  return { client, pool };
}

export default connectToOrient