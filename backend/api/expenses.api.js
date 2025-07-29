import express from 'express';
import Expense from '../DB/expense.js';

const router = express.Router();

// Get all expenses
router.get('/', async (req, res) => {
  try {
    const expenses = await Expense.find().sort({ createdAt: -1 });
    res.status(200).json(expenses);
  } catch (error) {
    console.error('Error fetching expenses:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch expenses',
      error: error.message 
    });
  }
});

// Add new expense
router.post('/', async (req, res) => {
  try {
    const { name, description, amount } = req.body;
    
    if (!name || !description || !amount) {
      return res.status(400).json({
        success: false,
        message: 'Name, description, and amount are required'
      });
    }

    const newExpense = new Expense({
      name,
      description,
      amount: parseFloat(amount)
    });

    const savedExpense = await newExpense.save();
    res.status(201).json({
      success: true,
      message: 'Expense added successfully',
      data: savedExpense
    });
  } catch (error) {
    console.error('Error adding expense:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add expense',
      error: error.message
    });
  }
});

// Delete expense
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedExpense = await Expense.findByIdAndDelete(id);
    
    if (!deletedExpense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Expense deleted successfully',
      data: deletedExpense
    });
  } catch (error) {
    console.error('Error deleting expense:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete expense',
      error: error.message
    });
  }
});

// Update expense
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, amount } = req.body;
    
    const updatedExpense = await Expense.findByIdAndUpdate(
      id,
      { name, description, amount: parseFloat(amount) },
      { new: true, runValidators: true }
    );

    if (!updatedExpense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Expense updated successfully',
      data: updatedExpense
    });
  } catch (error) {
    console.error('Error updating expense:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update expense',
      error: error.message
    });
  }
});

export default router; 