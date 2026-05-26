// ChangePassword.js
import React, { useState, useContext } from 'react';
import { AuthContext } from '../AuthContext';

const ChangePassword = () => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { token } = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        setLoading(true);

        // Client-side validation
        if (newPassword !== confirmNewPassword) {
            setError('New password and confirm new password do not match.');
            setLoading(false);
            return;
        }

        if (!token) {
            setError('You must be logged in to change your password.');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/api/auth/change-password', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                credentials: 'include',
                body: JSON.stringify({
                    oldPassword,
                    newPassword,
                    confirmNewPassword,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to change password.');
            }

            setMessage('Password changed successfully!');
            setOldPassword('');
            setNewPassword('');
            setConfirmNewPassword('');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="change-password"
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
            {/* Title */}
            <h2 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
                Change Password
            </h2>

            {/* Form */}
            <form onSubmit={handleSubmit}>
                {/* Current Password */}
                <div style={{ marginBottom: '1.5rem' }}>
                    <label htmlFor="oldPassword" style={{ display: 'block', fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                        Current Password:
                    </label>
                    <input
                        type="password"
                        id="oldPassword"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        required
                        style={{
                            width: '100%',
                            padding: '0.8rem',
                            borderRadius: '8px',
                            border: '1px solid #00bcd4',
                            background: 'rgba(255, 255, 255, 0.1)',
                            color: 'white',
                            fontSize: '1rem',
                            outline: 'none',
                        }}
                    />
                </div>

                {/* New Password */}
                <div style={{ marginBottom: '1.5rem' }}>
                    <label htmlFor="newPassword" style={{ display: 'block', fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                        New Password:
                    </label>
                    <input
                        type="password"
                        id="newPassword"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        style={{
                            width: '100%',
                            padding: '0.8rem',
                            borderRadius: '8px',
                            border: '1px solid #00bcd4',
                            background: 'rgba(255, 255, 255, 0.1)',
                            color: 'white',
                            fontSize: '1rem',
                            outline: 'none',
                        }}
                    />
                </div>

                {/* Confirm New Password */}
                <div style={{ marginBottom: '1.5rem' }}>
                    <label htmlFor="confirmNewPassword" style={{ display: 'block', fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                        Confirm New Password:
                    </label>
                    <input
                        type="password"
                        id="confirmNewPassword"
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        required
                        style={{
                            width: '100%',
                            padding: '0.8rem',
                            borderRadius: '8px',
                            border: '1px solid #00bcd4',
                            background: 'rgba(255, 255, 255, 0.1)',
                            color: 'white',
                            fontSize: '1rem',
                            outline: 'none',
                        }}
                    />
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        width: '100%',
                        padding: '0.8rem',
                        background: loading ? '#666' : '#ff5722',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '1.1rem',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        transition: 'background 0.3s ease',
                    }}
                >
                    {loading ? 'Saving...' : 'Save New Password'}
                </button>
            </form>

            {/* Messages */}
            {message && (
                <div style={{ marginTop: '1rem', color: '#00bcd4', textAlign: 'center', fontSize: '1.1rem' }}>
                    {message}
                </div>
            )}
            {error && (
                <div style={{ marginTop: '1rem', color: 'red', textAlign: 'center', fontSize: '1.1rem' }}>
                    {error}
                </div>
            )}
        </div>
    );
};

export default ChangePassword;