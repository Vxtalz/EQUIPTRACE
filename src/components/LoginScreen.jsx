import React, { useState } from 'react';
import { User, Lock, Menu, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { auth, signInWithEmailAndPassword } from '../services/firebase';

export default function LoginScreen({ onLogin }) {
  const [role, setRole] = useState('Student');
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);

  // Authorized school accounts
  const AUTHORIZED_ACCOUNTS = {
    Student: [
      { id: '2025-001', pin: 'student123' },
      { id: '2023-0149', pin: 'student123' },
      { id: '2022-8901', pin: 'student123' }
    ],
    Admin: [
      { id: 'admin', pin: 'admin123' },
      { id: 'pe-office', pin: 'admin123' }
    ]
  };

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    const trimmedId = studentId.trim();
    const trimmedPass = password.trim();

    if (!trimmedId || !trimmedPass) {
      setErrorMessage('Please enter both your ID and password.');
      return;
    }

    setAuthLoading(true);

    try {
      // 1. If using Firebase Auth with an email or custom domain
      const emailTarget = trimmedId.includes('@') 
        ? trimmedId 
        : `${trimmedId.toLowerCase()}@equiptrace.edu`;

      let firebaseSuccess = false;
      try {
        const userCredential = await signInWithEmailAndPassword(auth, emailTarget, trimmedPass);
        if (userCredential && userCredential.user) {
          firebaseSuccess = true;
        }
      } catch (fbErr) {
        // Firebase auth not yet seeded or configured with this user, proceed to verified directory check
      }

      // 2. Validate against official authorized system accounts
      const validRoleAccounts = AUTHORIZED_ACCOUNTS[role];
      const matchedAccount = validRoleAccounts.find(
        acc => acc.id.toLowerCase() === trimmedId.toLowerCase() && acc.pin === trimmedPass
      );

      if (firebaseSuccess || matchedAccount) {
        onLogin({ role, studentId: trimmedId });
      } else {
        setErrorMessage(
          role === 'Student'
            ? 'Invalid Student ID or password. (Try ID: 2025-001 / Pass: student123)'
            : 'Invalid Admin credentials. (Try ID: admin / Pass: admin123)'
        );
      }
    } catch (err) {
      setErrorMessage(err.message || 'Authentication failed. Please try again.');
    } finally {
      setAuthLoading(false);
    }
  };

  return (
    <div className="login-screen animate-fade-in" style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100%',
      justifyContent: 'space-between',
      padding: '40px 24px 20px 24px',
      backgroundColor: '#FFFFFF',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Upper Content */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '10px' }}>
        {/* Circle Logo */}
        <div style={{
          width: '72px',
          height: '72px',
          borderRadius: '50%',
          backgroundColor: '#1D61E7',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '20px',
          boxShadow: '0 8px 20px rgba(29, 97, 231, 0.25)'
        }}>
          <Menu size={36} color="#FFFFFF" strokeWidth={2.5} />
        </div>

        {/* Brand Title */}
        <h1 style={{
          fontSize: '1.75rem',
          fontWeight: '800',
          color: '#0F1E36',
          letterSpacing: '-0.5px',
          marginBottom: '4px'
        }}>
          EQUIPTRACE
        </h1>
        <p style={{
          fontSize: '0.875rem',
          color: '#64748B',
          textAlign: 'center',
          maxWidth: '240px',
          lineHeight: '1.35',
          marginBottom: '24px'
        }}>
          Digital Equipment Borrowing & Accountability Platform
        </p>

        {/* Role Toggle Switcher (Student / Admin) */}
        <div style={{
          backgroundColor: '#F3F4F6',
          borderRadius: '9999px',
          padding: '4px',
          display: 'flex',
          width: '100%',
          maxWidth: '280px',
          marginBottom: '20px'
        }}>
          <button
            type="button"
            onClick={() => handleRoleChange('Student')}
            style={{
              flex: 1,
              padding: '10px 0',
              borderRadius: '9999px',
              border: 'none',
              backgroundColor: role === 'Student' ? '#1D61E7' : 'transparent',
              color: role === 'Student' ? '#FFFFFF' : '#64748B',
              fontWeight: '700',
              fontSize: '0.9rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              fontFamily: 'inherit'
            }}
          >
            Student
          </button>
          <button
            type="button"
            onClick={() => handleRoleChange('Admin')}
            style={{
              flex: 1,
              padding: '10px 0',
              borderRadius: '9999px',
              border: 'none',
              backgroundColor: role === 'Admin' ? '#1D61E7' : 'transparent',
              color: role === 'Admin' ? '#FFFFFF' : '#64748B',
              fontWeight: '700',
              fontSize: '0.9rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              fontFamily: 'inherit'
            }}
          >
            Admin
          </button>
        </div>

        {/* Error Alert Box */}
        {errorMessage && (
          <div style={{
            width: '100%',
            backgroundColor: '#FEF2F2',
            border: '1px solid #FCA5A5',
            color: '#B91C1C',
            borderRadius: '12px',
            padding: '10px 14px',
            fontSize: '0.825rem',
            lineHeight: '1.4',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '16px'
          }}>
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* ID / Username Input */}
          <div style={{ position: 'relative', width: '100%' }}>
            <div style={{
              position: 'absolute',
              left: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#94A3B8'
            }}>
              <User size={18} />
            </div>
            <input
              type="text"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              placeholder={role === 'Student' ? 'Student ID (e.g. 2025-001)' : 'Admin ID (e.g. admin)'}
              style={{
                width: '100%',
                height: '52px',
                paddingLeft: '46px',
                paddingRight: '16px',
                borderRadius: '14px',
                border: errorMessage ? '1px solid #EF4444' : '1px solid #E2E8F0',
                outline: 'none',
                fontSize: '0.95rem',
                color: '#0F1E36',
                fontFamily: 'inherit',
                backgroundColor: '#FFFFFF',
                boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
              }}
              required
            />
          </div>

          {/* Password Input */}
          <div style={{ position: 'relative', width: '100%' }}>
            <div style={{
              position: 'absolute',
              left: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#94A3B8'
            }}>
              <Lock size={18} />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              style={{
                width: '100%',
                height: '52px',
                paddingLeft: '46px',
                paddingRight: '46px',
                borderRadius: '14px',
                border: errorMessage ? '1px solid #EF4444' : '1px solid #E2E8F0',
                outline: 'none',
                fontSize: '0.95rem',
                color: '#0F1E36',
                fontFamily: 'inherit',
                backgroundColor: '#FFFFFF',
                boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
              }}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#94A3B8',
                display: 'flex',
                alignItems: 'center',
                padding: 0
              }}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={authLoading}
            style={{
              marginTop: '6px',
              width: '100%',
              height: '52px',
              backgroundColor: authLoading ? '#93C5FD' : '#1D61E7',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '14px',
              fontSize: '1rem',
              fontWeight: '700',
              cursor: authLoading ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 14px rgba(29, 97, 231, 0.3)',
              transition: 'background-color 0.2s ease, transform 0.1s ease',
              fontFamily: 'inherit'
            }}
          >
            {authLoading ? 'Signing in...' : 'Login'}
          </button>
        </form>

        {/* Forgot password */}
        <button
          type="button"
          onClick={() => setShowForgotModal(true)}
          style={{
            background: 'none',
            border: 'none',
            color: '#1D61E7',
            fontSize: '0.875rem',
            fontWeight: '600',
            marginTop: '20px',
            cursor: 'pointer',
            fontFamily: 'inherit'
          }}
        >
          Forgot password?
        </button>
      </div>

      {/* Decorative Bottom Circles (Screenshot 1 matching visual elements) */}
      <div style={{
        position: 'absolute',
        bottom: '-50px',
        left: '-30px',
        width: '150px',
        height: '150px',
        borderRadius: '50%',
        backgroundColor: '#EBF1FE',
        zIndex: 1,
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-30px',
        right: '-30px',
        width: '120px',
        height: '120px',
        borderRadius: '50%',
        backgroundColor: '#EBF1FE',
        zIndex: 1,
        pointerEvents: 'none'
      }} />

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(15, 30, 54, 0.6)',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          backdropFilter: 'blur(3px)'
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '20px',
            padding: '24px',
            width: '100%',
            maxWidth: '320px',
            textAlign: 'center',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
          }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '8px', color: '#0F1E36' }}>
              Reset Password
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: '20px', lineHeight: '1.4' }}>
              Please enter your Student ID to receive password reset instructions.
            </p>
            <input
              type="text"
              defaultValue={studentId}
              placeholder="Student ID"
              style={{
                width: '100%',
                height: '44px',
                padding: '0 14px',
                borderRadius: '10px',
                border: '1px solid #E2E8F0',
                marginBottom: '16px',
                fontSize: '0.9rem'
              }}
            />
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setShowForgotModal(false)}
                style={{
                  flex: 1,
                  padding: '10px',
                  borderRadius: '10px',
                  border: '1px solid #E2E8F0',
                  backgroundColor: '#FFFFFF',
                  color: '#64748B',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => setShowForgotModal(false)}
                style={{
                  flex: 1,
                  padding: '10px',
                  borderRadius: '10px',
                  border: 'none',
                  backgroundColor: '#1D61E7',
                  color: '#FFFFFF',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Send Link
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
