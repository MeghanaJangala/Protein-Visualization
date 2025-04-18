const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.post('/api/fold', async (req, res) => {
  try {
    const { sequence } = req.body;
    
    const response = await axios.post(
      'https://api.esmatlas.com/foldSequence/v1/pdb/',
      sequence,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      }
    );
    
    const pdbString = response.data;
    res.json({ pdb: pdbString });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to predict protein structure' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});