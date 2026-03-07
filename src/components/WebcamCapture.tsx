import { useRef, useState, useCallback, useEffect } from "react";
import { Camera, CameraOff } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WebcamCaptureProps {
  onCapture: (dataUrl: string) => void;
  isScanning?: boolean;
}

const WebcamCapture = ({ onCapture, isScanning = false }: WebcamCaptureProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);

const startCamera = useCallback(async () => {
  try {
    setError(null);

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setError("Camera API not supported in this browser.");
      return;
    }

    const mediaStream = await navigator.mediaDevices.getUserMedia({
      video: { width: 640, height: 480 },
      audio: false
    });

    setStream(mediaStream);

    if (videoRef.current) {
      videoRef.current.srcObject = mediaStream;
      await videoRef.current.play();
    }

  } catch (err) {
    console.error("Camera error:", err);
    setError("Camera access denied. Please allow camera permissions.");
  }
}, []);

  const stopCamera = useCallback(() => {
    stream?.getTracks().forEach((t) => t.stop());
    setStream(null);
  }, [stream]);

  useEffect(() => {
  if (videoRef.current && stream) {
    videoRef.current.srcObject = stream;
  }
}, [stream]);

  const capture = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    canvas.width = 640;
    canvas.height = 480;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(videoRef.current, 0, 0, 640, 480);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.8);
    onCapture(dataUrl);
  }, [onCapture]);

  return (
    <div className="relative overflow-hidden rounded-lg border-2 border-border bg-muted">
      <div className="relative aspect-[4/3] w-full">
        {stream ? (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
               width="640"
                height="480"
              className="h-full w-full object-cover"
            />
            {isScanning && (
              <>
                <div className="absolute inset-0 border-2 border-primary/40 rounded-lg" />
                <div className="absolute left-0 right-0 h-0.5 bg-primary animate-scan-line shadow-[0_0_8px_hsl(var(--primary))]" />
                <div className="absolute top-3 right-3 flex items-center gap-2 rounded-full bg-destructive/90 px-3 py-1 text-xs font-mono text-destructive-foreground">
                  <span className="h-2 w-2 rounded-full bg-destructive-foreground animate-pulse" />
                  SCANNING
                </div>
              </>
            )}
          </>
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-3 text-muted-foreground">
            <CameraOff className="h-12 w-12" />
            <p className="text-sm">{error || "Camera is off"}</p>
          </div>
        )}
      </div>
      <canvas ref={canvasRef} className="hidden" />
      <div className="flex gap-2 p-3">
        {!stream ? (
          <Button onClick={startCamera} className="w-full gap-2">
            <Camera className="h-4 w-4" />
            Start Camera
          </Button>
        ) : (
          <>
            <Button onClick={capture} className="flex-1 gap-2">
              <Camera className="h-4 w-4" />
              Capture
            </Button>
            <Button onClick={stopCamera} variant="outline" className="gap-2">
              <CameraOff className="h-4 w-4" />
              Stop
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default WebcamCapture;
