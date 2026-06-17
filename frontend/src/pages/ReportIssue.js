import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { reportIssue } from '../api';
import Navbar from '../components/Navbar';

const ReportIssue = () => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'Pothole',
    severity: 'moderate'
  });
  const [image, setImage] = useState(null);
  const [location, setLocation] = useState(null);
  const [locationStatus, setLocationStatus] = useState('Detecting your location...');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Auto-detect location when page loads
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
          setLocationStatus(`✅ Location detected: ${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`);
        },
        (error) => {
          setLocationStatus('❌ Location access denied. Please enable location.');
        }
      );
    } else {
      setLocationStatus('❌ Geolocation not supported by your browser.');
    }
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!location) {
      setError('Location is required. Please enable location access.');
      return;
    }
    setLoading(true);
    setError('');

    try {
      // FormData because we're sending image + text together
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('description', form.description);
      formData.append('category', form.category);
      formData.append('severity', form.severity);
      formData.append('latitude', location.latitude);
      formData.append('longitude', location.longitude);
      if (image) formData.append('image', image);

      await reportIssue(formData);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to report issue');
    }
    setLoading(false);
  };

  return (
    <div>
      <Navbar />
      <div style={styles.container}>
        <div style={styles.card}>
          <h2 style={styles.title}>📍 Report a Civic Issue</h2>
          <p style={styles.locationStatus}>{locationStatus}</p>

          {error && <p style={styles.error}>{error}</p>}

          <form onSubmit={handleSubmit}>
            <label style={styles.label}>Issue Title</label>
            <input
              style={styles.input}
              type="text"
              name="title"
              placeholder="e.g. Large pothole near signal"
              value={form.title}
              onChange={handleChange}
              required
            />

            <label style={styles.label}>Category</label>
            <select
              style={styles.input}
              name="category"
              value={form.category}
              onChange={handleChange}
            >
              <option>Pothole</option>
              <option>Garbage</option>
              <option>Water Leakage</option>
              <option>Streetlight</option>
              <option>Sewage</option>
              <option>Other</option>
            </select>

            <label style={styles.label}>Severity</label>
            <select
              style={styles.input}
              name="severity"
              value={form.severity}
              onChange={handleChange}
            >
              <option value="low">Low</option>
              <option value="moderate">Moderate</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>

            <label style={styles.label}>Description</label>
            <textarea
              style={{ ...styles.input, height: '100px', resize: 'vertical' }}
              name="description"
              placeholder="Describe the issue in detail..."
              value={form.description}
              onChange={handleChange}
              required
            />

            <label style={styles.label}>Upload Photo (optional)</label>
            <input
              style={styles.fileInput}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
            {image && (
              <img
                src={URL.createObjectURL(image)}
                alt="preview"
                style={styles.preview}
              />
            )}

            <button
              style={{
                ...styles.button,
                opacity: loading || !location ? 0.7 : 1
              }}
              type="submit"
              disabled={loading || !location}
            >
              {loading ? 'Submitting...' : '📤 Submit Issue'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex', justifyContent: 'center',
    padding: '30px 20px', backgroundColor: '#f0f4f8',
    minHeight: 'calc(100vh - 60px)'
  },
  card: {
    background: 'white', padding: '35px',
    borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    width: '100%', maxWidth: '500px'
  },
  title: { color: '#2d6a4f', marginBottom: '5px' },
  locationStatus: {
    fontSize: '13px', color: '#555',
    marginBottom: '20px', padding: '8px',
    backgroundColor: '#f8f9fa', borderRadius: '6px'
  },
  label: {
    display: 'block', marginBottom: '5px',
    fontSize: '14px', fontWeight: '600', color: '#333'
  },
  input: {
    width: '100%', padding: '10px',
    marginBottom: '18px', borderRadius: '8px',
    border: '1px solid #ddd', fontSize: '14px',
    boxSizing: 'border-box'
  },
  fileInput: { marginBottom: '15px', fontSize: '14px' },
  preview: {
    width: '100%', maxHeight: '200px',
    objectFit: 'cover', borderRadius: '8px',
    marginBottom: '15px'
  },
  button: {
    width: '100%', padding: '12px',
    backgroundColor: '#2d6a4f', color: 'white',
    border: 'none', borderRadius: '8px',
    fontSize: '16px', cursor: 'pointer', fontWeight: '600'
  },
  error: { color: 'red', marginBottom: '10px', fontSize: '14px' }
};

export default ReportIssue;