import orm from '../utils/thinky-loader-fork'
import logger from '../core/logger/app-logger'

const controller = {};

controller.getAll = async (req, res) => {
  try {
    const nodes = await orm.models.Visit;
    logger.info(`Sending ${nodes.length} nodes...`);
    res.send(nodes);
  }
  catch (err) {
    logger.error('Error in getting nodes- ' + err);
    res.send('Got error in getAll');
  }
}

controller.getById = async (req, res) => {
  try {
    console.log('req.params: ', req.params);
    // console.log('orm.models: ', orm.models);
    const [node] = await orm.models.Visit.getById(req.params.id);
    if (!node) {
      throw new Error('Node no found')
    }
    logger.info(`Got node ${req.params.id}...`);
    res.send(node);
  }
  catch (err) {
    logger.error('Error in getting nodes- ' + err);
    res.send('Got error in getById');
  }
}

controller.addNode = async (req, res) => {
  console.log('req.body: ', req.body);
  let node = orm.models.Visit({ ...req.body });
  console.log('nodeToAdd: ', node);
  try {
    // throw new Error('Test Error')
    const savedNode = await orm.models.Visit.addNode(node);
    logger.info(`Adding node (${savedNode.id})...`);
    res.send(savedNode);
  }
  catch (err) {
    logger.error('Error in Node creation- ' + err);
    res.send(`Error: ${err}`);
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
    res.send('Update failed..!');
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