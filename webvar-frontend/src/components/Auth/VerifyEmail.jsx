// VerifyEmail.js (Alternative Solution)
import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const VerifyEmail = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [message, setMessage] = useState('Verifying your email...');
    const [error, setError] = useState(null);
    const hasVerified = useRef(false); // Track if the API call has been made

    useEffect(() => {
        const verifyEmail = async () => {
 
            if (hasVerified.current) {
                return;
            }

            hasVerified.current = true;

            const token = searchParams.get('token');

            if (!token) {
                setError('No verification token provided.');
                return;
            }

            try {
                const response = await fetch(`http://localhost:3000/api/auth/verify-email?token=${token}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                });

                console.log(response);

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Failed to verify email.');
                }

                setMessage('Email verified successfully! Redirecting to homepage...');
                setTimeout(() => {
                    navigate('/');
                }, 2000); // Redirect after 2 seconds
            } catch (err) {
                setError(err.message);
            }
        };

        verifyEmail();
    }, [searchParams, navigate]);

    return (
        <div
            style={{
                maxWidth: '600px',
                margin: '3rem auto',
                padding: '2rem',
                background: 'rgba(0, 0, 0, 0.9)',
                borderRadius: '15px',
                color: 'white',
                boxShadow: '0 8px 30px rgba(0, 255, 255, 0.2)',
                border: '1px solid rgba(0, 255, 255, 0.3)',
                textAlign: 'center',
            }}
        >
            <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                Email Verification
            </h2>
            {error ? (
                <p style={{ color: 'red', fontSize: '1.2rem' }}>{error}</p>
            ) : (
                <p style={{ fontSize: '1.2rem', color: '#ccc' }}>{message}</p>
            )}
        </div>
    );
};

export default VerifyEmail;