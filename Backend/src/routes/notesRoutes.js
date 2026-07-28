import express from "express"
import {CreateNode, Deletenode, getAllNotes, UpdateNode,getNoteById} from "../controller/notesController.js"
const router = express.Router();

router.get("/",getAllNotes)
router.get("/:id",getNoteById)
router.post("/", CreateNode)
router.put("/:id",UpdateNode)
router.delete("/:id",Deletenode)

export default router;