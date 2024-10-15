const express = require('express');
const pool = require('../db');
const router = express.Router();

// GET API to fetch all employee data
router.get('/employees', async (req, res) => {
  try {
    console.log('Fetching all employees...');
    const result = await pool.query('SELECT * FROM employees');
    console.log('Employees fetched successfully');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching employees:', err.message, err.stack);
    res.status(500).send('Server error');
  }
});

// POST API to add a new employee
router.post('/employees', async (req, res) => {
  const { id, name, age, department, role } = req.body;
  try {
    console.log('Adding a new employee...');
    const result = await pool.query(
      'INSERT INTO employees (id, name, age, department, role) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [id, name, age, department, role]
    );
    console.log('Employee added successfully');
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error adding employee:', err.message, err.stack);
    res.status(500).send('Server error');
  }
});

// DELETE API to remove an employee by ID
router.delete('/employees/:id', async (req, res) => {
  const { id } = req.params;
  try {
    console.log(`Attempting to delete employee with ID: ${id}`);
    const result = await pool.query('DELETE FROM employees WHERE id = $1 RETURNING *', [id]);
    if (result.rowCount === 0) {
      console.log(`No employee found with ID: ${id}`);
      return res.status(404).send('Employee not found');
    }
    console.log(`Employee with ID: ${id} deleted successfully`);
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error deleting employee:', err.message, err.stack);
    res.status(500).send('Server error');
  }
});

module.exports = router;