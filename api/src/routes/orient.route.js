import express from "express";
import orientController from "../controllers/orient.controller"

export default ({ pool }) => {
  const router = express.Router()

  router.get('/', (req, res) => {
    res.status(404).send('Not Valid');
  })

  router.get('/:node', (req, res) => {
    orientController.getAll(req, res, pool);
  });

  router.get('/:node/:id', (req, res) => {
    orientController.getById(req, res, pool);
  });

  router.get('/:node/:id/:nested', (req, res) => {
    orientController.getNested(req, res, pool);
  });

  router.post('/:node', (req, res) => {
    orientController.addNode(req, res, pool);
  });

  router.put('/:node/:id', (req, res) => {
    orientController.updateNode(req, res, pool);
  });

  router.delete('/:node/:id', (req, res) => {
    orientController.deleteNode(req, res, pool);
  });

  return router
};