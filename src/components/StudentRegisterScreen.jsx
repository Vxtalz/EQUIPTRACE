import React, { useState } from 'react';
import {
  ArrowLeft,
  User,
  IdCard,
  GraduationCap,
  Calendar,
  Mail,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import {
  auth,
  createUserWithEmailAndPassword,
  updateProfile,
} from '../services/firebase';
import {
  upsertUserProfile,
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

const YEAR_LEVELS = ['1st Year', '2nd Year', '3rd Year', '4th Year'];

export default function StudentRegisterScreen({ onBack, onLogin }) {
  const [firstName, setFirstName] = useState('');
  const [surname, setSurname] = useState('');
  const [studentId, setStudentId] = useState('');
  const [course, setCourse] = useState('BS Physical Education');
  const [customCourse, setCustomCourse] = useState('');
  const [yearLevel, setYearLevel] = useState('1st Year');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Real-time password validations
  const isPasswordLongEnough = password.length >= 6;
  const doPasswordsMatch = password && confirmPassword && password === confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const trimmedFirst = firstName.trim();
    const trimmedSurname = surname.trim();
    const trimmedId = studentId.trim();
    const resolvedCourse = course === 'Other' ? customCourse.trim() : course;

    // 1. Validations
    if (!trimmedFirst || !trimmedSurname) {
      setErrorMessage('Please enter both your first name and surname.');
      return;
    }

    if (!trimmedId) {
      setErrorMessage('Please provide your official Student ID.');
      return;
    }

    if (!resolvedCourse) {
      setErrorMessage('Please select or specify your program / course.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please re-type your confirm password.');
      return;
    }

    setLoading(true);

    try {
      // 2. Check if Student ID already exists in Firestore database
      const alreadyRegistered = await isStudentIdRegistered(trimmedId);
      if (alreadyRegistered) {
        setErrorMessage(`Student ID "${trimmedId}" is already registered. Please sign in instead.`);
        setLoading(false);
        return;
      }

      // 3. Email resolution for Firebase Authentication
      const safeId = trimmedId.toLowerCase().replace(/[^a-z0-9]/g, '');
      const authEmail = email.trim() || `${safeId}@equiptrace.edu`;

      // 4. Create Firebase Auth user
      const cred = await createUserWithEmailAndPassword(auth, authEmail, password);
      const user = cred.user;

      const fullName = `${trimmedFirst} ${trimmedSurname}`;

      // 5. Update Firebase Auth displayName
      try {
        await updateProfile(user, { displayName: fullName });
      } catch (err) {
        console.warn('Update displayName warning:', err.message);
      }

      // 6. Record verified student profile in Firestore 'users' collection
      const profileData = {
        uid: user.uid,
        studentId: trimmedId,
        firstName: trimmedFirst,
        surname: trimmedSurname,
        name: fullName,
        course: resolvedCourse,
        yearLevel: yearLevel,
        email: user.email || authEmail,
        role: 'Student', // STRICTLY STUDENT
      };

      await upsertUserProfile(user.uid, profileData);

      setSuccessMessage('Student account created successfully! Entering dashboard...');

      // 7. Instant login to Student Dashboard
      setTimeout(() => {
        onLogin({
          role: 'Student',
          studentId: trimmedId,
          uid: user.uid,
          email: user.email || authEmail,
          profileData: profileData,
        });
      }, 500);

    } catch (err) {
      console.error('Registration failed:', err);
      const code = err.code || '';
      if (code === 'auth/email-already-in-use') {
        setErrorMessage('This Student ID or email is already registered. Please sign in.');
      } else if (code === 'auth/invalid-email') {
        setErrorMessage('Please enter a valid email address or leave it blank.');
      } else if (code === 'auth/weak-password') {
        setErrorMessage('Password must be at least 6 characters long.');
      } else {
        setErrorMessage(err.message || 'Registration failed. Please check your information.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="student-register-screen animate-fade-in"
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100%',
        height: '100%',
        backgroundColor: '#F8FAFC',
        position: 'relative',
        overflowY: 'auto',
        overflowX: 'hidden',
        boxSizing: 'border-box',
      }}
    >
      {/* Modern Top App Bar */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 20,
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(8px)',
          borderBottom: '1px solid #E2E8F0',
          padding: '12px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <button
          type="button"
          onClick={onBack}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'none',
            border: 'none',
            color: '#1D61E7',
            fontWeight: '700',
            fontSize: '0.9rem',
            cursor: 'pointer',
            padding: '6px 8px',
            borderRadius: '10px',
            transition: 'background-color 0.15s ease',
            fontFamily: 'inherit',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#EFF6FF')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          <ArrowLeft size={18} />
          <span>Sign In</span>
        </button>

        <img
          src={equiptraceLogo}
          alt="EquipTrace"
          style={{ height: '30px', objectFit: 'contain' }}
        />

        <div style={{ width: '60px' }} />
      </div>

      {/* Main Content Area */}
      <div
        style={{
          width: '100%',
          maxWidth: '480px',
          margin: '0 auto',
          padding: '24px 20px 48px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          boxSizing: 'border-box',
        }}
      >
        {/* Hero Header */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                backgroundColor: '#EEF4FF',
                color: '#1D61E7',
                fontSize: '0.75rem',
                fontWeight: '800',
                padding: '4px 10px',
                borderRadius: '9999px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
              }}
            >
              <Sparkles size={12} />
              Student Registration
            </span>
          </div>

          <h1
            style={{
              fontSize: '1.65rem',
              fontWeight: '800',
              color: '#0F1E36',
              letterSpacing: '-0.4px',
              margin: '4px 0 0 0',
              lineHeight: '1.25',
            }}
          >
            Create your account
          </h1>
          <p
            style={{
              fontSize: '0.88rem',
              color: '#64748B',
              margin: 0,
              lineHeight: '1.4',
            }}
          >
            Fill in your student information to borrow campus equipment and manage return records.
          </p>
        </div>

        {/* Error Alert Box */}
        {errorMessage && (
          <div
            style={{
              backgroundColor: '#FEF2F2',
              border: '1px solid #FCA5A5',
              color: '#B91C1C',
              borderRadius: '14px',
              padding: '12px 14px',
              fontSize: '0.85rem',
              lineHeight: '1.4',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
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
              backgroundColor: '#F0FDF4',
              border: '1px solid #86EFAC',
              color: '#166534',
              borderRadius: '14px',
              padding: '12px 14px',
              fontSize: '0.85rem',
              lineHeight: '1.4',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <CheckCircle2 size={18} style={{ flexShrink: 0 }} />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Registration Form Cards */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* CARD 1: Personal Identification */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '18px',
              padding: '18px 20px',
              border: '1px solid #E2E8F0',
              boxShadow: '0 2px 8px rgba(15,30,54,0.03)',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '8px',
                  backgroundColor: '#EEF4FF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#1D61E7',
                }}
              >
                <User size={16} />
              </div>
              <h3 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#0F1E36', margin: 0 }}>
                Personal Information
              </h3>
            </div>

            {/* Name & Surname Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '700', color: '#475569', marginBottom: '6px' }}>
                  First Name <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="e.g. Juan"
                  style={{
                    width: '100%',
                    height: '46px',
                    padding: '0 12px',
                    borderRadius: '12px',
                    border: '1px solid #CBD5E1',
                    outline: 'none',
                    fontSize: '0.9rem',
                    color: '#0F1E36',
                    fontFamily: 'inherit',
                    backgroundColor: '#FFFFFF',
                    boxSizing: 'border-box',
                    transition: 'border-color 0.15s ease',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = '#1D61E7')}
                  onBlur={(e) => (e.target.style.borderColor = '#CBD5E1')}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '700', color: '#475569', marginBottom: '6px' }}>
                  Surname <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <input
                  type="text"
                  value={surname}
                  onChange={(e) => setSurname(e.target.value)}
                  placeholder="e.g. Dela Cruz"
                  style={{
                    width: '100%',
                    height: '46px',
                    padding: '0 12px',
                    borderRadius: '12px',
                    border: '1px solid #CBD5E1',
                    outline: 'none',
                    fontSize: '0.9rem',
                    color: '#0F1E36',
                    fontFamily: 'inherit',
                    backgroundColor: '#FFFFFF',
                    boxSizing: 'border-box',
                    transition: 'border-color 0.15s ease',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = '#1D61E7')}
                  onBlur={(e) => (e.target.style.borderColor = '#CBD5E1')}
                  required
                />
              </div>
            </div>

            {/* Student ID */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={{ fontSize: '0.78rem', fontWeight: '700', color: '#475569' }}>
                  Student ID <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <span style={{ fontSize: '0.72rem', color: '#1D61E7', fontWeight: '600' }}>
                  Primary Login ID
                </span>
              </div>
              <div style={{ position: 'relative' }}>
                <IdCard
                  size={18}
                  color="#94A3B8"
                  style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}
                />
                <input
                  type="text"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  placeholder="e.g. 2025-001 or 2024-10293"
                  style={{
                    width: '100%',
                    height: '48px',
                    paddingLeft: '42px',
                    paddingRight: '14px',
                    borderRadius: '12px',
                    border: '1px solid #CBD5E1',
                    outline: 'none',
                    fontSize: '0.92rem',
                    fontWeight: '600',
                    color: '#0F1E36',
                    fontFamily: 'inherit',
                    backgroundColor: '#FFFFFF',
                    boxSizing: 'border-box',
                    transition: 'border-color 0.15s ease',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = '#1D61E7')}
                  onBlur={(e) => (e.target.style.borderColor = '#CBD5E1')}
                  required
                />
              </div>
              <span style={{ fontSize: '0.72rem', color: '#64748B', marginTop: '4px', display: 'block' }}>
                Must be your official school-issued student number.
              </span>
            </div>
          </div>

          {/* CARD 2: Academic Program & Year Level */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '18px',
              padding: '18px 20px',
              border: '1px solid #E2E8F0',
              boxShadow: '0 2px 8px rgba(15,30,54,0.03)',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '8px',
                  backgroundColor: '#EEF4FF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#1D61E7',
                }}
              >
                <GraduationCap size={16} />
              </div>
              <h3 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#0F1E36', margin: 0 }}>
                Academic Details
              </h3>
            </div>

            {/* Program / Course */}
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '700', color: '#475569', marginBottom: '6px' }}>
                Program / Course <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <select
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                  style={{
                    width: '100%',
                    height: '48px',
                    paddingLeft: '14px',
                    paddingRight: '36px',
                    borderRadius: '12px',
                    border: '1px solid #CBD5E1',
                    outline: 'none',
                    fontSize: '0.9rem',
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

              {course === 'Other' && (
                <input
                  type="text"
                  value={customCourse}
                  onChange={(e) => setCustomCourse(e.target.value)}
                  placeholder="Type your course name..."
                  style={{
                    width: '100%',
                    height: '44px',
                    padding: '0 14px',
                    borderRadius: '12px',
                    border: '1px solid #CBD5E1',
                    outline: 'none',
                    fontSize: '0.88rem',
                    color: '#0F1E36',
                    fontFamily: 'inherit',
                    backgroundColor: '#FFFFFF',
                    marginTop: '8px',
                    boxSizing: 'border-box',
                  }}
                  required
                />
              )}
            </div>

            {/* Modern Interactive Year Level Selector */}
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '700', color: '#475569', marginBottom: '8px' }}>
                Year Level <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: '6px',
                  backgroundColor: '#F1F5F9',
                  padding: '4px',
                  borderRadius: '12px',
                }}
              >
                {YEAR_LEVELS.map((lvl) => {
                  const isSelected = yearLevel === lvl;
                  return (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setYearLevel(lvl)}
                      style={{
                        padding: '10px 0',
                        borderRadius: '9px',
                        border: 'none',
                        backgroundColor: isSelected ? '#1D61E7' : 'transparent',
                        color: isSelected ? '#FFFFFF' : '#64748B',
                        fontSize: '0.78rem',
                        fontWeight: '700',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        fontFamily: 'inherit',
                        textAlign: 'center',
                        boxShadow: isSelected ? '0 2px 6px rgba(29, 97, 231, 0.25)' : 'none',
                      }}
                    >
                      {lvl.replace(' Year', '')}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* CARD 3: Account Security & Contact */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '18px',
              padding: '18px 20px',
              border: '1px solid #E2E8F0',
              boxShadow: '0 2px 8px rgba(15,30,54,0.03)',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '8px',
                  backgroundColor: '#EEF4FF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#1D61E7',
                }}
              >
                <Lock size={16} />
              </div>
              <h3 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#0F1E36', margin: 0 }}>
                Security & Contact
              </h3>
            </div>

            {/* Email Address (Optional) */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={{ fontSize: '0.78rem', fontWeight: '700', color: '#475569' }}>
                  Email Address
                </label>
                <span style={{ fontSize: '0.7rem', color: '#64748B', backgroundColor: '#F1F5F9', padding: '2px 6px', borderRadius: '4px' }}>
                  Optional
                </span>
              </div>
              <div style={{ position: 'relative' }}>
                <Mail
                  size={18}
                  color="#94A3B8"
                  style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="For password recovery (e.g. juan@gmail.com)"
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
                  onFocus={(e) => (e.target.style.borderColor = '#1D61E7')}
                  onBlur={(e) => (e.target.style.borderColor = '#CBD5E1')}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '700', color: '#475569', marginBottom: '6px' }}>
                Password <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <Lock
                  size={18}
                  color="#94A3B8"
                  style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}
                />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 6 characters"
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
                  onFocus={(e) => (e.target.style.borderColor = '#1D61E7')}
                  onBlur={(e) => (e.target.style.borderColor = '#CBD5E1')}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
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
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '700', color: '#475569', marginBottom: '6px' }}>
                Confirm Password <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <Lock
                  size={18}
                  color="#94A3B8"
                  style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}
                />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  style={{
                    width: '100%',
                    height: '48px',
                    paddingLeft: '42px',
                    paddingRight: '44px',
                    borderRadius: '12px',
                    border: doPasswordsMatch
                      ? '1px solid #22C55E'
                      : '1px solid #CBD5E1',
                    outline: 'none',
                    fontSize: '0.9rem',
                    color: '#0F1E36',
                    fontFamily: 'inherit',
                    backgroundColor: '#FFFFFF',
                    boxSizing: 'border-box',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = doPasswordsMatch ? '#22C55E' : '#1D61E7')}
                  onBlur={(e) => (e.target.style.borderColor = doPasswordsMatch ? '#22C55E' : '#CBD5E1')}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* Password Match Status indicator */}
              {confirmPassword && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px', fontSize: '0.75rem' }}>
                  {doPasswordsMatch ? (
                    <span style={{ color: '#16A34A', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '600' }}>
                      <CheckCircle2 size={14} /> Passwords match
                    </span>
                  ) : (
                    <span style={{ color: '#DC2626', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '600' }}>
                      <AlertCircle size={14} /> Passwords do not match
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Security Notice Footnote */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 14px',
              backgroundColor: '#EFF6FF',
              borderRadius: '12px',
              fontSize: '0.75rem',
              color: '#1E40AF',
              lineHeight: '1.35',
            }}
          >
            <ShieldCheck size={18} style={{ flexShrink: 0 }} />
            <span>Your student profile is securely recorded for verified campus equipment accountability.</span>
          </div>

          {/* Main Action Submit Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              height: '52px',
              backgroundColor: loading ? '#93C5FD' : '#1D61E7',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '16px',
              fontSize: '1rem',
              fontWeight: '700',
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 14px rgba(29, 97, 231, 0.35)',
              transition: 'all 0.15s ease',
              fontFamily: 'inherit',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              marginTop: '4px',
            }}
          >
            {loading ? 'Creating Account...' : 'Complete Registration'}
            {!loading && <ArrowRight size={18} />}
          </button>

          {/* Bottom Back to Sign In Link */}
          <p style={{ textAlign: 'center', fontSize: '0.88rem', color: '#64748B', margin: '8px 0 0 0' }}>
            Already have an account?{' '}
            <button
              type="button"
              onClick={onBack}
              style={{
                background: 'none',
                border: 'none',
                color: '#1D61E7',
                fontWeight: '700',
                cursor: 'pointer',
                padding: 0,
                fontFamily: 'inherit',
                fontSize: '0.88rem',
              }}
            >
              Sign In
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
