import React, { useState } from 'react';

const SecureShopping = () => {
    const [url, setUrl] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setResult(null);

        try {
            const response = await fetch('http://localhost:3000/api/url-phishing', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ url }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to check URL safety.');
            }

            const data = await response.json();

            // Calculate confidence
            let confidence = 1.0; // Start at 100%

            // Manual check: reduce 10% per issue
            const manualCheck = data.details.find((check) => !check.source);
            if (manualCheck && manualCheck.issues.length > 0) {
                confidence -= 0.1 * manualCheck.issues.length;
            }

            // Google Safe Browsing: reduce 50% if unsafe
            const googleCheck = data.details.find((check) => check.source === 'GoogleSafeBrowsing');
            if (googleCheck && !googleCheck.isSafe) {
                confidence -= 0.5;
            }

            // Ensure confidence is between 0 and 1
            confidence = Math.max(0, Math.min(1, confidence));

            // Derive label based on confidence thresholds
            let label;
            if (confidence >= 0.9) {
                label = 'Safe Website';
            } else if (confidence < 0.9 && confidence >= 0.7) {
                label = 'Potentially Unwanted';
            } else if (confidence < 0.7 && confidence >= 0.6) {
                label = 'Risky';
            } else {
                label = 'Unsafe';
            }
            setResult({ ...data, confidence, label });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="secure-shopping"
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
            <h2 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 'bold' }}>Secure Shopping</h2>
            <p style={{ margin: '0.5rem 0 1.5rem 0', fontSize: '1rem', color: '#ccc' }}>
                Ensure your online shopping safety by checking website security
            </p>

            {/* Form */}
            <form onSubmit={handleSubmit}>
                <label htmlFor="url" style={{ display: 'block', fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                    Enter the website URL you want to check:
                </label>
                <input
                    id="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="Enter website URL..."
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
                    {loading ? 'Checking...' : 'Check Security'}
                </button>
            </form>

            {/* Error Message */}
            {error && (
                <div style={{ marginTop: '1rem', color: 'red', textAlign: 'center', fontSize: '1.1rem' }}>
                    {error}
                </div>
            )}

            {/* Scan Results */}
            <div className="scan-results" style={{ marginTop: '2rem' }}>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Scan Results</h3>
                {result ? (
                    <div style={{ padding: '1rem', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '8px' }}>
                        <p style={{ margin: '0.3rem 0', fontSize: '1rem', color: '#ccc' }}>
                            <strong>URL:</strong> {result.url}
                        </p>
                        <p style={{ margin: '0.3rem 0', fontSize: '1rem' }}>
                            <strong>Status:</strong>{' '}
                            <span
                                style={{
                                    color:
                                        result.label === 'Safe Website'
                                            ? '#00bcd4'
                                            : result.label === 'Potentially Unwanted'
                                                ? '#ff9800'
                                                : result.label === 'Risky'
                                                    ? '#f44336'
                                                    : '#d32f2f',
                                }}
                            >
                                {result.label}
                            </span>
                        </p>
                        <p style={{ margin: '0.3rem 0', fontSize: '1rem', color: '#ccc' }}>
                            <strong>Confidence:</strong> {(result.confidence * 100).toFixed(2)}%
                        </p>
                        {/* Display detailed results */}
                        <div style={{ marginTop: '1rem' }}>
                            <strong>Details:</strong>
                            {result.details.map((check, index) => (
                                <div key={index} style={{ margin: '0.5rem 0', fontSize: '0.95rem', color: '#ccc' }}>
                                    {check.source === 'GoogleSafeBrowsing' ? (
                                        <>
                                            <p><strong>Google Safe Browsing:</strong> {check.message}</p>
                                            {check.details.length > 0 && (
                                                <ul>
                                                    {check.details.map((threat, i) => (
                                                        <li key={i}>Threat Type: {threat.threatType}</li>
                                                    ))}
                                                </ul>
                                            )}
                                        </>
                                    ) : (
                                        <>
                                            <p><strong>Manual Check:</strong></p>
                                            {check.issues.length > 0 ? (
                                                <ul>
                                                    {check.issues.map((issue, i) => (
                                                        <li key={i}>{issue}</li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <p>No issues detected</p>
                                            )}
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <p style={{ fontSize: '1rem', color: '#ccc' }}>No website scanned yet</p>
                )}
            </div>
        </div>
    );
};

export default SecureShopping;