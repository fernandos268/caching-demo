import orm from '../utils/thinky-loader-fork'
import logger from '../core/logger/app-logger'

const controller = {};

const getEntity = (params) => {
    if (!params.entity) {
        return null
    }

    switch (params.entity) {
        case 'project':
            return orm.models.Project
        case 'visit':
            return orm.models.Visit
        case 'photo':
            return orm.models.Photo
    }
}

controller.createNode = async (payload) => {
    const entity = getEntity(payload)
    let node = entity(payload.input)
    try {
        const savedNode = await entity.addNode(node);
        logger.info(`Adding node (${savedNode.id})...`);
        return savedNode
    }
    catch (error) {
        logger.error('Error in Node creation- ' + error);
        return {
            error,
            path: payload.entity,
        }
    }
}

controller.updateNode = async (payload) => {
    const entity = getEntity(payload)
    const { id, ...input } = payload.input

    // console.log('updateNode: ', { id, ...input });
    try {
        const updatedNode = await entity.updateNode(id, input);
        // logger.info('Updated Node- ' + updatedNode);
        return updatedNode
    }
    catch (error) {
        console.log('error: ', error.message);
        // logger.error('Error in Node update- ' + err);
        // throw new Error(error)
        return error.message
    }
}

controller.deleteNode = async (payload) => {
    const entity = getEntity(payload)
    const { id } = payload
    try {
        await entity.deleteNode(id);
        logger.info('Deleted Node- ' + id);
        return {
            id,
            isSuccess: true
        }
    }
    catch (error) {
        // logger.error('Error in Node deletion- ' + err);
        return error.message
    }
}

export default controller;
