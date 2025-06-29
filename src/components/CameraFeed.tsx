import React, { useEffect, useRef, useState } from 'react';
import { Camera, CameraOff, Settings, RefreshCw } from 'lucide-react';

interface CameraFeedProps {
  onStreamReady?: (stream: MediaStream) => void;
}

export const CameraFeed: React.FC<CameraFeedProps> = ({ onStreamReady }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isStreamActive, setIsStreamActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [permissionDenied, setPermissionDenied] = useState(false);

  const startCamera = async () => {
    try {
      setError(null);
      setPermissionDenied(false);
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment', // Use back camera on mobile
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        },
        audio: false
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsStreamActive(true);
        onStreamReady?.(stream);
      }
    } catch (err: any) {
      console.error('Camera error:', err);
      
      if (err.name === 'NotAllowedError' || err.message?.includes('Permission dismissed')) {
        setPermissionDenied(true);
        setError('Camera access was denied. Please allow camera access to continue.');
      } else if (err.name === 'NotFoundError') {
        setError('No camera found on this device.');
      } else if (err.name === 'NotReadableError') {
        setError('Camera is already in use by another application.');
      } else {
        setError('Camera access unavailable. Please check your device settings.');
      }
    }
  };

  useEffect(() => {
    startCamera();

    return () => {
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleRetry = () => {
    startCamera();
  };

  if (error) {
    return (
      <div className="relative w-full h-full bg-gray-900 flex items-center justify-center">
        <div className="text-center text-white p-8 max-w-md">
          <CameraOff className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <p className="text-lg font-semibold mb-2">Camera Unavailable</p>
          <p className="text-gray-300 mb-6">{error}</p>
          
          {permissionDenied && (
            <div className="bg-gray-800 rounded-lg p-4 mb-6 text-left">
              <div className="flex items-center mb-2">
                <Settings className="w-5 h-5 mr-2 text-blue-400" />
                <span className="font-semibold text-blue-400">How to enable camera:</span>
              </div>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Click the camera icon in your browser's address bar</li>
                <li>• Select "Allow" when prompted</li>
                <li>• Or go to browser settings and enable camera for this site</li>
                <li>• Refresh the page after granting permission</li>
              </ul>
            </div>
          )}
          
          <button
            onClick={handleRetry}
            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-black">
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        playsInline
        muted
      />
      {!isStreamActive && (
        <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
          <div className="text-center text-white">
            <Camera className="w-16 h-16 mx-auto mb-4 animate-pulse" />
            <p className="text-lg font-semibold">Starting Camera...</p>
          </div>
        </div>
      )}
    </div>
  );
};