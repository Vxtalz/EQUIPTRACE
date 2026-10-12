import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, MoreVertical, Zap, Image as ImageIcon, Camera, RefreshCw } from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';

export default function ScanScreen({ onBack, onScanEquipment, equipmentList = [] }) {
  const [typedId, setTypedId] = useState('');
  const [flashOn, setFlashOn] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const scannerRef = useRef(null);
  const fileInputRef = useRef(null);

  // Initialize and start device camera
  useEffect(() => {
    const html5QrCode = new Html5Qrcode('qr-reader-container');
    scannerRef.current = html5QrCode;

    const qrCodeSuccessCallback = (decodedText) => {
      handleScannedContent(decodedText);
    };

    const config = {
      fps: 15,
      qrbox: { width: 220, height: 220 },
      aspectRatio: 1.0
    };

    html5QrCode.start(
      { facingMode: 'environment' },
      config,
      qrCodeSuccessCallback,
      () => {
        // scan failure/ongoing frame search, ignore
      }
    ).then(() => {
      setCameraActive(true);
      setCameraError(null);
    }).catch((err) => {
      console.warn('Real camera start failed, fallback available:', err);
      setCameraActive(false);
      setCameraError('Camera access unavailable or permission required.');
    });

    return () => {
      if (scannerRef.current) {
        try {
          if (scannerRef.current.isScanning) {
            scannerRef.current.stop().catch(console.error);
          }
        } catch (e) {}
      }
    };
  }, []);

  const handleScannedContent = (rawText) => {
    let targetId = rawText.trim();
    try {
      const parsed = JSON.parse(rawText);
      if (parsed.id) targetId = parsed.id;
    } catch (e) {
      // plain text ID
    }

    const matchedItem = equipmentList.find(
      (eq) => eq.id.toUpperCase() === targetId.toUpperCase()
    );

    if (matchedItem) {
      setErrorMsg('');
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current.stop().catch(() => {});
      }
      onScanEquipment(matchedItem);
    } else {
      setErrorMsg(`Scanned: "${targetId}". Not recognized in inventory.`);
    }
  };

  const handleSimulateScan = (idToScan = 'PE-015') => {
    const item = equipmentList.find((eq) => eq.id.toUpperCase() === idToScan.toUpperCase());
    if (item) {
      setErrorMsg('');
      onScanEquipment(item);
    } else {
      setErrorMsg(`Equipment ID "${idToScan}" not found.`);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file || !scannerRef.current) return;

    scannerRef.current.scanFile(file, true)
      .then((decodedText) => {
        handleScannedContent(decodedText);
      })
      .catch((err) => {
        setErrorMsg('Could not find a valid QR code in that image.');
      });
  };

  const handleTypedFind = (e) => {
    e.preventDefault();
    if (!typedId.trim()) return;
    handleSimulateScan(typedId.trim());
  };

  return (
    <div className="scan-screen animate-fade-in" style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      backgroundColor: '#121620',
      color: '#FFFFFF',
      padding: '16px 20px 24px 20px',
      justifyContent: 'space-between',
      position: 'relative'
    }}>
      {/* Dark Header Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '44px'
      }}>
        <button
          type="button"
          onClick={onBack}
          style={{
            background: 'none',
            border: 'none',
            color: '#FFFFFF',
            cursor: 'pointer',
            padding: '8px',
            display: 'flex',
            alignItems: 'center'
          }}
          aria-label="Back"
        >
          <ArrowLeft size={22} color="#FFFFFF" strokeWidth={2.2} />
        </button>

        <span style={{
          fontSize: '1.15rem',
          fontWeight: '700',
          color: '#FFFFFF',
          letterSpacing: '-0.2px'
        }}>
          Scan QR Code
        </span>

        <button
          type="button"
          style={{
            background: 'none',
            border: 'none',
            color: '#FFFFFF',
            cursor: 'pointer',
            padding: '8px',
            display: 'flex',
            alignItems: 'center'
          }}
          aria-label="More options"
        >
          <MoreVertical size={22} color="#FFFFFF" />
        </button>
      </div>

      {/* Main Viewfinder Section */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '10px 0'
      }}>
        {/* QR Code Container with Frame Corners */}
        <div style={{
          position: 'relative',
          width: '260px',
          height: '260px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          borderRadius: '24px',
          backgroundColor: '#000000',
          boxShadow: '0 8px 32px rgba(0,0,0,0.5)'
        }}>
          {/* Real Device Camera Feed Element */}
          <div 
            id="qr-reader-container" 
            style={{ 
              width: '100%', 
              height: '100%',
              objectFit: 'cover'
            }} 
          />

          {/* Fallback View if camera permission denied or running in restricted emulator */}
          {!cameraActive && (
            <div style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#1E2536',
              padding: '20px',
              textAlign: 'center',
              gap: '10px'
            }}>
              <Camera size={40} color="#60A5FA" />
              <span style={{ fontSize: '0.85rem', color: '#E2E8F0', fontWeight: '600' }}>
                Camera Feed
              </span>
              <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
                {cameraError || 'Requesting camera permissions...'}
              </span>
            </div>
          )}

          {/* Viewfinder Target Framing Corners */}
          <div style={{
            position: 'absolute',
            top: '16px',
            left: '16px',
            width: '32px',
            height: '32px',
            borderTop: '4px solid #38BDF8',
            borderLeft: '4px solid #38BDF8',
            borderTopLeftRadius: '12px',
            pointerEvents: 'none',
            zIndex: 10
          }} />
          <div style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            width: '32px',
            height: '32px',
            borderTop: '4px solid #38BDF8',
            borderRight: '4px solid #38BDF8',
            borderTopRightRadius: '12px',
            pointerEvents: 'none',
            zIndex: 10
          }} />
          <div style={{
            position: 'absolute',
            bottom: '16px',
            left: '16px',
            width: '32px',
            height: '32px',
            borderBottom: '4px solid #38BDF8',
            borderLeft: '4px solid #38BDF8',
            borderBottomLeftRadius: '12px',
            pointerEvents: 'none',
            zIndex: 10
          }} />
          <div style={{
            position: 'absolute',
            bottom: '16px',
            right: '16px',
            width: '32px',
            height: '32px',
            borderBottom: '4px solid #38BDF8',
            borderRight: '4px solid #38BDF8',
            borderBottomRightRadius: '12px',
            pointerEvents: 'none',
            zIndex: 10
          }} />

          {/* Flash Effect Light Overlay */}
          {flashOn && (
            <div style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: 'rgba(255, 255, 255, 0.25)',
              pointerEvents: 'none',
              zIndex: 12
            }} />
          )}

          {/* Animated Scanner Laser */}
          <div className="scanner-line" style={{ zIndex: 11 }} />
        </div>

        {/* Alignment Subheading */}
        <p style={{
          fontSize: '0.875rem',
          color: '#94A3B8',
          marginTop: '18px',
          textAlign: 'center',
          fontWeight: '500'
        }}>
          Point camera at equipment QR code
        </p>

        {errorMsg && (
          <p style={{ color: '#F87171', fontSize: '0.85rem', marginTop: '6px', fontWeight: '600', textAlign: 'center' }}>
            {errorMsg}
          </p>
        )}
      </div>

      {/* Action Controls & Manual Input */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {/* Manual ID Input */}
        <form onSubmit={handleTypedFind} style={{
          display: 'flex',
          backgroundColor: '#1A202C',
          borderRadius: '14px',
          padding: '4px',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          alignItems: 'center'
        }}>
          <input
            type="text"
            value={typedId}
            onChange={(e) => setTypedId(e.target.value)}
            placeholder="Search equipment by ID (e.g. PE-015)"
            style={{
              flex: 1,
              backgroundColor: '#FFFFFF',
              color: '#0F1E36',
              border: 'none',
              height: '46px',
              borderRadius: '10px',
              padding: '0 14px',
              fontSize: '0.9rem',
              outline: 'none',
              fontFamily: 'inherit'
            }}
          />
          <button
            type="submit"
            style={{
              backgroundColor: '#1D61E7',
              color: '#FFFFFF',
              border: 'none',
              padding: '0 20px',
              height: '46px',
              borderRadius: '10px',
              fontWeight: '700',
              fontSize: '0.9rem',
              marginLeft: '6px',
              cursor: 'pointer',
              fontFamily: 'inherit'
            }}
          >
            Find
          </button>
        </form>

        {/* Hidden file input for Gallery QR Code scan */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleFileUpload}
        />

        {/* Bottom Flash / Gallery buttons */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-around',
          marginTop: '6px',
          paddingTop: '6px'
        }}>
          <button
            type="button"
            onClick={() => setFlashOn(!flashOn)}
            style={{
              background: 'none',
              border: 'none',
              color: flashOn ? '#38BDF8' : '#94A3B8',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.8rem',
              fontWeight: '600',
              fontFamily: 'inherit'
            }}
          >
            <Zap size={22} strokeWidth={2.2} />
            <span>Flash</span>
          </button>

          <button
            type="button"
            onClick={() => fileInputRef.current && fileInputRef.current.click()}
            style={{
              background: 'none',
              border: 'none',
              color: '#94A3B8',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.8rem',
              fontWeight: '600',
              fontFamily: 'inherit'
            }}
          >
            <ImageIcon size={22} strokeWidth={2.2} />
            <span>Gallery</span>
          </button>
        </div>
      </div>
    </div>
  );
}
