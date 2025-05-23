'use client'

import React, { useEffect, useRef, useState } from 'react'
import { X as XIcon } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import * as ZXingBrowser from '@zxing/browser'
import { BarcodeFormat, DecodeHintType } from '@zxing/library'

interface BarcodeScannerProps {
  isOpen: boolean
  onClose: () => void
  onBarcodeScanned: (barcode: string) => void
}

export const BarcodeScanner: React.FC<BarcodeScannerProps> = ({
  isOpen,
  onClose,
  onBarcodeScanned,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([])
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const [isScanning, setIsScanning] = useState<boolean>(false)
  const [permissionState, setPermissionState] = useState<'prompt'|'granted'|'denied'|'unknown'>('unknown')
  const readerRef = useRef<ZXingBrowser.BrowserMultiFormatReader | null>(null)
  // Type for scanner controls
  interface ScannerControls {
    stop: () => void
  }
  
  const controlsRef = useRef<ScannerControls | null>(null)

  useEffect(() => {
    if (!isOpen) return

    // Initialize barcode reader with multiple format support
    const hints = new Map()
    const formats = [
      BarcodeFormat.QR_CODE,
      BarcodeFormat.EAN_13,
      BarcodeFormat.EAN_8,
      BarcodeFormat.UPC_A,
      BarcodeFormat.UPC_E,
      BarcodeFormat.CODE_39,
      BarcodeFormat.CODE_128
    ]
    hints.set(DecodeHintType.POSSIBLE_FORMATS, formats)
    
    readerRef.current = new ZXingBrowser.BrowserMultiFormatReader(hints)

    // Check camera permissions
    const checkCameraPermission = async () => {
      try {
        // Check if the browser supports the permissions API
        if (navigator.permissions) {
          const permission = await navigator.permissions.query({ name: 'camera' as PermissionName });
          setPermissionState(permission.state as 'prompt'|'granted'|'denied');
          
          // Listen for permission changes
          permission.addEventListener('change', () => {
            setPermissionState(permission.state as 'prompt'|'granted'|'denied');
          });
          
          if (permission.state === 'denied') {
            setError('Camera access is blocked. Please allow camera access in your browser settings.');
            return false;
          }
        }
        return true;
      } catch (err) {
        console.error('Error checking camera permission:', err);
        return true; // Continue anyway as permissions API might not be supported
      }
    };
    
    // List available devices
    const getVideoDevices = async () => {
      try {
        // First check permissions
        const permissionOk = await checkCameraPermission();
        if (!permissionOk) return;
        
        // Request camera access explicitly first
        try {
          await navigator.mediaDevices.getUserMedia({ video: true });
          // If we get here, permission is granted
          setPermissionState('granted');
        } catch (permErr) {
          console.error('Camera permission error:', permErr);
          setPermissionState('denied');
          setError('Camera access was denied. Please allow camera access to use the barcode scanner.');
          return;
        }
        
        const devices = await ZXingBrowser.BrowserMultiFormatReader.listVideoInputDevices()
        setVideoDevices(devices)
        
        // Select the first device by default, typically the back camera on mobile if available
        if (devices.length > 0) {
          // Try to find a back camera if on mobile
          const backCamera = devices.find(device => 
            device.label.toLowerCase().includes('back') || 
            device.label.toLowerCase().includes('rear')
          )
          
          const deviceToUse = backCamera || devices[0]
          setSelectedDeviceId(deviceToUse.deviceId)
        } else {
          setError('No camera devices found. Please ensure your device has a camera.');
        }
      } catch (err) {
        console.error('Error listing video devices:', err)
        setError('Unable to access camera devices. Please check camera permissions.')
      }
    }

    getVideoDevices()

    // Cleanup function
    return () => {
      if (controlsRef.current) {
        try {
          // Use the stop method on controls
          controlsRef.current.stop()
        } catch (err) {
          console.error('Error stopping scanner:', err);
        }
      }
      // Ensure reader is reset
      readerRef.current = null;
      setIsScanning(false)
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen || !selectedDeviceId || !videoRef.current || !readerRef.current) return
    
    const startScanning = async () => {
      try {
        setIsScanning(true)
        setError(null)
        
        // We know readerRef.current exists here because of the check at the beginning of the function
        const reader = readerRef.current!; // Add non-null assertion since we've checked it above
        // Store the controls for later cleanup
        const controls = await reader.decodeFromVideoDevice(
          selectedDeviceId,
          videoRef.current!, // Add non-null assertion as we've already checked it's not null
          (result, error) => {
            if (result) {
              const barcodeValue = result.getText()
              console.log('Barcode scanned:', barcodeValue)
              
              // Pass the barcode value to parent component
              onBarcodeScanned(barcodeValue)
              
              // Stop scanning after successful scan
              if (controlsRef.current) {
                controlsRef.current.stop()
                setIsScanning(false)
                onClose()
              }
            }
            
            if (error && !(error instanceof TypeError)) {
              // TypeError is thrown when scanning is stopped, so we ignore it
              console.error('Scan error:', error)
            }
          }
        )
        
        // Store controls for later use
        controlsRef.current = controls;
        
      } catch (err) {
        console.error('Error starting barcode scanner:', err)
        setError('Failed to start scanner. Please ensure camera permissions are granted.')
        setIsScanning(false)
      }
    }

    startScanning()

    return () => {
      if (controlsRef.current) {
        // Use proper cleanup - stop the scanner
        try {
          controlsRef.current.stop();
        } catch (err) {
          console.error('Error stopping scanner:', err);
        }
      }
      setIsScanning(false)
    }
  }, [isOpen, selectedDeviceId, onBarcodeScanned, onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/70 transition-opacity"
            onClick={onClose}
          />
  
          {/* Modal container */}
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0 relative z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.3, type: 'spring', bounce: 0.25 }}
              className="inline-block align-middle bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full relative"
            >
              <div className="absolute top-0 right-0 pt-4 pr-4 z-10">
                <button
                  type="button"
                  className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                  onClick={onClose}
                >
                  <XIcon className="h-6 w-6" />
                </button>
              </div>
  
              <div className="px-6 pt-5 pb-6">
                {error && (
                  <div className="mb-4 p-3 rounded bg-red-50 text-red-700 text-sm">
                    {error}
                    {permissionState === 'denied' && (
                      <div className="mt-2">
                        <p className="font-medium">How to fix:</p>
                        <ol className="list-decimal pl-5 mt-1 text-xs space-y-1">
                          <li>Click the camera/lock icon in your browser&apos;s address bar</li>
                          <li>Select &quot;Allow&quot; for camera access</li>
                          <li>Refresh the page and try again</li>
                        </ol>
                      </div>
                    )}
                  </div>
                )}
  
                {!error && permissionState === 'prompt' && (
                  <div className="mb-4 p-3 rounded bg-blue-50 text-blue-700 text-sm">
                    <p>Please allow camera access when prompted to scan barcodes.</p>
                  </div>
                )}
  
                {videoDevices.length > 0 && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Camera
                    </label>
                    <select
                      value={selectedDeviceId}
                      onChange={(e) => setSelectedDeviceId(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm"
                      disabled={isScanning}
                    >
                      {videoDevices.map((device, index) => (
                        <option key={`device-${device.deviceId || index}`} value={device.deviceId}>
                          {device.label || `Camera ${device.deviceId ? device.deviceId.substring(0, 5) : index}...`}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
  
                <div className="relative bg-black rounded-md overflow-hidden aspect-video mb-4">
                  <video
                    ref={videoRef}
                    className="w-full h-full object-cover"
                    muted
                    playsInline
                  />
  
                  {isScanning && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-5/6 h-5/6 border-2 border-blue-500 rounded-lg relative">
                        <div className="absolute top-0 left-0 w-12 h-2 bg-blue-500 rounded-tl-lg" />
                        <div className="absolute top-0 left-0 w-2 h-12 bg-blue-500 rounded-tl-lg" />
                        <div className="absolute top-0 right-0 w-12 h-2 bg-blue-500 rounded-tr-lg" />
                        <div className="absolute top-0 right-0 w-2 h-12 bg-blue-500 rounded-tr-lg" />
                        <div className="absolute bottom-0 left-0 w-12 h-2 bg-blue-500 rounded-bl-lg" />
                        <div className="absolute bottom-0 left-0 w-2 h-12 bg-blue-500 rounded-bl-lg" />
                        <div className="absolute bottom-0 right-0 w-12 h-2 bg-blue-500 rounded-br-lg" />
                        <div className="absolute bottom-0 right-0 w-2 h-12 bg-blue-500 rounded-br-lg" />
                      </div>
                    </div>
                  )}
                </div>
  
                <div className="text-center">
                  {isScanning ? (
                    <p className="text-sm text-gray-500">
                      Scanning... Position the barcode in view
                    </p>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        if (readerRef.current && selectedDeviceId) {
                          setIsScanning(true);
                        }
                      }}
                      className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
                      disabled={!selectedDeviceId}
                    >
                      Start Scanning
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
