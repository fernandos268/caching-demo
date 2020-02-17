import express from "express";
import photoController from "../controllers/photo.controller"
const router = express.Router()

router.get('/', (req, res) => {
  photoController.getAll(req, res);
});

router.get('/:id', (req, res) => {
  photoController.getById(req, res);
});

router.post('/', (req, res) => {
  photoController.addNode(req, res);
});

router.put('/:id', (req, res) => {
  photoController.updateNode(req, res);
});

router.delete('/:id', (req, res) => {
  photoController.deleteNode(req, res);
});

export default router;