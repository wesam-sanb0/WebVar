import React, { useState } from 'react';

const PriceComparison = () => {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('http://localhost:3000/api/price-comparison', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ link: url }),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch price comparison.');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="price-comparison"
      style={{
        maxWidth: '600px',
        margin: '3rem auto',
        padding: '2rem',
        background: 'rgba(0, 0, 0, 0.9)',
        borderRadius: '15px',
        color: 'white',
        boxShadow: '0 8px 30px rgba(0, 255, 255, 0.2)',
        border: '1px solid rgba(0, 255, 255, 0.3)',
      }}
    >
      {/* Title and Description */}
      <h2 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 'bold' }}>Price Comparison</h2>
      <p style={{ margin: '0.5rem 0 1.5rem 0', fontSize: '1rem', color: '#ccc' }}>
        Compare prices of the same product from different stores to find the best deal.
      </p>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter product URL here..."
          required
          style={{
            width: '100%',
            padding: '0.8rem',
            borderRadius: '8px',
            border: '1px solid #00bcd4',
            background: 'rgba(255, 255, 255, 0.1)',
            color: 'white',
            fontSize: '1rem',
            marginBottom: '1rem',
            outline: 'none',
          }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '0.8rem',
            background: loading ? '#666' : '#00bcd4',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '1.1rem',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'background 0.3s ease',
          }}
        >
          {loading ? 'Scanning...' : 'Scan'}
        </button>
      </form>

      {/* Error Message */}
      {error && (
        <div style={{ marginTop: '1rem', color: 'red', textAlign: 'center' }}>
          {error}
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="results" style={{ marginTop: '2rem' }}>
          {/* Original Product */}
          <div className="product-section">
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Original Product</h3>
            <p style={{ margin: '0.3rem 0', fontSize: '1rem', color: '#ccc' }}>
              <strong>Title:</strong> {result.product.title}
            </p>
            <p style={{ margin: '0.3rem 0', fontSize: '1rem', color: '#ccc' }}>
              <strong>Price:</strong> {result.product.price}
            </p>
            <p style={{ margin: '0.3rem 0', fontSize: '1rem' }}>
              <strong>Link:</strong>{' '}
              <a href={result.product.link} target="_blank" rel="noopener noreferrer" style={{ color: '#00bcd4', textDecoration: 'none' }}>
                View Product
              </a>
            </p>
          </div>

          {/* Best Deal */}
          <div className="best-deal-section" style={{ marginTop: '1.5rem' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: '#00bcd4' }}>Best Deal</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              {result.bestDeal.imageUrl && (
                <img
                  src={result.bestDeal.imageUrl}
                  alt={result.bestDeal.title}
                  style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px' }}
                />
              )}
              <div>
                <p style={{ margin: '0.3rem 0', fontSize: '1rem', color: '#ccc' }}>
                  <strong>Site:</strong> {result.bestDeal.site}
                </p>
                <p style={{ margin: '0.3rem 0', fontSize: '1rem', color: '#ccc' }}>
                  <strong>Title:</strong> {result.bestDeal.title}
                </p>
                <p style={{ margin: '0.3rem 0', fontSize: '1rem', color: '#ccc' }}>
                  <strong>Price:</strong> {result.bestDeal.price}
                </p>
                <p style={{ margin: '0.3rem 0', fontSize: '1rem' }}>
                  <strong>Link:</strong>{' '}
                  <a href={result.bestDeal.link} target="_blank" rel="noopener noreferrer" style={{ color: '#00bcd4', textDecoration: 'none' }}>
                    View Deal
                  </a>
                </p>
              </div>
            </div>
          </div>

          {/* All Results */}
          <div className="all-results-section" style={{ marginTop: '1.5rem' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>All Results</h3>
            {Object.keys(result.allResults).map((site) => (
              <div key={site} style={{ marginBottom: '1rem' }}>
                <h4 style={{ fontSize: '1.2rem', margin: '0.5rem 0', color: '#00bcd4' }}>{site}</h4>
                {result.allResults[site].length > 0 ? (
                  result.allResults[site].map((item, index) => (
                    <div
                      key={index}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        padding: '0.8rem',
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '8px',
                        marginBottom: '0.5rem',
                      }}
                    >
                      {item.imageUrl && (
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }}
                        />
                      )}
                      <div>
                        <p style={{ margin: '0.3rem 0', fontSize: '0.9rem', color: '#ccc' }}>
                          <strong>Title:</strong> {item.title}
                        </p>
                        <p style={{ margin: '0.3rem 0', fontSize: '0.9rem', color: '#ccc' }}>
                          <strong>Price:</strong> {item.price}
                        </p>
                        <p style={{ margin: '0.3rem 0', fontSize: '0.9rem' }}>
                          <strong>Link:</strong>{' '}
                          <a href={item.link} target="_blank" rel="noopener noreferrer" style={{ color: '#00bcd4', textDecoration: 'none' }}>
                            View Product
                          </a>
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p style={{ fontSize: '0.9rem', color: '#ccc' }}>No results found on {site}.</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PriceComparison;