import React, { useState } from 'react';
import {
  ArrowLeft,
  User,
  Mail,
  Building,
  GraduationCap,
  Calendar,
  Save,
  CheckCircle,
  Shield,
  Edit2,
  Camera,
  BadgeCheck,
} from 'lucide-react';

export default function AccountProfileScreen({ user, student, onBack, onSaveProfile }) {
  const [isEditing, setIsEditing] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: student?.name || user?.displayName || 'Juan Dela Cruz',
    idNumber: student?.id || user?.email?.split('@')[0] || '2023-0149',
    email: user?.email || 'juan.delacruz@equiptrace.edu',
    department: 'Department of Physical Education & Athletics',
    role: user?.email?.includes('@equiptrace-admin.edu') || localStorage.getItem('equiptrace_role') === 'Admin' ? 'Administrator' : 'Student',
    course: student?.course || 'Bachelor of Science in Physical Education',
    yearLevel: student?.yearLevel || '3rd Year',
    contactNumber: '+63 912 345 6789',
    officeLocation: 'Sports Complex Bldg - Room 204',
  });

  const handleSave = (e) => {
    e.preventDefault();
    if (onSaveProfile) {
      onSaveProfile(formData);
    }
    setIsEditing(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const initials = (formData.name || 'Admin')
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div
      className="account-profile-screen animate-fade-in"
      style={{
        display: 'flex',
        flexDirection: 'column',
        padding: '16px 20px 32px 20px',
        backgroundColor: '#F8FAFC',
        minHeight: '100%',
        gap: '18px',
      }}
    >
      {/* Header */}
      <div style={{ paddingTop: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              onClick={onBack}
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                backgroundColor: '#1D61E7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 10px rgba(29,97,231,0.25)',
                cursor: 'pointer',
                flexShrink: 0,
              }}
            >
              <ArrowLeft size={18} color="#FFFFFF" strokeWidth={2.5} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0F1E36', letterSpacing: '-0.3px' }}>
                Account & Profile
              </h2>
              <p style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: '500', marginTop: '1px' }}>
                Personal and institutional details
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsEditing(!isEditing)}
            style={{
              padding: '6px 14px',
              borderRadius: '20px',
              border: 'none',
              backgroundColor: isEditing ? '#EEF4FF' : '#1D61E7',
              color: isEditing ? '#1D61E7' : '#FFFFFF',
              fontSize: '0.8rem',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Edit2 size={13} />
            {isEditing ? 'Cancel' : 'Edit'}
          </button>
        </div>
      </div>

      {/* Success banner */}
      {savedSuccess && (
        <div
          style={{
            backgroundColor: '#DCFCE7',
            border: '1px solid #86EFAC',
            borderRadius: '14px',
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            color: '#15803D',
            fontSize: '0.85rem',
            fontWeight: '600',
          }}
        >
          <CheckCircle size={18} />
          Profile information updated successfully!
        </div>
      )}

      {/* Profile Card / Avatar Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #1D61E7 0%, #1251C8 100%)',
          borderRadius: '20px',
          padding: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          color: '#FFFFFF',
          boxShadow: '0 8px 24px rgba(29,97,231,0.25)',
          position: 'relative',
        }}
      >
        <div style={{ position: 'relative' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255,255,255,0.2)',
              border: '2px solid #FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.4rem',
              fontWeight: '800',
              color: '#FFFFFF',
            }}
          >
            {initials}
          </div>
          {isEditing && (
            <div
              style={{
                position: 'absolute',
                bottom: '-2px',
                right: '-2px',
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                backgroundColor: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                cursor: 'pointer',
              }}
            >
              <Camera size={13} color="#1D61E7" />
            </div>
          )}
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#FFFFFF' }}>{formData.name}</h3>
            <BadgeCheck size={18} color="#93C5FD" />
          </div>
          <span
            style={{
              display: 'inline-block',
              marginTop: '4px',
              fontSize: '0.72rem',
              fontWeight: '700',
              backgroundColor: 'rgba(255,255,255,0.2)',
              padding: '2px 8px',
              borderRadius: '9999px',
              letterSpacing: '0.3px',
            }}
          >
            {formData.role}
          </span>
          <p style={{ fontSize: '0.75rem', color: '#BFDBFE', marginTop: '4px' }}>
            ID: {formData.idNumber}
          </p>
        </div>
      </div>

      {/* Profile Form Details */}
      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {/* Full Name */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            padding: '14px 16px',
            border: '1px solid #E2E8F0',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
          }}
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              backgroundColor: '#EEF4FF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <User size={19} color="#1D61E7" />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: '700', display: 'block' }}>
              Full Name
            </label>
            {isEditing ? (
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                style={{
                  width: '100%',
                  border: 'none',
                  borderBottom: '1px solid #1D61E7',
                  padding: '2px 0',
                  fontSize: '0.9rem',
                  fontWeight: '700',
                  color: '#0F1E36',
                  outline: 'none',
                  backgroundColor: 'transparent',
                }}
              />
            ) : (
              <span style={{ fontSize: '0.9rem', fontWeight: '700', color: '#0F1E36' }}>{formData.name}</span>
            )}
          </div>
        </div>

        {/* Institutional Email */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            padding: '14px 16px',
            border: '1px solid #E2E8F0',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
          }}
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              backgroundColor: '#EEF4FF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Mail size={19} color="#1D61E7" />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: '700', display: 'block' }}>
              Institutional Email
            </label>
            <span style={{ fontSize: '0.88rem', fontWeight: '600', color: '#0F1E36' }}>{formData.email}</span>
          </div>
        </div>

        {/* Department / Office */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            padding: '14px 16px',
            border: '1px solid #E2E8F0',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
          }}
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              backgroundColor: '#ECFDF5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Building size={19} color="#10B981" />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: '700', display: 'block' }}>
              Department / Office
            </label>
            {isEditing ? (
              <input
                type="text"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                style={{
                  width: '100%',
                  border: 'none',
                  borderBottom: '1px solid #1D61E7',
                  padding: '2px 0',
                  fontSize: '0.88rem',
                  fontWeight: '600',
                  color: '#0F1E36',
                  outline: 'none',
                  backgroundColor: 'transparent',
                }}
              />
            ) : (
              <span style={{ fontSize: '0.88rem', fontWeight: '600', color: '#0F1E36' }}>
                {formData.department}
              </span>
            )}
          </div>
        </div>

        {/* Academic Program / Designation */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            padding: '14px 16px',
            border: '1px solid #E2E8F0',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
          }}
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              backgroundColor: '#FEF3C7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <GraduationCap size={19} color="#D97706" />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: '700', display: 'block' }}>
              Designation / Course
            </label>
            {isEditing ? (
              <input
                type="text"
                value={formData.course}
                onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                style={{
                  width: '100%',
                  border: 'none',
                  borderBottom: '1px solid #1D61E7',
                  padding: '2px 0',
                  fontSize: '0.88rem',
                  fontWeight: '600',
                  color: '#0F1E36',
                  outline: 'none',
                  backgroundColor: 'transparent',
                }}
              />
            ) : (
              <span style={{ fontSize: '0.88rem', fontWeight: '600', color: '#0F1E36' }}>{formData.course}</span>
            )}
          </div>
        </div>

        {/* Office Location */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            padding: '14px 16px',
            border: '1px solid #E2E8F0',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
          }}
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              backgroundColor: '#F3E8FF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Calendar size={19} color="#9333EA" />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: '700', display: 'block' }}>
              Location / Desk
            </label>
            {isEditing ? (
              <input
                type="text"
                value={formData.officeLocation}
                onChange={(e) => setFormData({ ...formData, officeLocation: e.target.value })}
                style={{
                  width: '100%',
                  border: 'none',
                  borderBottom: '1px solid #1D61E7',
                  padding: '2px 0',
                  fontSize: '0.88rem',
                  fontWeight: '600',
                  color: '#0F1E36',
                  outline: 'none',
                  backgroundColor: 'transparent',
                }}
              />
            ) : (
              <span style={{ fontSize: '0.88rem', fontWeight: '600', color: '#0F1E36' }}>
                {formData.officeLocation}
              </span>
            )}
          </div>
        </div>

        {/* Save button if editing */}
        {isEditing && (
          <button
            type="submit"
            style={{
              width: '100%',
              height: '48px',
              backgroundColor: '#1D61E7',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '14px',
              fontSize: '0.95rem',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 4px 14px rgba(29,97,231,0.3)',
              fontFamily: 'inherit',
              marginTop: '8px',
            }}
          >
            <Save size={18} />
            Save Profile Changes
          </button>
        )}
      </form>
    </div>
  );
}
