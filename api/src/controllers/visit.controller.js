import orm from '../utils/thinky-loader-fork'
import logger from '../core/logger/app-logger'

const controller = {};

controller.getAll = async (req, res) => {
  const {
    limitless,
    limit = 25,
    page = 1
  } = req.query
  try {
    const nodes = await (!limitless ? orm.models.Visit.getLimited(limit, page) : orm.models.Visit);
    logger.info(`Sending ${nodes.length} nodes...`);
    res.send(nodes);
  }
  catch (err) {
    logger.error('Error in getting nodes- ' + err);
    // res.send('Got error in getAll');
    res.status(500).send(err);
  }
}

controller.getById = async (req, res) => {
  try {
    const [node] = await orm.models.Visit.getById(req.params.id);
    if (!node) {
      throw new Error('Node no found')
    }
    logger.info(`Got node ${req.params.id}...`);
    res.send(node);
  }
  catch (err) {
    logger.error('Error in getting nodes- ' + err);
    res.status(500).send(err);
  }
}

controller.getPhotos = async (req, res) => {
  const { id } = req.params
  const {
    limitless,
    limit = 25,
    page = 1
  } = req.query
  try {
    // console.log('req.params: ', req.params);
    // console.log('orm.models: ', orm.models);
    const [visit] = await orm.models.Visit.getById(req.params.id);
    if (!visit) {
      throw new Error('Visit noy found');
    }

    const photos = await orm.models.Photo.getLimited(limit, page, { visit_id: id });
    logger.info(`Found photos: ${photos.length}`);
    res.send(node);
  }
  catch (err) {
    logger.error('Error in getting nodes- ' + err);
    // res.send('Got error in getById');
    res.status(500).send(err);
  }
}

controller.addNode = async (req, res) => {
  let node = orm.models.Visit({ ...req.body });
  try {
    // throw new Error('Test Error')
    const savedNode = await orm.models.Visit.addNode(node);
    logger.info(`Adding node (${savedNode.id})...`);
    res.send(savedNode);
  }
  catch (err) {
    logger.error('Error in Node creation- ' + err);
    // res.send(`Error: ${err}`);
    res.status(500).send(err);
  }
}

controller.updateNode = async (req, res) => {
  let id = req.params.id;
  let data = req.body
  try {
    const updatedNode = await orm.models.Visit.updateNode(id, data);
    logger.info('Updated Node- ' + id);
    res.send(updatedNode);
  }
  catch (err) {
    logger.error('Error in Node update- ' + err);
    // res.send('Update failed..!');
    res.status(500).send(err);
  }
}

controller.deleteNode = async (req, res) => {
  let id = req.params.id;
  try {
    const removedNode = await orm.models.Visit.deleteNode(id);
    logger.info('Deleted Node- ' + id);
    res.send(`Node (${removedNode.id}) successfully deleted`);
  }
  catch (err) {
    logger.error('Error in Node deletion- ' + err);
    res.send('Delete failed..!');
  }
}

export default controller;