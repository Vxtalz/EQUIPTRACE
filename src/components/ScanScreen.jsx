import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, MoreVertical, Image as ImageIcon, Camera, RefreshCw } from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';

export default function ScanScreen({ onBack, onScanEquipment, equipmentList = [], isModalOpen = false }) {
  const [errorMsg, setErrorMsg] = useState('');
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const scannerRef = useRef(null);
  const fileInputRef = useRef(null);
  const isProcessingRef = useRef(false);

  const startCamera = async () => {
    setErrorMsg('');
    setCameraError(null);
    try {
      if (!scannerRef.current) {
        scannerRef.current = new Html5Qrcode('qr-reader-container');
      }
      const scanner = scannerRef.current;
      if (scanner.isScanning) {
        try {
          await scanner.stop();
        } catch (_) {}
      }

      const qrCodeSuccessCallback = (decodedText) => {
        handleScannedContent(decodedText);
      };

      const config = {
        fps: 15,
        qrbox: { width: 220, height: 220 },
        aspectRatio: 1.0,
      };

      await scanner.start(
        { facingMode: 'environment' },
        config,
        qrCodeSuccessCallback,
        () => {}
      );
      setCameraActive(true);
      setCameraError(null);
      isProcessingRef.current = false;
    } catch (err) {
      console.warn('Real camera start failed, fallback available:', err);
      setCameraActive(false);
      setCameraError('Camera access required. Tap below to enable.');
    }
  };

  // Initialize and start device camera
  useEffect(() => {
    startCamera();

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

  // When modal closes, resume camera scanning smoothly without turning black
  useEffect(() => {
    if (!isModalOpen) {
      isProcessingRef.current = false;
      if (scannerRef.current) {
        try {
          scannerRef.current.resume();
        } catch (_) {
          if (!scannerRef.current.isScanning) {
            startCamera();
          }
        }
      }
    }
  }, [isModalOpen]);

  const handleScannedContent = (rawText) => {
    if (isProcessingRef.current) return;

    let targetId = rawText.trim();
    try {
      const parsed = JSON.parse(rawText);
      if (parsed.id) targetId = parsed.id;
    } catch (e) {
      // plain text ID
    }

    // Normalize any Unicode en-dash (\u2013), em-dash (\u2014), figure dash (\u2012) into standard ASCII hyphen
    const cleanId = (str) =>
      (str || '')
        .replace(/[\u2010\u2011\u2012\u2013\u2014\u2015\u2212\uFE58\uFE63\uFF0D]/g, '-')
        .replace(/\s+/g, '')
        .toUpperCase();

    const normalizedTarget = cleanId(targetId);

    const matchedItem = equipmentList.find(
      (eq) => cleanId(eq.id) === normalizedTarget || cleanId(eq.code) === normalizedTarget
    );

    if (matchedItem) {
      isProcessingRef.current = true;
      setErrorMsg('');

      // Pause decoding and freeze the camera frame instead of stopping it (so the screen does NOT turn black)
      try {
        if (scannerRef.current && scannerRef.current.isScanning) {
          scannerRef.current.pause(true);
        }
      } catch (e) {}

      onScanEquipment(matchedItem);
    } else {
      setErrorMsg(`Scanned: "${targetId}". Not recognized in inventory.`);
      // Briefly debounce unrecognized scans so the camera continues streaming smoothly
      isProcessingRef.current = true;
      setTimeout(() => {
        isProcessingRef.current = false;
      }, 1500);
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

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMsg('');

    let wasScanning = false;
    try {
      if (scannerRef.current && scannerRef.current.isScanning) {
        wasScanning = true;
        await scannerRef.current.stop();
        setCameraActive(false);
      }
    } catch (stopErr) {
      console.warn('Error pausing scanner for file scan:', stopErr);
    }

    try {
      const fileScanner = new Html5Qrcode('qr-file-helper-container', false);
      const decodedText = await fileScanner.scanFile(file, false);
      try { await fileScanner.clear(); } catch (_) {}
      handleScannedContent(decodedText);
    } catch (err) {
      console.warn('File QR scan error:', err);
      setErrorMsg('No valid QR code was detected in that image. Please make sure the QR code is clearly visible.');
      if (wasScanning) {
        startCamera();
      }
    } finally {
      if (e.target) e.target.value = '';
    }
  };

  const handleTypedFind = (e) => {
    e.preventDefault();
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

          {/* Hidden helper container for scanning gallery QR images without camera conflict */}
          <div id="qr-file-helper-container" style={{ display: 'none' }} />

          {/* Fallback View if camera permission denied or waiting for grant */}
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
              gap: '10px',
              zIndex: 5
            }}>
              <Camera size={40} color="#60A5FA" />
              <span style={{ fontSize: '0.85rem', color: '#E2E8F0', fontWeight: '600' }}>
                Camera Scanner
              </span>
              <span style={{ fontSize: '0.75rem', color: '#94A3B8', maxWidth: '200px', lineHeight: '1.4' }}>
                {cameraError || 'Tap button below to start the camera.'}
              </span>
              <button
                type="button"
                onClick={startCamera}
                style={{
                  marginTop: '8px',
                  backgroundColor: '#1D61E7',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '9999px',
                  padding: '8px 18px',
                  fontSize: '0.8rem',
                  fontWeight: '700',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(29,97,231,0.35)'
                }}
              >
                <RefreshCw size={14} />
                <span>Enable Camera</span>
              </button>
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

        {/* Hidden file input for Gallery QR Code scan */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleFileUpload}
        />

        {/* Bottom Gallery button (centered) */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: '6px',
          paddingTop: '6px'
        }}>
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
  );
}
