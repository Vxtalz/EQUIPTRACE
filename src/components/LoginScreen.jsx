import React, { useState } from 'react';
import {
  User,
  Lock,
  AlertCircle,
  Eye,
  EyeOff,
  IdCard,
  GraduationCap,
  Calendar,
  Mail,
  CheckCircle2,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import {
  auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
} from '../services/firebase';
import {
  upsertUserProfile,
  getUserProfile,
  findUserByStudentId,
  isStudentIdRegistered,
} from '../services/firestoreService';
import equiptraceLogo from '../assets/equiptrace-logo.png';

const COURSE_OPTIONS = [
  'BS Physical Education',
  'BS Exercise and Sports Sciences',
  'BS Information Technology',
  'BS Computer Science',
  'BS Nursing',
  'BS Criminology',
  'BS Business Administration',
  'BS Hospitality Management',
  'Bachelor of Elementary Education (BEEd)',
  'Bachelor of Secondary Education (BSEd)',
  'Other',
];

const YEAR_LEVEL_OPTIONS = [
  '1st Year',
  '2nd Year',
  '3rd Year',
  '4th Year',
];

export default function LoginScreen({ onLogin }) {
  const [role, setRole] = useState('Student'); // 'Student' | 'Admin'
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // ── Login state ──
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // ── Registration state ──
  const [regFirstName, setRegFirstName] = useState('');
  const [regSurname, setRegSurname] = useState('');
  const [regStudentId, setRegStudentId] = useState('');
  const [regCourse, setRegCourse] = useState('BS Physical Education');
  const [regCustomCourse, setRegCustomCourse] = useState('');
  const [regYearLevel, setRegYearLevel] = useState('1st Year');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regShowPassword, setRegShowPassword] = useState(false);

  // ── Forgot Password state ──
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotId, setForgotId] = useState('');
  const [forgotSent, setForgotSent] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState('');

  const toEmail = (id, r) =>
    id.includes('@')
      ? id
      : `${id.toLowerCase().replace(/[^a-z0-9]/g, '')}@${r === 'Admin' ? 'equiptrace-admin.edu' : 'equiptrace.edu'}`;

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    setErrorMessage('');
    setSuccessMessage('');
    // Admins only have sign in, no registration
    if (newRole === 'Admin') {
      setAuthMode('login');
    }
  };

  const handleModeChange = (newMode) => {
    setAuthMode(newMode);
    setErrorMessage('');
    setSuccessMessage('');
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // STUDENT REGISTRATION HANDLER
  // ─────────────────────────────────────────────────────────────────────────────
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const firstName = regFirstName.trim();
    const surname = regSurname.trim();
    const sid = regStudentId.trim();
    const selectedCourse = regCourse === 'Other' ? regCustomCourse.trim() : regCourse;
    const yearLevel = regYearLevel;
    const pass = regPassword;
    const confirmPass = regConfirmPassword;
    const optionalEmail = regEmail.trim();

    // 1. Validation
    if (!firstName || !surname || !sid || !selectedCourse || !yearLevel || !pass) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    if (pass.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    if (pass !== confirmPass) {
      setErrorMessage('Passwords do not match. Please re-enter.');
      return;
    }

    setAuthLoading(true);

    try {
      // 2. Check if Student ID is already recorded in database
      const alreadyExists = await isStudentIdRegistered(sid);
      if (alreadyExists) {
        setErrorMessage(`Student ID "${sid}" is already registered. Please sign in instead.`);
        setAuthLoading(false);
        return;
      }

      // 3. Format email for Firebase Auth
      // If optional email provided, use it; otherwise use safe studentId@equiptrace.edu
      const safeId = sid.toLowerCase().replace(/[^a-z0-9]/g, '');
      const authEmail = optionalEmail || `${safeId}@equiptrace.edu`;

      // 4. Create user in Firebase Auth
      const cred = await createUserWithEmailAndPassword(auth, authEmail, pass);
      const user = cred.user;

      const fullName = `${firstName} ${surname}`;

      // 5. Update Firebase Auth displayName
      try {
        await updateProfile(user, { displayName: fullName });
      } catch (err) {
        console.warn('updateProfile warning:', err.message);
      }

      // 6. Record full student profile in Firestore 'users' collection
      const profileData = {
        uid: user.uid,
        studentId: sid,
        firstName: firstName,
        surname: surname,
        name: fullName,
        course: selectedCourse,
        yearLevel: yearLevel,
        email: user.email || authEmail,
        role: 'Student', // STRICTLY STUDENT ROLE!
      };

      await upsertUserProfile(user.uid, profileData);

      setSuccessMessage('Registration successful! Redirecting to student dashboard...');

      // 7. Directly sign student into Student Dashboard
      setTimeout(() => {
        onLogin({
          role: 'Student',
          studentId: sid,
          uid: user.uid,
          email: user.email || authEmail,
          profileData: profileData,
        });
      }, 500);

    } catch (err) {
      console.error('Registration error:', err);
      const code = err.code || '';
      if (code === 'auth/email-already-in-use') {
        setErrorMessage('This Student ID or email is already registered. Please sign in.');
      } else if (code === 'auth/invalid-email') {
        setErrorMessage('Please enter a valid email address or leave it blank.');
      } else if (code === 'auth/weak-password') {
        setErrorMessage('Password must be at least 6 characters.');
      } else {
        setErrorMessage(err.message || 'Registration failed. Please check your information.');
      }
    } finally {
      setAuthLoading(false);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // LOGIN SUBMIT HANDLER (Strict Role Enforcement)
  // ─────────────────────────────────────────────────────────────────────────────
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    const trimmedId = studentId.trim();
    const trimmedPass = password.trim();

    if (!trimmedId || !trimmedPass) {
      setErrorMessage('Please enter both your ID and password.');
      return;
    }

    setAuthLoading(true);
    try {
      let email = toEmail(trimmedId, role);
      let foundProfile = null;

      // If logging in as Student, check if studentId is recorded in Firestore
      if (role === 'Student') {
        try {
          foundProfile = await findUserByStudentId(trimmedId);
          if (foundProfile && foundProfile.email) {
            email = foundProfile.email;
          }
        } catch (err) {
          console.warn('Student lookup in Firestore warning:', err.message);
        }
      }

      const cred = await signInWithEmailAndPassword(auth, email, trimmedPass);
      const authedEmail = (cred.user.email || email).toLowerCase();

      // Retrieve user's verified Firestore profile
      const userProfile = foundProfile || (await getUserProfile(cred.user.uid));
      const isStudentProfile = userProfile?.role === 'Student';
      const isAdminProfile = userProfile?.role === 'Admin';

      const isAdminAccount =
        isAdminProfile ||
        (!isStudentProfile && (
          authedEmail.includes('@equiptrace-admin.edu') ||
          authedEmail.startsWith('admin@') ||
          authedEmail === 'admin@gmail.com'
        ));

      // ── Strict Role Boundary Enforcement ──
      // Student attempting to access Admin dashboard:
      if (role === 'Admin' && (isStudentProfile || !isAdminAccount)) {
        await auth.signOut();
        setErrorMessage('Access denied. Student accounts are not permitted in the Administrator dashboard.');
        return;
      }

      // Admin attempting to sign in on Student tab:
      if (role === 'Student' && isAdminAccount && !isStudentProfile) {
        await auth.signOut();
        setErrorMessage('This account is registered as an Administrator. Please switch to the "Admin" tab to sign in.');
        return;
      }

      const finalRole = isAdminAccount ? 'Admin' : 'Student';
      onLogin({
        role: finalRole,
        studentId: userProfile?.studentId || trimmedId,
        uid: cred.user.uid,
        email: authedEmail,
        profileData: userProfile,
      });
    } catch (err) {
      const code = err.code || '';
      if (
        code === 'auth/user-not-found' ||
        code === 'auth/wrong-password' ||
        code === 'auth/invalid-credential'
      ) {
        setErrorMessage('Invalid ID or password. Please check your credentials.');
      } else if (code === 'auth/too-many-requests') {
        setErrorMessage('Too many failed attempts. Please try again later.');
      } else {
        setErrorMessage(err.message || 'Authentication failed. Please try again.');
      }
    } finally {
      setAuthLoading(false);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // FORGOT PASSWORD HANDLER
  // ─────────────────────────────────────────────────────────────────────────────
  const handleForgotSubmit = async () => {
    const id = forgotId.trim() || studentId.trim();
    if (!id) {
      setForgotError('Please enter your Student ID or Email first.');
      return;
    }
    setForgotLoading(true);
    setForgotError('');
    try {
      let email = toEmail(id, role);
      try {
        const studentRecord = await findUserByStudentId(id);
        if (studentRecord?.email) email = studentRecord.email;
      } catch (e) {
        // Fall back to default email
      }
      await sendPasswordResetEmail(auth, email);
      setForgotSent(true);
    } catch (err) {
      setForgotError('Could not send reset email. Please verify your ID or registered email.');
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div
      className="login-screen animate-fade-in"
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100%',
        height: '100%',
        backgroundColor: '#FFFFFF',
        position: 'relative',
        overflowY: 'auto',
        overflowX: 'hidden',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '32px 24px 40px 24px',
          width: '100%',
          maxWidth: '460px',
          margin: '0 auto',
          position: 'relative',
          zIndex: 2,
        }}
      >
        {/* EquipTrace Official Logo */}
        <div style={{ marginBottom: '12px', marginTop: '4px' }}>
          <img
            src={equiptraceLogo}
            alt="EquipTrace"
            style={{
              width: '240px',
              maxHeight: '80px',
              objectFit: 'contain',
              display: 'block',
            }}
          />
        </div>

        {/* Subtitle */}
        <p
          style={{
            fontSize: '0.85rem',
            color: '#64748B',
            textAlign: 'center',
            maxWidth: '300px',
            lineHeight: '1.4',
            marginBottom: '18px',
          }}
        >
          {role === 'Admin'
            ? 'Administrative Portal — Equipment & Approval Control'
            : authMode === 'register'
            ? 'Create your verified student account to borrow equipment'
            : 'Digital Equipment Borrowing & Accountability Platform'}
        </p>

        {/* Role Toggle Switcher (Student / Admin) */}
        <div
          style={{
            backgroundColor: '#F1F5F9',
            borderRadius: '9999px',
            padding: '4px',
            display: 'flex',
            width: '100%',
            maxWidth: '280px',
            marginBottom: '16px',
            border: '1px solid #E2E8F0',
          }}
        >
          <button
            type="button"
            onClick={() => handleRoleChange('Student')}
            style={{
              flex: 1,
              padding: '9px 0',
              borderRadius: '9999px',
              border: 'none',
              backgroundColor: role === 'Student' ? '#1D61E7' : 'transparent',
              color: role === 'Student' ? '#FFFFFF' : '#64748B',
              fontWeight: '700',
              fontSize: '0.88rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              fontFamily: 'inherit',
            }}
          >
            Student
          </button>
          <button
            type="button"
            onClick={() => handleRoleChange('Admin')}
            style={{
              flex: 1,
              padding: '9px 0',
              borderRadius: '9999px',
              border: 'none',
              backgroundColor: role === 'Admin' ? '#1D61E7' : 'transparent',
              color: role === 'Admin' ? '#FFFFFF' : '#64748B',
              fontWeight: '700',
              fontSize: '0.88rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              fontFamily: 'inherit',
            }}
          >
            Admin
          </button>
        </div>

        {/* Student Auth Mode Tabs: Sign In / Register (Only for Student Role) */}
        {role === 'Student' && (
          <div
            style={{
              display: 'flex',
              width: '100%',
              maxWidth: '320px',
              backgroundColor: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: '12px',
              padding: '3px',
              marginBottom: '20px',
              gap: '4px',
            }}
          >
            <button
              type="button"
              onClick={() => handleModeChange('login')}
              style={{
                flex: 1,
                padding: '8px 0',
                borderRadius: '9px',
                border: 'none',
                backgroundColor: authMode === 'login' ? '#EEF4FF' : 'transparent',
                color: authMode === 'login' ? '#1D61E7' : '#64748B',
                fontWeight: '700',
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                fontFamily: 'inherit',
              }}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => handleModeChange('register')}
              style={{
                flex: 1,
                padding: '8px 0',
                borderRadius: '9px',
                border: 'none',
                backgroundColor: authMode === 'register' ? '#EEF4FF' : 'transparent',
                color: authMode === 'register' ? '#1D61E7' : '#64748B',
                fontWeight: '700',
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                fontFamily: 'inherit',
              }}
            >
              Create Account
            </button>
          </div>
        )}

        {/* Error Alert Box */}
        {errorMessage && (
          <div
            style={{
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
              marginBottom: '16px',
            }}
          >
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Success Alert Box */}
        {successMessage && (
          <div
            style={{
              width: '100%',
              backgroundColor: '#F0FDF4',
              border: '1px solid #86EFAC',
              color: '#166534',
              borderRadius: '12px',
              padding: '10px 14px',
              fontSize: '0.825rem',
              lineHeight: '1.4',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '16px',
            }}
          >
            <CheckCircle2 size={18} style={{ flexShrink: 0 }} />
            <span>{successMessage}</span>
          </div>
        )}

        {/* ────────────────────────────────────────────────────────────────── */}
        {/* REGISTRATION FORM (STUDENT ONLY) */}
        {/* ────────────────────────────────────────────────────────────────── */}
        {role === 'Student' && authMode === 'register' ? (
          <form
            onSubmit={handleRegisterSubmit}
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            {/* Name & Surname Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {/* First Name */}
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>
                  First Name <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <User size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text"
                    value={regFirstName}
                    onChange={(e) => setRegFirstName(e.target.value)}
                    placeholder="e.g. Juan"
                    style={{
                      width: '100%',
                      height: '46px',
                      paddingLeft: '36px',
                      paddingRight: '12px',
                      borderRadius: '12px',
                      border: '1px solid #CBD5E1',
                      outline: 'none',
                      fontSize: '0.9rem',
                      color: '#0F1E36',
                      fontFamily: 'inherit',
                      backgroundColor: '#FFFFFF',
                      boxSizing: 'border-box',
                    }}
                    required
                  />
                </div>
              </div>

              {/* Surname */}
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>
                  Surname <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <User size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text"
                    value={regSurname}
                    onChange={(e) => setRegSurname(e.target.value)}
                    placeholder="e.g. Dela Cruz"
                    style={{
                      width: '100%',
                      height: '46px',
                      paddingLeft: '36px',
                      paddingRight: '12px',
                      borderRadius: '12px',
                      border: '1px solid #CBD5E1',
                      outline: 'none',
                      fontSize: '0.9rem',
                      color: '#0F1E36',
                      fontFamily: 'inherit',
                      backgroundColor: '#FFFFFF',
                      boxSizing: 'border-box',
                    }}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Student ID */}
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>
                Student ID <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <IdCard size={18} color="#94A3B8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  value={regStudentId}
                  onChange={(e) => setRegStudentId(e.target.value)}
                  placeholder="e.g. 2025-001 or 2024-10293"
                  style={{
                    width: '100%',
                    height: '48px',
                    paddingLeft: '42px',
                    paddingRight: '14px',
                    borderRadius: '12px',
                    border: '1px solid #CBD5E1',
                    outline: 'none',
                    fontSize: '0.9rem',
                    color: '#0F1E36',
                    fontFamily: 'inherit',
                    backgroundColor: '#FFFFFF',
                    boxSizing: 'border-box',
                  }}
                  required
                />
              </div>
              <span style={{ fontSize: '0.72rem', color: '#64748B', marginTop: '2px', display: 'block' }}>
                You will use this ID to sign in and borrow gear.
              </span>
            </div>

            {/* Program / Course */}
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>
                Program / Course <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <GraduationCap size={18} color="#94A3B8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                <select
                  value={regCourse}
                  onChange={(e) => setRegCourse(e.target.value)}
                  style={{
                    width: '100%',
                    height: '48px',
                    paddingLeft: '42px',
                    paddingRight: '14px',
                    borderRadius: '12px',
                    border: '1px solid #CBD5E1',
                    outline: 'none',
                    fontSize: '0.88rem',
                    color: '#0F1E36',
                    fontFamily: 'inherit',
                    backgroundColor: '#FFFFFF',
                    boxSizing: 'border-box',
                    cursor: 'pointer',
                  }}
                  required
                >
                  {COURSE_OPTIONS.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              {regCourse === 'Other' && (
                <input
                  type="text"
                  value={regCustomCourse}
                  onChange={(e) => setRegCustomCourse(e.target.value)}
                  placeholder="Specify your program / course"
                  style={{
                    width: '100%',
                    height: '44px',
                    paddingLeft: '14px',
                    paddingRight: '14px',
                    borderRadius: '12px',
                    border: '1px solid #CBD5E1',
                    outline: 'none',
                    fontSize: '0.88rem',
                    color: '#0F1E36',
                    fontFamily: 'inherit',
                    backgroundColor: '#FFFFFF',
                    marginTop: '6px',
                    boxSizing: 'border-box',
                  }}
                  required
                />
              )}
            </div>

            {/* Year Level */}
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>
                Year Level <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <Calendar size={18} color="#94A3B8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                <select
                  value={regYearLevel}
                  onChange={(e) => setRegYearLevel(e.target.value)}
                  style={{
                    width: '100%',
                    height: '48px',
                    paddingLeft: '42px',
                    paddingRight: '14px',
                    borderRadius: '12px',
                    border: '1px solid #CBD5E1',
                    outline: 'none',
                    fontSize: '0.88rem',
                    color: '#0F1E36',
                    fontFamily: 'inherit',
                    backgroundColor: '#FFFFFF',
                    boxSizing: 'border-box',
                    cursor: 'pointer',
                  }}
                  required
                >
                  {YEAR_LEVEL_OPTIONS.map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Email Address (Optional) */}
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>
                Email Address <span style={{ color: '#94A3B8', fontWeight: '400' }}>(Optional)</span>
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} color="#94A3B8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="Optional (e.g. juan@gmail.com)"
                  style={{
                    width: '100%',
                    height: '48px',
                    paddingLeft: '42px',
                    paddingRight: '14px',
                    borderRadius: '12px',
                    border: '1px solid #CBD5E1',
                    outline: 'none',
                    fontSize: '0.9rem',
                    color: '#0F1E36',
                    fontFamily: 'inherit',
                    backgroundColor: '#FFFFFF',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>
                Password <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} color="#94A3B8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type={regShowPassword ? 'text' : 'password'}
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  style={{
                    width: '100%',
                    height: '48px',
                    paddingLeft: '42px',
                    paddingRight: '44px',
                    borderRadius: '12px',
                    border: '1px solid #CBD5E1',
                    outline: 'none',
                    fontSize: '0.9rem',
                    color: '#0F1E36',
                    fontFamily: 'inherit',
                    backgroundColor: '#FFFFFF',
                    boxSizing: 'border-box',
                  }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setRegShowPassword(!regShowPassword)}
                  style={{
                    position: 'absolute',
                    right: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#94A3B8',
                    padding: 0,
                  }}
                >
                  {regShowPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>
                Confirm Password <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} color="#94A3B8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type={regShowPassword ? 'text' : 'password'}
                  value={regConfirmPassword}
                  onChange={(e) => setRegConfirmPassword(e.target.value)}
                  placeholder="Re-enter your password"
                  style={{
                    width: '100%',
                    height: '48px',
                    paddingLeft: '42px',
                    paddingRight: '14px',
                    borderRadius: '12px',
                    border: '1px solid #CBD5E1',
                    outline: 'none',
                    fontSize: '0.9rem',
                    color: '#0F1E36',
                    fontFamily: 'inherit',
                    backgroundColor: '#FFFFFF',
                    boxSizing: 'border-box',
                  }}
                  required
                />
              </div>
            </div>

            {/* Register Submit Button */}
            <button
              type="submit"
              disabled={authLoading}
              style={{
                marginTop: '10px',
                width: '100%',
                height: '50px',
                backgroundColor: authLoading ? '#93C5FD' : '#1D61E7',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '14px',
                fontSize: '0.95rem',
                fontWeight: '700',
                cursor: authLoading ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 14px rgba(29, 97, 231, 0.3)',
                transition: 'all 0.15s ease',
                fontFamily: 'inherit',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              {authLoading ? 'Creating Student Account...' : 'Complete Registration'}
              {!authLoading && <ArrowRight size={18} />}
            </button>

            {/* Switch back to login link */}
            <p style={{ textAlign: 'center', fontSize: '0.85rem', color: '#64748B', marginTop: '12px' }}>
              Already registered?{' '}
              <button
                type="button"
                onClick={() => handleModeChange('login')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#1D61E7',
                  fontWeight: '700',
                  cursor: 'pointer',
                  padding: 0,
                  fontFamily: 'inherit',
                }}
              >
                Sign In
              </button>
            </p>
          </form>
        ) : (
          /* ────────────────────────────────────────────────────────────────── */
          /* SIGN IN FORM (FOR STUDENT AND ADMIN) */
          /* ────────────────────────────────────────────────────────────────── */
          <form
            onSubmit={handleLoginSubmit}
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
            }}
          >
            {/* ID / Username Input */}
            <div style={{ position: 'relative', width: '100%' }}>
              <div
                style={{
                  position: 'absolute',
                  left: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#94A3B8',
                }}
              >
                {role === 'Student' ? <IdCard size={18} /> : <User size={18} />}
              </div>
              <input
                type="text"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                placeholder={role === 'Student' ? 'Student ID (e.g. 2025-001)' : 'Admin ID or Email'}
                style={{
                  width: '100%',
                  height: '52px',
                  paddingLeft: '46px',
                  paddingRight: '16px',
                  borderRadius: '14px',
                  border: errorMessage ? '1px solid #EF4444' : '1px solid #CBD5E1',
                  outline: 'none',
                  fontSize: '0.95rem',
                  color: '#0F1E36',
                  fontFamily: 'inherit',
                  backgroundColor: '#FFFFFF',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                  boxSizing: 'border-box',
                }}
                required
              />
            </div>

            {/* Password Input */}
            <div style={{ position: 'relative', width: '100%' }}>
              <div
                style={{
                  position: 'absolute',
                  left: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#94A3B8',
                }}
              >
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
                  border: errorMessage ? '1px solid #EF4444' : '1px solid #CBD5E1',
                  outline: 'none',
                  fontSize: '0.95rem',
                  color: '#0F1E36',
                  fontFamily: 'inherit',
                  backgroundColor: '#FFFFFF',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                  boxSizing: 'border-box',
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
                  padding: 0,
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Role Notice */}
            {role === 'Admin' && (
              <div
                style={{
                  backgroundColor: '#EFF6FF',
                  border: '1px solid #BFDBFE',
                  borderRadius: '10px',
                  padding: '8px 12px',
                  fontSize: '0.78rem',
                  color: '#1E40AF',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <ShieldAlert size={16} style={{ flexShrink: 0 }} />
                <span>Authorized administrators only. Student accounts are prohibited.</span>
              </div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={authLoading}
              style={{
                marginTop: '4px',
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
                fontFamily: 'inherit',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              {authLoading ? 'Signing in...' : 'Sign In'}
              {!authLoading && <ArrowRight size={18} />}
            </button>

            {/* Forgot password */}
            <button
              type="button"
              onClick={() => setShowForgotModal(true)}
              style={{
                background: 'none',
                border: 'none',
                color: '#1D61E7',
                fontSize: '0.85rem',
                fontWeight: '600',
                marginTop: '8px',
                cursor: 'pointer',
                fontFamily: 'inherit',
                textAlign: 'center',
              }}
            >
              Forgot password?
            </button>

            {/* New student prompt */}
            {role === 'Student' && (
              <p
                style={{
                  textAlign: 'center',
                  fontSize: '0.85rem',
                  color: '#64748B',
                  marginTop: '12px',
                }}
              >
                New student?{' '}
                <button
                  type="button"
                  onClick={() => handleModeChange('register')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#1D61E7',
                    fontWeight: '700',
                    cursor: 'pointer',
                    padding: 0,
                    fontFamily: 'inherit',
                  }}
                >
                  Create an account
                </button>
              </p>
            )}
          </form>
        )}
      </div>

      {/* Decorative Bottom Circles */}
      <div
        style={{
          position: 'absolute',
          bottom: '-50px',
          left: '-30px',
          width: '150px',
          height: '150px',
          borderRadius: '50%',
          backgroundColor: '#EBF1FE',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-30px',
          right: '-30px',
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          backgroundColor: '#EBF1FE',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15,30,54,0.6)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            backdropFilter: 'blur(3px)',
          }}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              padding: '24px',
              width: '100%',
              maxWidth: '340px',
              textAlign: 'center',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            }}
          >
            {forgotSent ? (
              <>
                <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>📧</div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#0F1E36', marginBottom: '8px' }}>
                  Email Sent!
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: '20px', lineHeight: '1.4' }}>
                  Check your inbox for password reset instructions.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotModal(false);
                    setForgotSent(false);
                    setForgotId('');
                  }}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '10px',
                    border: 'none',
                    backgroundColor: '#1D61E7',
                    color: '#FFFFFF',
                    fontWeight: '600',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                  }}
                >
                  Close
                </button>
              </>
            ) : (
              <>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '8px', color: '#0F1E36' }}>
                  Reset Password
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: '16px', lineHeight: '1.4' }}>
                  Enter your Student ID or registered email to receive a password reset link.
                </p>
                <input
                  type="text"
                  value={forgotId || studentId}
                  onChange={(e) => setForgotId(e.target.value)}
                  placeholder={role === 'Student' ? 'Student ID or Email' : 'Admin ID or Email'}
                  style={{
                    width: '100%',
                    height: '44px',
                    padding: '0 14px',
                    borderRadius: '10px',
                    border: '1px solid #E2E8F0',
                    marginBottom: '8px',
                    fontSize: '0.9rem',
                    fontFamily: 'inherit',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
                {forgotError && (
                  <p style={{ fontSize: '0.8rem', color: '#DC2626', marginBottom: '8px' }}>
                    {forgotError}
                  </p>
                )}
                <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForgotModal(false);
                      setForgotSent(false);
                      setForgotError('');
                    }}
                    style={{
                      flex: 1,
                      padding: '10px',
                      borderRadius: '10px',
                      border: '1px solid #E2E8F0',
                      backgroundColor: '#FFFFFF',
                      color: '#64748B',
                      fontWeight: '600',
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleForgotSubmit}
                    disabled={forgotLoading}
                    style={{
                      flex: 1,
                      padding: '10px',
                      borderRadius: '10px',
                      border: 'none',
                      backgroundColor: forgotLoading ? '#93C5FD' : '#1D61E7',
                      color: '#FFFFFF',
                      fontWeight: '600',
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                    }}
                  >
                    {forgotLoading ? 'Sending...' : 'Send Link'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
