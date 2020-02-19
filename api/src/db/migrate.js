import low from 'lowdb'
import FileAsync from 'lowdb/adapters/FileAsync'
import pick from 'lodash/pick'

import orm from '../utils/thinky-loader-fork'
import logger from '../core/logger/app-logger'

const adapter = new FileAsync('src/db/mappings.json')

const photoMapper = async (session, { id }, { ['@rid']: rid }) => {
  logger.info(`photoMap called ${id} - ${rid}`);
  const photoQuery = orm.models.Photo.getAll(id, { index: 'visit_id' })
  const { length } = await photoQuery
  logger.info(`photo length: ${length}`);
  return new Promise((resolve, reject) => {
    if (!length) {
      resolve('Node Nodes')
    }
    const photoStream = photoQuery.run();
    photoStream.each(async (photo, index, total) => {
      // console.log('Visit-Photo: ', { id, index, total });
      logger.info(`Streaming Visit-Photo: ${index} - ${total}`)

      try {
        const cleanPhoto = pick(photo, Object.keys(photo).filter(key => !key.includes('_id')));
        // console.log('cleanProject: ', cleanProject);
        const orientPhoto = await session.create('VERTEX', 'Photo').set(cleanPhoto).one();
        const owner = await session.create('EDGE', 'Owns').from(rid).to(orientPhoto['@rid']).one();
        // console.log('owner: ', owner);
        // await visitMapper(cleanPhoto, session)
        if (index === (total - 1)) {
          resolve(`${cleanPhoto.id} Success`)
        }
      } catch (err) {
        console.error('err: ', err);
        logger.error(`Problem migrating Photo ${photo.id}`);
        reject(`${photo.id} Errored`)
      }
    })
  })
}

const visitMapper = async (session, { id }, { ['@rid']: rid }) => {
  logger.info(`visitMap called ${id} - ${rid}`);
  const visitQuery = orm.models.Visit.getAll(id, { index: 'project_id' })
  // console.log('visitQuery: ', visitQuery);
  // console.log('visitStream: ', visitStream);
  const { length } = await visitQuery;
  logger.info(`visit length: ${length}`);
  return new Promise((resolve, reject) => {
    if (!length) {
      resolve('No Nodes')
    }
    const visitStream = visitQuery.run();
    visitStream.each(async (visit, index, total) => {
      // console.log('Project-Visit: ', { id, index, total })
      logger.info(`Streaming Project-Visit: ${index} - ${total}`)

      try {
        const cleanVisit = pick(visit, Object.keys(visit).filter(key => !key.includes('_id')));
        // console.log('cleanProject: ', cleanProject);
        const orientVisit = await session.create('VERTEX', 'Visit').set(cleanVisit).one();
        const owner = await session.create('EDGE', 'Owns').from(rid).to(orientVisit['@rid']).one();
        // console.log('owner: ', owner);

        const result = await photoMapper(session, cleanVisit, orientVisit);
        logger.info(`Photo Map Result: ${result}`);

        if (index === (total - 1)) {
          resolve(`${cleanVisit.id} Success`)
        }
      } catch (err) {
        console.error('err: ', err);
        logger.error(`Problem migrating Visit ${visit.id}`);
        reject(`${visit.id} Errored`)
      }
    })
  })

}

const projectMapper = async (session) => {
  const projectQuery = orm.models.Project
  const { length } = await projectQuery
  logger.info(`project length: ${length}`);

  return new Promise((resolve, reject) => {
    if (!length) {
      resolve('No Nodes')
    }
    const projectStream = projectQuery.run()
    projectStream.each(async (project, index, total) => {
      logger.info(`Streaming Project: ${index} - ${total}`)
      try {
        const cleanProject = pick(project, Object.keys(project).filter(key => !key.includes('_id')));
        const orientProject = await session.create('VERTEX', 'Project').set(cleanProject).one();

        const result = await visitMapper(session, cleanProject, orientProject)
        logger.info(`Visit Map Result: ${result}`);

        if (index === (total - 1)) {
          resolve(`${cleanProject.id} Success`)
        }
      } catch (err) {

        console.error('err: ', err);
        logger.error(`Problem migrating Project ${project.id}`);
        reject(`${project.id} Errored`)
      }
    })
  })
}

export default async ({ client, pool }) => {
  console.log('Migrating');
  const mapDb = await low(adapter);
  await mapDb.defaults({ projects: {}, visits: {}, photos: {} }).write();
  const session = await pool.acquire();

  const result = await projectMapper(session);
  logger.info(`Project Map Result: ${result}`);

  // const projectStream = orm.models.Project.run()
  // console.log('projectStream: ', projectStream);
  // projectStream.each(async (model) => {
  //   try {
  //     const cleanProject = pick(model, Object.keys(model).filter(key => !key.includes('_id')));
  //     if (!await mapDb.get(`projects.${cleanProject.id}`).value()) {
  //       const orientProject = await session.create('VERTEX', 'Project').set(cleanProject).one();
  //       const mapped = await mapDb.get('projects').assign({ [cleanProject.id]: orientProject['@rid'].toString() }).write();
  //       console.log('mapped: ', mapped);
  //     }
  //   } catch (err) {
  //     logger.error(`Problem migrating ${model.id}`);
  //   }

  // });
  session.close();
}