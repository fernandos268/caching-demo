import express from "express";
import visitController from "../controllers/visit.controller"
const router = express.Router()

router.get('/', (req, res) => {
  visitController.getAll(req, res);
});

router.get('/:id', (req, res) => {
  visitController.getById(req, res);
});

router.post('/', (req, res) => {
  visitController.addNode(req, res);
});

router.put('/:id', (req, res) => {
  visitController.updateNode(req, res);
});

router.delete('/:id', (req, res) => {
  visitController.deleteNode(req, res);
});

export default router;