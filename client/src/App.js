import React, { useState } from 'react';
import { Container, Row, Col, Button, Form, Alert } from 'react-bootstrap';
import ProteinViewer from './components/ProteinViewer';
import './App.css';

function App() {
  const [sequence, setSequence] = useState(
    "MGSSHHHHHHSSGLVPRGSHMRGPNPTAASLEASAGPFTVRSFTVSRPSGYGAGTVYYPTNAGGTVGAIAIVPGYTARQSSIKWWGPRLASHGFVVITIDTNSTLDQPSSRSSQQMAALRQVASLNGTSSSPIYGKVDTARMGVMGWSMGGGGSLISAANNPSLKAAAPQAPWDSSTNFSSVTVPTLIFACENDSIAPVNSSALPIYDSMSRNAKQFLEINGGSHSCANSGNSNQALIGKKGVAWMKRFMDNDTRYSTFACENPNSTRVSDFRTANCSLEDPAANKARKEAELAAATAEQ"
  );
  const [pdbData, setPdbData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const calculatePlDDT = (pdbString) => {
    const lines = pdbString.split('\n');
    let sum = 0;
    let count = 0;

    lines.forEach(line => {
      if (line.startsWith('ATOM')) {
        const bFactor = parseFloat(line.substring(60, 66).trim());
        sum += bFactor;
        count++;
      }
    });

    return count > 0 ? (sum / count).toFixed(4) : 0;
  };

  const handlePredict = async () => {
    setLoading(true);
    setError(null);

    try {
      if (!sequence || sequence.length < 10) {
        throw new Error('Please enter a valid protein sequence (minimum 10 characters)');
      }

      const response = await fetch('/api/fold', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sequence }),
      });

      if (!response.ok) {
        throw new Error('Prediction failed - server error');
      }

      const data = await response.json();
      if (!data.pdb) {
        throw new Error('Invalid PDB data received');
      }
      setPdbData(data.pdb);
    } catch (err) {
      setError(err.message);
      console.error('Prediction error:', err);
    } finally {
      setLoading(false);
    }
  };

  const downloadPdb = () => {
    const element = document.createElement('a');
    const file = new Blob([pdbData], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'predicted.pdb';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <Container fluid>
      <Row>
        <Col md={3} className="sidebar bg-light p-4">
          <h1>🎈 ESMFold</h1>
          <p>
            <a href="https://esmatlas.com/about" target="_blank" rel="noopener noreferrer">ESMFold</a> is an end-to-end single sequence protein structure predictor.
          </p>

          <Form.Group controlId="sequenceInput" className="mb-3">
            <Form.Label>Input sequence</Form.Label>
            <Form.Control
              as="textarea"
              rows={15}
              value={sequence}
              onChange={(e) => setSequence(e.target.value)}
              placeholder="Enter protein sequence..."
            />
          </Form.Group>

          <Button
            variant="primary"
            onClick={handlePredict}
            disabled={loading}
            className="w-100"
          >
            {loading ? 'Predicting...' : 'Predict'}
          </Button>
        </Col>

        <Col md={9} className="main-content p-4">
          {error && <Alert variant="danger">{error}</Alert>}

          {!sequence && (
            <Alert variant="warning">👈 Enter protein sequence data!</Alert>
          )}

        {pdbData && (
          <>
            <div className="center-text-content mt-4">
              <h2>Visualization of predicted protein structure</h2>
            </div>
            <div className="protein-viewer-container">
              <ProteinViewer pdbData={pdbData} />
            </div>

            <div className="center-text-content mt-4 p-3 bg-light rounded">
              <h2>plDDT</h2>
              <p>plDDT is a per-residue estimate of the confidence in prediction on a scale from 0-100.</p>
              <p className="plddt-value">plDDT: {calculatePlDDT(pdbData)}</p>

              <Button variant="success" onClick={downloadPdb} className="mt-2">
                Download PDB
              </Button>
            </div>
          </>
        )}

        </Col>
      </Row>
    </Container>
  );
}

export default App;
