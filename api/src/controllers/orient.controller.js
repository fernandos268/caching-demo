// import orm from '../utils/thinky-loader-fork'
import startCase from 'lodash/startCase'
import { singular } from 'pluralize'
import logger from '../core/logger/app-logger'

const controller = {};

controller.getAll = async (req, res, pool) => {
  const session = await pool.acquire();
  const {
    limit = 25,
    page = 1
  } = req.query
  const {
    node = '',
  } = req.params
  console.log('req.query: ', req.query);
  try {
    console.log('startCase(node): ', startCase(node));
    const query = session.select().from(startCase(node)).limit(limit)
    if (page > 1) {
      query.skip(limit * (page - 1));
    }
    const nodes = await query.all();
    logger.info(`Sending ${nodes.length} nodes...`);
    res.send(nodes);
  }
  catch (err) {
    logger.error('Error in getting nodes- ' + err);
    // res.send('Got error in getAll');
    res.status(500).send(err);
  } finally {
    session.close();
  }
}

controller.getById = async (req, res, pool) => {
  const session = await pool.acquire();
  const {
    id = '',
    node = '',
  } = req.params
  const {
    modern
  } = req.query
  try {
    const query = session.select().from(startCase(node))
    const fetchedNode = await query.where(!modern ? { id } : { ['@rid']: `#${id}` }).one();

    if (!fetchedNode) {
      throw new Error('Node no found')
    }
    logger.info(`Got node ${id}...`);
    res.send(fetchedNode);
  }
  catch (err) {
    logger.error('Error in getting nodes- ' + err);
    res.status(500).send(err);
  } finally {
    session.close();
  }
}

// controller.getPhotos = async (req, res) => {
//   const { id } = req.params
//   const {
//     limitless,
//     limit = 25,
//     page = 1
//   } = req.query
//   try {
//     const [visit] = await orm.models.Visit.getById(req.params.id);
//     if (!visit) {
//       throw new Error('Visit not found');
//     }

//     // const photos = await orm.models.Photo.getLimited(limit, page, { visit_id: id });
//     const photos = await orm.models.Photo.getLimited(limit, page, ['visit_id', id]);
//     logger.info(`Found photos: ${photos.length}`);
//     res.send(photos);
//   }
//   catch (err) {
//     logger.error('Error in getting nodes- ' + err);
//     // res.send('Got error in getById');
//     res.status(500).send(err);
//   }
// }

controller.addNode = async (req, res, pool) => {
  const session = await pool.acquire();
  // const {
  //   limit = 25,
  //   page = 1
  // } = req.query
  const {
    node = '',
  } = req.params
  try {
    console.log('startCase(node): ', startCase(node));
    const savedNode = await session.create('VERTEX', startCase(node)).set(req.body).one();
    logger.info(`Adding node (${savedNode.id})...`);
    res.send(savedNode);
  }
  catch (err) {
    logger.error('Error in getting nodes- ' + err);
    // res.send('Got error in getAll');
    res.status(500).send(err);
  } finally {
    session.close();
  }
}

controller.updateNode = async (req, res, pool) => {
  const session = await pool.acquire();
  const { id = '', node = '' } = req.params;
  const data = req.body
  try {

    const updatedNode = await session.update(startCase(node)).set({
      ...data
    }).where({ id }).one();

    logger.info('Updated Node- ' + id);
    res.send(updatedNode);
  }
  catch (err) {
    logger.error('Error in Node update- ' + err);
    // res.send('Update failed..!');
    res.status(500).send(err);
  } finally {
    session.close();
  }
}

controller.deleteNode = async (req, res, pool) => {
  const session = await pool.acquire();
  const { id = '', node = '' } = req.params;
  try {
    const removedNode = await session.delete('VERTEX', startCase(node))
      .where({ id }).one()
    logger.info('Deleted Node- ' + id);
    res.send(`Node (${removedNode.id}) successfully deleted`);
  }
  catch (err) {
    logger.error('Error in Node deletion- ' + err);
    res.send('Delete failed..!');
  } finally {
    session.close();
  }
}

controller.getNested = async (req, res, pool) => {
  const session = await pool.acquire();
  const { node = '', id = '', nested = '' } = req.params
  const { limit = 25, page = 1 } = req.query

  const nodeClass = startCase(node);
  const nestedClass = startCase(singular(nested));
  console.log('nestedClass: ', nestedClass);
  // session.select(`expand(out('Owns'))`).from(startCase(singular(node)))
  try {
    if (!['Visit', 'Photo'].includes(nestedClass)) {
      throw new Error('Not Supported');
    }

    const parentNode = await session.select().from(nodeClass).where({ id }).one();
    if (!parentNode) {
      throw new Error('Non-existent node!');
    }
    // console.log('parentNode: ', parentNode);

    const nestedQuery = session.select(`expand(in('Owns'))`).from(nestedClass).limit(limit);
    if (page > 1) {
      nestedQuery.skip(limit * (page - 1));
    }
    const nestedNodes = await nestedQuery.all();
    res.send(nestedNodes);
  } catch (err) {
    logger.error('Error in Nested Query- ' + err);
    res.status(500).send('Something went wrong!');
  } finally {
    session.close();
  }
}

export default controller;