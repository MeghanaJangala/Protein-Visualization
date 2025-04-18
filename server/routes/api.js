const express = require('express');
const axios = require('axios');
const router = express.Router();

router.post('/fold', async (req, res) => {
  try {
    const { sequence } = req.body;
    const response = await axios.post(
      'https://api.esmatlas.com/foldSequence/v1/pdb/',
      sequence,
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );
    res.json({ pdb: response.data });
  } catch (error) {
    res.status(500).json({ error: 'Prediction failed' });
  }
});

module.exports = router;