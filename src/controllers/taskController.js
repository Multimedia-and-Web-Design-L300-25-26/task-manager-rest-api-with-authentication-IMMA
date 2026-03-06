import Task from '../models/Task.js';

// 1. Create Task
export const createTask = async (req, res) => {
  try {
    const task = new Task({
      ...req.body, // This spreads title, description, and completed if provided
      owner: req.user.id 
    });

    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// 2. Get User Tasks
export const getTasks = async (req, res) => {
  try {
    // Only find tasks where the owner matches the logged-in user
    const tasks = await Task.find({ owner: req.user.id });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 3. Delete Task
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Security check: Does the user own this task?
    if (task.owner.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized to delete this' });
    }

    await task.deleteOne();
    res.json({ message: 'Task removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};