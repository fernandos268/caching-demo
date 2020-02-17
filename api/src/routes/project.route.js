import express from "express";
import projectController from "../controllers/project.controller"
const router = express.Router()

router.get('/', (req, res) => {
  projectController.getAll(req, res);
});

router.get('/:id', (req, res) => {
  projectController.getById(req, res);
});

router.get('/:id/visits', (req, res) => {
  projectController.getVisits(req, res);
});

router.post('/', (req, res) => {
  projectController.addNode(req, res);
});

router.put('/:id', (req, res) => {
  projectController.updateNode(req, res);
});

router.delete('/:id', (req, res) => {
  projectController.deleteNode(req, res);
});

export default router;