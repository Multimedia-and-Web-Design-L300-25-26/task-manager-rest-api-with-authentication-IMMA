import express from "express";
import Task from "../models/Task.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Apply auth middleware
router.use(authMiddleware);

// POST /api/tasks
router.post("/", async (req, res) => {
  try {
        const { title, description } = req.body;

        // // - Create task
        // // - Attach owner = req.user.id
        const task = new Task({
            title,
            description,
            owner: req.user.id 
        });

        await task.save();
        res.status(201).json(task);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// GET /api/tasks
router.get("/", async (req, res) => {
  try {
        // // - Return only tasks belonging to req.user
        const tasks = await Task.find({ owner: req.user.id });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// DELETE /api/tasks/:id
router.delete("/:id", async (req, res) => {
  try {
        // Find the task first
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        // // - Check ownership
        if (task.owner.toString() !== req.user.id) {
            return res.status(401).json({ message: "Not authorized to delete this task" });
        }

        // // - Delete task
        await task.deleteOne();
        res.json({ message: "Task deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;