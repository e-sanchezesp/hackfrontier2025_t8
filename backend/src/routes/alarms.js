const express = require('express');
const router = express.Router();

// @route   GET /api/alarms
// @desc    Get all alarms for a user
// @access  Private
router.get('/', async (req, res) => {
  try {
    // TODO: Add authentication middleware
    // TODO: Get alarms from database

    res.json({
      alarms: [
        {
          id: '1',
          title: 'Morning Alarm',
          time: '07:00',
          isActive: true,
          days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
        },
        {
          id: '2',
          title: 'Weekend Alarm',
          time: '09:00',
          isActive: true,
          days: ['saturday', 'sunday']
        }
      ]
    });
  } catch (error) {
    console.error('Get alarms error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/alarms
// @desc    Create a new alarm
// @access  Private
router.post('/', async (req, res) => {
  try {
    const { title, time, days, isActive } = req.body;

    // TODO: Add authentication middleware
    // TODO: Save alarm to database

    res.status(201).json({
      message: 'Alarm created successfully',
      alarm: { title, time, days, isActive }
    });
  } catch (error) {
    console.error('Create alarm error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/alarms/:id
// @desc    Update an alarm
// @access  Private
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, time, days, isActive } = req.body;

    // TODO: Add authentication middleware
    // TODO: Update alarm in database

    res.json({
      message: 'Alarm updated successfully',
      alarm: { id, title, time, days, isActive }
    });
  } catch (error) {
    console.error('Update alarm error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/alarms/:id
// @desc    Delete an alarm
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // TODO: Add authentication middleware
    // TODO: Delete alarm from database

    res.json({ message: 'Alarm deleted successfully' });
  } catch (error) {
    console.error('Delete alarm error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 