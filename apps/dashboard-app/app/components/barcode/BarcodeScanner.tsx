import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X as CloseIcon, Camera as CameraIcon } from 'lucide-react'

interface BarcodeScannerProps {
  isOpen: boolean
  onClose: () => void
  onBarcodeScanned: (barcode: string) => void
}

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
