<<<<<<< HEAD
import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X as CloseIcon, Camera as CameraIcon } from 'lucide-react'
=======
'use client'

import React, { useEffect, useRef, useState } from 'react'
import { X as XIcon } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import * as ZXingBrowser from '@zxing/browser'
import { BarcodeFormat, DecodeHintType } from '@zxing/library'
>>>>>>> master

interface BarcodeScannerProps {
  isOpen: boolean
  onClose: () => void
  onBarcodeScanned: (barcode: string) => void
}

<<<<<<< HEAD
export function BarcodeScanner({ isOpen, onClose, onBarcodeScanned }: BarcodeScannerProps) {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [scanning, setScanning] = useState(false)
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  // Request camera permission and set up video stream when modal opens
  useEffect(() => {
    if (!isOpen) return
    
    let videoStream: MediaStream | null = null
    
    async function setupCamera() {
      try {
        setScanning(true)
        setErrorMessage(null)
        
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' }
        })
        
        videoStream = stream
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          setHasPermission(true)
          
          // Start scanning for barcodes after a short delay to let camera initialize
          setTimeout(scanBarcode, 1000)
        }
      } catch (err) {
        console.error('Error accessing camera:', err)
        setHasPermission(false)
        setErrorMessage('Could not access camera. Please ensure you have granted camera permissions.')
      }
    }
    
    setupCamera()
    
    // Clean up function
    return () => {
      if (videoStream) {
        videoStream.getTracks().forEach(track => track.stop())
      }
      setScanning(false)
    }
  }, [isOpen])
  
  // Simulate barcode scanning
  // In a real implementation, you would use a library like jsQR or a similar barcode scanning library
  const scanBarcode = () => {
    if (!scanning || !videoRef.current || !canvasRef.current) return
    
    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    
    if (!context || !video.videoWidth) {
      // Try again if video isn't ready yet
      requestAnimationFrame(scanBarcode)
      return
    }
    
    // Set canvas dimensions to match video
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    
    // Draw current video frame to canvas for analysis
    context.drawImage(video, 0, 0, canvas.width, canvas.height)
    
    // For this simplified demo, we'll use a button to manually simulate a scan
    // In a real implementation, you would analyze the image data here to detect barcodes
    
    // Continue scanning loop
    requestAnimationFrame(scanBarcode)
  }
  
  // Simulate a barcode scan for demo purposes
  const simulateScan = () => {
    // Generate a mock barcode (12 digits for UPC-A)
    const mockBarcode = Array.from({ length: 12 }, () => Math.floor(Math.random() * 10)).join('')
    
    // Call the callback with the mock barcode
    onBarcodeScanned(mockBarcode)
  }
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <div className="p-4 flex items-center justify-between border-b">
              <h2 className="text-xl font-semibold text-gray-800">Scan Barcode</h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
              >
                <CloseIcon size={20} />
              </button>
            </div>
            
            <div className="relative bg-black aspect-video">
              {hasPermission === false && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6 text-center">
                  <CameraIcon size={48} className="mb-4 opacity-50" />
                  <p className="mb-2">{errorMessage || 'Camera access denied'}</p>
                  <p className="text-sm opacity-70">Please allow camera access to scan barcodes</p>
                </div>
              )}
              
              {hasPermission === true && (
                <>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                  <canvas ref={canvasRef} className="hidden" />
                  
                  {/* Scanning overlay */}
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="h-full w-full flex flex-col items-center justify-center">
                      <div className="border-2 border-white/70 rounded w-3/4 h-1/3 relative">
                        <div className="absolute top-0 left-0 w-full h-full">
                          <div className="h-px bg-red-500 w-full absolute top-1/2 animate-pulse" />
                        </div>
                      </div>
                      <p className="text-white text-sm mt-4">Position barcode in the frame</p>
                    </div>
                  </div>
                </>
              )}
              
              {hasPermission === null && (
                <div className="absolute inset-0 flex items-center justify-center text-white">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
                </div>
              )}
            </div>
            
            <div className="p-4">
              <p className="text-sm text-gray-600 mb-4">
                For this demo, since we can't access your real camera to scan barcodes, you can simulate a barcode scan by clicking the button below.
              </p>
              
              <button
                onClick={simulateScan}
                className="w-full py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors"
              >
                Simulate Barcode Scan
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
=======
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
>>>>>>> master
