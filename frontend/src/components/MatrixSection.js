import React, { useState } from 'react';
import axios from 'axios';
import Card from './Card';
import './MatrixSection.css';

function MatrixSection({ tasks }) {
  const [matrixSize, setMatrixSize] = useState(100);
  const [showMatrix, setShowMatrix] = useState(false);
  const [matrixData, setMatrixData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSetSize = async () => {
    if (matrixSize < 10 || matrixSize > 1000) {
      setMessage('Size must be between 10 and 1000');
      return;
    }

    try {
      setLoading(true);
      await axios.post('/admin/set_matrix_size', { size: matrixSize });
      setMessage(`Matrix set to ${matrixSize}x${matrixSize}`);
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Error setting matrix size');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewMatrix = async () => {
    if (!showMatrix) {
      try {
        setLoading(true);
        const response = await axios.get('/admin/matrix_preview');
        setMatrixData(response.data);
        setShowMatrix(true);
      } catch (err) {
        setMessage('Error loading matrix data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    } else {
      setShowMatrix(false);
    }
  };

  const handleDownload = () => {
    window.location.href = '/admin/download_matrix';
  };

  return (
    <Card title="📊 Matrix Configuration">
      <div className="matrix-section">
        <div className="input-group">
          <input
            type="number"
            min="10"
            max="1000"
            value={matrixSize}
            onChange={(e) => setMatrixSize(parseInt(e.target.value))}
            placeholder="Matrix size"
            disabled={loading}
          />
          <button
            className="btn btn-primary"
            onClick={handleSetSize}
            disabled={loading}
          >
            {loading ? 'Setting...' : 'Set Size'}
          </button>
        </div>

        {message && <div className="info-message">{message}</div>}

        <div className="button-group">
          <button
            className="btn btn-secondary"
            onClick={handleViewMatrix}
            disabled={loading}
          >
            {showMatrix ? '👁️ Hide Matrix' : '👁️ View Matrix'}
          </button>
          <button
            className="btn btn-secondary"
            onClick={handleDownload}
          >
            ⬇️ Download
          </button>
        </div>

        {showMatrix && matrixData && (
          <div className="matrix-viewer">
            <div className="matrix-grid">
              {(matrixData.matrix_preview || []).map((row, i) => (
                <div key={i} className="matrix-row">
                  <strong>Row {i}:</strong> {' '}
                  <code>
                    [{row.slice(0, 5).map(v => v.toFixed(4)).join(', ')}
                    {row.length > 5 ? ', ...' : ''}]
                  </code>
                </div>
              ))}
              {(matrixData.size || 0) > (matrixData.matrix_preview || []).length && (
                <div className="matrix-more">
                  ... and {(matrixData.size || 0) - (matrixData.matrix_preview || []).length} more rows
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

export default MatrixSection;
