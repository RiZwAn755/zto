import express from 'express';
import Registrations from '../DB/examForm.js';

const router = express.Router();

// Test endpoint to verify API is working
router.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'Update registration API is working'
  });
});

// Update exam registration by ID
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    console.log('PATCH request received for ID:', id);
    console.log('Update data:', updateData);

    // Find and update the registration
    // Use runValidators: false to avoid validation errors for fields not being updated
    const updatedRegistration = await Registrations.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: false }
    );

    if (!updatedRegistration) {
      console.log('Registration not found for ID:', id);
      return res.status(404).json({
        success: false,
        message: 'Registration not found'
      });
    }

    console.log('Registration updated successfully:', updatedRegistration);

    res.status(200).json({
      success: true,
      message: 'Registration updated successfully',
      data: updatedRegistration
    });

  } catch (error) {
    console.error('Error updating registration:', error);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      code: error.code
    });
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Alternative PUT endpoint for updating registration
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Find and update the registration
    // Use runValidators: false to avoid validation errors for fields not being updated
    const updatedRegistration = await Registrations.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: false }
    );

    if (!updatedRegistration) {
      return res.status(404).json({
        success: false,
        message: 'Registration not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Registration updated successfully',
      data: updatedRegistration
    });

  } catch (error) {
    console.error('Error updating registration:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// POST endpoint for updating registration (alternative method)
router.post('/update', async (req, res) => {
  try {
    const { id, ...updateData } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Registration ID is required'
      });
    }

    // Find and update the registration
    // Use runValidators: false to avoid validation errors for fields not being updated
    const updatedRegistration = await Registrations.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: false }
    );

    if (!updatedRegistration) {
      return res.status(404).json({
        success: false,
        message: 'Registration not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Registration updated successfully',
      data: updatedRegistration
    });

  } catch (error) {
    console.error('Error updating registration:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Get specific registration by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const registration = await Registrations.findById(id);

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Registration not found'
      });
    }

    res.status(200).json({
      success: true,
      data: registration
    });

  } catch (error) {
    console.error('Error fetching registration:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Delete registration by ID
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const deletedRegistration = await Registrations.findByIdAndDelete(id);

    if (!deletedRegistration) {
      return res.status(404).json({
        success: false,
        message: 'Registration not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Registration deleted successfully',
      data: deletedRegistration
    });

  } catch (error) {
    console.error('Error deleting registration:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

export default router; 