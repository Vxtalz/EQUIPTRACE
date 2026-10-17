import React from 'react';
import {
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  Clock,
  HelpCircle,
  FileText,
  Mail,
  MapPin,
  Phone,
  QrCode,
  Layers,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

export default function AboutScreen({ onBack }) {
  const policies = [
    {
      title: 'Standard Borrowing Period',
      desc: 'All PE and sports equipment must be returned on the same day before 5:00 PM.',
      icon: <Clock size={18} color="#1D61E7" />,
    },
    {
      title: 'Physical Inspection Standard',
      desc: 'Equipment is verified upon return for structural integrity, deflation, or missing accessories.',
      icon: <ShieldCheck size={18} color="#10B981" />,
    },
    {
      title: 'Lost or Damaged Policy',
      desc: 'Any lost, deflated, or damaged items must be reported immediately to the PE office counter.',
      icon: <HelpCircle size={18} color="#F59E0B" />,
    },
  ];

  const specs = [
    { label: 'Platform Version', value: 'v2.4.0 (Production)' },
    { label: 'Build Release', value: 'October 2026' },
    { label: 'Cloud Database', value: 'Google Cloud Firestore' },
    { label: 'Auth & Security', value: 'Firebase Authentication' },
    { label: 'Target Campus', value: 'College of Physical Education' },
    { label: 'System Status', value: 'All Systems Operational', highlight: true },
  ];

  return (
    <div
      className="about-screen animate-fade-in"
      style={{
        display: 'flex',
        flexDirection: 'column',
        padding: '16px 20px 32px 20px',
        backgroundColor: '#F2F5FA',
        minHeight: '100%',
        gap: '20px',
      }}
    >
      {/* Top Header */}
      <div style={{ paddingTop: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
          <button
            type="button"
            onClick={onBack}
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              backgroundColor: '#1D61E7',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 10px rgba(29,97,231,0.25)',
              cursor: 'pointer',
              flexShrink: 0,
              transition: 'transform 0.15s ease',
            }}
            aria-label="Back to Settings"
          >
            <ArrowLeft size={18} color="#FFFFFF" strokeWidth={2.5} />
          </button>
          <div>
            <h2
              style={{
                fontSize: '1.3rem',
                fontWeight: '800',
                color: '#0F1E36',
                letterSpacing: '-0.3px',
                margin: 0,
              }}
            >
              About EQUIPTRACE
            </h2>
            <p style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: '500', margin: '2px 0 0 0' }}>
              App version, campus policies, and support
            </p>
          </div>
        </div>
      </div>

      {/* Core Capabilities */}
      <div>
        <h3
          style={{
            fontSize: '0.925rem',
            fontWeight: '800',
            color: '#0F1E36',
            marginBottom: '10px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}
        >
          Core Capabilities
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          {[
            {
              title: 'QR Code Scan',
              desc: 'Instant student borrow authorization',
              icon: <QrCode size={20} color="#1D61E7" />,
            },
            {
              title: 'Live Firestore',
              desc: 'Real-time multi-device database sync',
              icon: <Layers size={20} color="#10B981" />,
            },
            {
              title: 'Inspection Sign-Off',
              desc: 'Return verification & damage audit',
              icon: <ShieldCheck size={20} color="#6366F1" />,
            },
            {
              title: 'Push Alerts',
              desc: 'Instant overdue & approval banners',
              icon: <Sparkles size={20} color="#F59E0B" />,
            },
          ].map((c, i) => (
            <div
              key={i}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                padding: '14px',
                border: '1px solid #E2E8F0',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                boxShadow: '0 2px 6px rgba(13,26,48,0.03)',
              }}
            >
              <div
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '10px',
                  backgroundColor: '#F8FAFC',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {c.icon}
              </div>
              <div>
                <h4 style={{ fontSize: '0.85rem', fontWeight: '800', color: '#0F1E36', margin: 0 }}>
                  {c.title}
                </h4>
                <p style={{ fontSize: '0.72rem', color: '#64748B', margin: '3px 0 0 0', lineHeight: '1.3' }}>
                  {c.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Borrowing Policies & Guidelines */}
      <div>
        <h3
          style={{
            fontSize: '0.925rem',
            fontWeight: '800',
            color: '#0F1E36',
            marginBottom: '10px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}
        >
          Campus Borrowing Policies
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {policies.map((pol, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                padding: '14px 16px',
                border: '1px solid #E2E8F0',
                display: 'flex',
                gap: '12px',
                alignItems: 'flex-start',
                boxShadow: '0 2px 6px rgba(13,26,48,0.03)',
              }}
            >
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '10px',
                  backgroundColor: '#F1F5F9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginTop: '1px',
                }}
              >
                {pol.icon}
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{ fontSize: '0.88rem', fontWeight: '800', color: '#0F1E36', margin: 0 }}>
                  {pol.title}
                </h4>
                <p style={{ fontSize: '0.78rem', color: '#64748B', margin: '3px 0 0 0', lineHeight: '1.4' }}>
                  {pol.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Technical & System Details */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '18px',
          padding: '18px',
          border: '1px solid #E2E8F0',
          boxShadow: '0 2px 6px rgba(13,26,48,0.03)',
        }}
      >
        <h3
          style={{
            fontSize: '0.925rem',
            fontWeight: '800',
            color: '#0F1E36',
            marginBottom: '12px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}
        >
          System Specifications
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {specs.map((s, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '0.8rem',
                paddingBottom: idx === specs.length - 1 ? 0 : '8px',
                borderBottom: idx === specs.length - 1 ? 'none' : '1px solid #F1F5F9',
              }}
            >
              <span style={{ color: '#64748B', fontWeight: '500' }}>{s.label}</span>
              <span
                style={{
                  fontWeight: '700',
                  color: s.highlight ? '#15803D' : '#0F1E36',
                }}
              >
                {s.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Contact & Support Section */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '18px',
          padding: '18px',
          border: '1px solid #E2E8F0',
          boxShadow: '0 2px 6px rgba(13,26,48,0.03)',
        }}
      >
        <h3
          style={{
            fontSize: '0.925rem',
            fontWeight: '800',
            color: '#0F1E36',
            marginBottom: '12px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}
        >
          Support & Assistance
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '10px',
                backgroundColor: '#EEF4FF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#1D61E7',
              }}
            >
              <MapPin size={16} />
            </div>
            <div>
              <span style={{ fontSize: '0.74rem', color: '#94A3B8', display: 'block' }}>Location</span>
              <span style={{ fontSize: '0.82rem', fontWeight: '700', color: '#0F1E36' }}>
                Room 204, Physical Education & Sports Complex
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '10px',
                backgroundColor: '#EEF4FF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#1D61E7',
              }}
            >
              <Mail size={16} />
            </div>
            <div>
              <span style={{ fontSize: '0.74rem', color: '#94A3B8', display: 'block' }}>Inquiries & Feedback</span>
              <span style={{ fontSize: '0.82rem', fontWeight: '700', color: '#1D61E7' }}>
                support@equiptrace.edu
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '10px',
                backgroundColor: '#EEF4FF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#1D61E7',
              }}
            >
              <Phone size={16} />
            </div>
            <div>
              <span style={{ fontSize: '0.74rem', color: '#94A3B8', display: 'block' }}>Office Hours</span>
              <span style={{ fontSize: '0.82rem', fontWeight: '700', color: '#0F1E36' }}>
                Monday – Friday: 8:00 AM – 5:00 PM
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Footer */}
      <div style={{ textAlign: 'center', color: '#94A3B8', fontSize: '0.75rem', lineHeight: '1.4' }}>
        <p>© 2026 EQUIPTRACE. All rights reserved.</p>
        <p style={{ marginTop: '2px' }}>College Sports Equipment & Asset Management System</p>
      </div>

      {/* Bottom spacer for floating navigation bar */}
      <div style={{ height: '96px', flexShrink: 0, minHeight: '96px' }} />
    </div>
  );
}
