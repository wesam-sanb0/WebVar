// UserProfile.js
import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { FaCog } from 'react-icons/fa';
import { AuthContext } from './AuthContext';

const UserProfile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { token } = useContext(AuthContext);

    useEffect(() => {
        const fetchUserProfile = async () => {
            if (!token) {
                setError('Please log in to view your profile.');
                setLoading(false);
                return;
            }

            try {
                const response = await fetch('http://localhost:3000/api/auth/profile', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                });
                console.log(response);
                if (!response.ok) {
                    throw new Error('Failed to fetch user profile.');
                }

                const data = await response.json();
                console.log(data);
                setUser(data.user || null);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, [token]);

    if (loading) {
        return <div style={{ color: 'white', textAlign: 'center', padding: '1rem' }}>Loading...</div>;
    }

    if (error) {
        return <div style={{ color: 'red', textAlign: 'center', padding: '1rem' }}>{error}</div>;
    }

    return (
        <div
            className="user-profile"
            style={{
                maxWidth: '600px', // Increased width
                margin: '3rem auto',
                padding: '2rem',
                background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.9), rgba(20, 20, 20, 0.8))',
                borderRadius: '15px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                color: 'white',
                boxShadow: '0 8px 30px rgba(0, 255, 255, 0.2)', // Cyan glow shadow
                border: '1px solid rgba(0, 255, 255, 0.3)', // Subtle cyan border
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            }}
        >
            {/* User Avatar */}
            <div
                style={{
                    width: '90px', // Increased avatar size
                    height: '90px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #444, #333)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '1.5rem',
                    border: '3px solid #00bcd4', // Cyan border for avatar
                    boxShadow: '0 0 15px rgba(0, 255, 255, 0.5)', // Glow effect
                }}
            >
                <span style={{ fontSize: '40px', color: '#888' }}>
                    {user?.username ? user.username.charAt(0).toUpperCase() : 'U'}
                </span>
            </div>

            {/* User Info */}
            <div style={{ flex: 1 }}>
                <h3 style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold', letterSpacing: '1px' }}>
                    {user?.username || 'Unknown User'}
                </h3>
                <p style={{ margin: '0.3rem 0 0 0', fontSize: '1.2rem', color: '#ccc', letterSpacing: '0.5px' }}>
                    Email: {user?.email || 'N/A'}
                </p>
            </div>

            {/* Settings Link */}
            <Link
                to="/settings"
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.7rem',
                    color: 'white',
                    textDecoration: 'none',
                    fontSize: '1.3rem',
                    padding: '0.5rem 1rem',
                    borderRadius: '5px',
                    background: 'rgba(0, 188, 212, 0.2)', // Subtle cyan background
                    transition: 'background 0.3s ease, transform 0.3s ease',
                }}
            >
                <FaCog />
                Settings
            </Link>

            {/* Inline CSS for Hover Effects */}
            <style>
                {`
                    .user-profile:hover {
                        transform: translateY(-5px);
                        box-shadow: 0 12px 40px rgba(0, 255, 255, 0.3);
                    }

                    .user-profile:hover .settings-link {
                        background: rgba(0, 188, 212, 0.4);
                        transform: scale(1.05);
                    }

                    .settings-link:hover {
                        color: #00bcd4;
                    }
                `}
            </style>
        </div>
    );
};

export default UserProfile;