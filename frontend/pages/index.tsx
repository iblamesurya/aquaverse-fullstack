import { useState } from 'react';
import axios from 'axios';

export default function Home() {
  const [symptoms, setSymptoms] = useState('');
  const [temperature, setTemperature] = useState('');
  const [pH, setPH] = useState('');
  const [dissolvedOxygen, setDissolvedOxygen] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDiagnose = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setDiagnosis('');

    try {
      const response = await axios.post(
        'https://hkqmdpsswrinphdxrtpp.supabase.co/functions/v1/diagnose',
        {
          symptoms,
          pondEnvironment: {
            temperature: temperature ? parseInt(temperature) : undefined,
            pH: pH ? parseFloat(pH) : undefined,
            dissolvedOxygen: dissolvedOxygen ? parseFloat(dissolvedOxygen) : undefined,
          },
        }
      );

      setDiagnosis(response.data.diagnosis);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to get diagnosis');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🐟 Aquaaverse AI Diagnosis</h1>
      <p style={styles.subtitle}>Intelligent Aquaculture Disease Detection</p>

      <form onSubmit={handleDiagnose} style={styles.form}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Fish Symptoms *</label>
          <textarea
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            placeholder="Describe the symptoms you're observing..."
            required
            style={styles.textarea}
          />
        </div>

        <div style={styles.row}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Temperature (°C)</label>
            <input
              type="number"
              value={temperature}
              onChange={(e) => setTemperature(e.target.value)}
              placeholder="e.g., 28"
              step="0.1"
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>pH Level</label>
            <input
              type="number"
              value={pH}
              onChange={(e) => setPH(e.target.value)}
              placeholder="e.g., 6.8"
              step="0.1"
              min="0"
              max="14"
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Dissolved Oxygen (mg/L)</label>
            <input
              type="number"
              value={dissolvedOxygen}
              onChange={(e) => setDissolvedOxygen(e.target.value)}
              placeholder="e.g., 5.5"
              step="0.1"
              min="0"
              style={styles.input}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            ...styles.button,
            opacity: loading ? 0.6 : 1,
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'Analyzing...' : 'Get AI Diagnosis'}
        </button>
      </form>

      {error && (
        <div style={styles.error}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {diagnosis && (
        <div style={styles.result}>
          <h2 style={styles.resultTitle}>Diagnosis Result</h2>
          <pre style={styles.resultText}>{diagnosis}</pre>
        </div>
      )}

      <footer style={styles.footer}>
        <p>Powered by Gemini AI | Supabase Backend | Vercel Frontend</p>
      </footer>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '40px 20px',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    backgroundColor: '#f5f5f5',
    minHeight: '100vh',
  },
  title: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#1a73e8',
    marginBottom: '8px',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: '16px',
    color: '#666',
    marginBottom: '32px',
    textAlign: 'center',
  },
  form: {
    backgroundColor: 'white',
    padding: '32px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    marginBottom: '24px',
  },
  formGroup: {
    marginBottom: '20px',
    flex: 1,
  },
  row: {
    display: 'flex',
    gap: '16px',
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '600',
    color: '#333',
    marginBottom: '8px',
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    fontSize: '14px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    boxSizing: 'border-box',
  },
  textarea: {
    width: '100%',
    padding: '12px',
    fontSize: '14px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    minHeight: '120px',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
    resize: 'vertical',
  },
  button: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#1a73e8',
    color: 'white',
    fontSize: '16px',
    fontWeight: '600',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  error: {
    backgroundColor: '#fee',
    border: '1px solid #fcc',
    color: '#c33',
    padding: '16px',
    borderRadius: '4px',
    marginBottom: '24px',
  },
  result: {
    backgroundColor: 'white',
    padding: '24px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    marginBottom: '24px',
  },
  resultTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#1a73e8',
    marginBottom: '16px',
  },
  resultText: {
    backgroundColor: '#f5f5f5',
    padding: '16px',
    borderRadius: '4px',
    overflowX: 'auto',
    fontSize: '14px',
    lineHeight: '1.6',
    whiteSpace: 'pre-wrap',
    wordWrap: 'break-word',
  },
  footer: {
    textAlign: 'center',
    color: '#999',
    fontSize: '12px',
    marginTop: '40px',
  },
};
