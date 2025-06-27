import React, { useState, useEffect } from 'react';
import './BananaPage.css';

const SUPPORTED = [
  { code: 'USD', name: 'Dólar estadounidense' },
  { code: 'BRL', name: 'Real brasileño' },
  { code: 'EUR', name: 'Euro' },
  { code: 'GBP', name: 'Libra esterlina' },
  { code: 'JPY', name: 'Yen japonés' },
  { code: 'AUD', name: 'Dólar australiano' },
  { code: 'CAD', name: 'Dólar canadiense' }
];

const API_BASE = (import.meta.env.VITE_FREECURRENCY_API_URL || '').replace(/\/$/, '');
const API_KEY = import.meta.env.VITE_FREECURRENCY_API_KEY;

function BananaPage() {
  const [from, setFrom] = useState('USD');
  const [to, setTo] = useState('BRL');
  const [amount, setAmount] = useState(1);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setError('');
    setResult(null);
  }, [from, to, amount]);

  const handleConvert = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const url = `${API_BASE}/v1/latest?apikey=${API_KEY}&base_currency=${from}&currencies=${to}`;
      const resp = await fetch(url);
      if (!resp.ok) throw new Error('Error consultando API');
      const data = await resp.json();
      if (!data?.data?.[to]) throw new Error('Moneda no soportada');
      setResult((amount * data.data[to]).toFixed(2));
    } catch (err) {
      setError(err.message || 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="banana-container">
      <h1 className="banana-title">Conversor de Frutas 🍌</h1>
      <form className="banana-form" onSubmit={handleConvert}>
        <div className="banana-row">
          <input
            type="number"
            min="0"
            step="any"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            className="banana-input"
          />
          <select value={from} onChange={e => setFrom(e.target.value)} className="banana-select">
            {SUPPORTED.map(opt => (
              <option key={opt.code} value={opt.code}>{opt.name}</option>
            ))}
          </select>
          <span className="banana-arrow">→</span>
          <select value={to} onChange={e => setTo(e.target.value)} className="banana-select">
            {SUPPORTED.map(opt => (
              <option key={opt.code} value={opt.code}>{opt.name}</option>
            ))}
          </select>
        </div>
        <button className="banana-btn" type="submit" disabled={loading}>
          {loading ? 'Convirtiendo...' : 'Convertir'}
        </button>
      </form>
      {result && (
        <div className="banana-result">
          <strong>Resultado:</strong> {amount} {from} = {result} {to}
        </div>
      )}
      {error && (
        <div className="banana-error">{error}</div>
      )}
    </div>
  );
}

export default BananaPage;
