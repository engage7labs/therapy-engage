"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, Video, Mic, X, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface MediaUploadProps {
  onUpload?: (file: File, type: 'video' | 'audio') => Promise<void>;
  acceptedTypes?: {
    video?: string[];
    audio?: string[];
  };
  maxSizeVideo?: number; // MB
  maxSizeAudio?: number; // MB
  className?: string;
}

interface RecordingState {
  isRecording: boolean;
  mediaRecorder?: MediaRecorder;
  stream?: MediaStream;
  recordedChunks: Blob[];
  duration: number;
}

export default function MediaUpload({
  onUpload,
  acceptedTypes = {
    video: ['video/mp4', 'video/webm', 'video/avi'],
    audio: ['audio/mp3', 'audio/wav', 'audio/webm', 'audio/m4a']
  },
  maxSizeVideo = 500, // 500MB default
  maxSizeAudio = 50,  // 50MB default
  className
}: MediaUploadProps) {
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<Array<{
    id: string;
    name: string;
    type: 'video' | 'audio';
    size: number;
    url?: string;
  }>>([]);
  
  const [videoRecording, setVideoRecording] = useState<RecordingState>({
    isRecording: false,
    recordedChunks: [],
    duration: 0
  });
  
  const [audioRecording, setAudioRecording] = useState<RecordingState>({
    isRecording: false,
    recordedChunks: [],
    duration: 0
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoPreviewRef = useRef<HTMLVideoElement>(null);

  // File validation helper
  const validateFile = useCallback((file: File): { valid: boolean; error?: string } => {
    const isVideo = file.type.startsWith('video/');
    const isAudio = file.type.startsWith('audio/');
    
    if (!isVideo && !isAudio) {
      return { valid: false, error: 'Please select a video or audio file' };
    }

    const acceptedVideoTypes = acceptedTypes.video || [];
    const acceptedAudioTypes = acceptedTypes.audio || [];
    
    if (isVideo && !acceptedVideoTypes.includes(file.type)) {
      return { valid: false, error: `Video type ${file.type} not supported. Accepted: ${acceptedVideoTypes.join(', ')}` };
    }
    
    if (isAudio && !acceptedAudioTypes.includes(file.type)) {
      return { valid: false, error: `Audio type ${file.type} not supported. Accepted: ${acceptedAudioTypes.join(', ')}` };
    }

    const maxSize = isVideo ? maxSizeVideo : maxSizeAudio;
    const fileSizeMB = file.size / (1024 * 1024);
    
    if (fileSizeMB > maxSize) {
      return { valid: false, error: `File size (${fileSizeMB.toFixed(2)}MB) exceeds maximum allowed (${maxSize}MB)` };
    }

    return { valid: true };
  }, [acceptedTypes, maxSizeVideo, maxSizeAudio]);

  // File upload handler
  const handleFileSelect = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    const validation = validateFile(file);
    
    if (!validation.valid) {
      alert(validation.error);
      return;
    }

    // Add to uploaded files list
    const fileEntry = {
      id: Date.now().toString(),
      name: file.name,
      type: file.type.startsWith('video/') ? 'video' as const : 'audio' as const,
      size: file.size,
      url: URL.createObjectURL(file)
    };

    setUploadedFiles(prev => [...prev, fileEntry]);

    // Call upload handler if provided
    if (onUpload) {
      setIsUploading(true);
      setUploadProgress(0);
      
      try {
        // Simulate upload progress
        const progressInterval = setInterval(() => {
          setUploadProgress(prev => {
            if (prev >= 90) {
              clearInterval(progressInterval);
              return 90;
            }
            return prev + 10;
          });
        }, 200);

        await onUpload(file, fileEntry.type);
        
        clearInterval(progressInterval);
        setUploadProgress(100);
        
        setTimeout(() => {
          setUploadProgress(0);
          setIsUploading(false);
        }, 1000);
      } catch (error) {
        setIsUploading(false);
        setUploadProgress(0);
        alert('Upload failed. Please try again.');
        console.error('Upload error:', error);
      }
    }
  }, [validateFile, onUpload]);

  // Recording handlers
  const startRecording = useCallback(async (type: 'video' | 'audio') => {
    try {
      const constraints = type === 'video' 
        ? { video: true, audio: true }
        : { audio: true };
        
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: type === 'video' 
          ? 'video/webm;codecs=vp9,opus' 
          : 'audio/webm;codecs=opus'
      });

      const recordedChunks: Blob[] = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunks, {
          type: type === 'video' ? 'video/webm' : 'audio/webm'
        });
        
        const file = new File([blob], `recorded-${type}-${Date.now()}.webm`, {
          type: blob.type
        });

        // Add to uploaded files
        const fileEntry = {
          id: Date.now().toString(),
          name: file.name,
          type,
          size: file.size,
          url: URL.createObjectURL(blob)
        };

        setUploadedFiles(prev => [...prev, fileEntry]);

        // Call upload handler
        if (onUpload) {
          onUpload(file, type);
        }
      };

      mediaRecorder.start();

      const recordingState = {
        isRecording: true,
        mediaRecorder,
        stream,
        recordedChunks,
        duration: 0
      };

      if (type === 'video') {
        setVideoRecording(recordingState);
        if (videoPreviewRef.current) {
          videoPreviewRef.current.srcObject = stream;
        }
      } else {
        setAudioRecording(recordingState);
      }

      // Start duration timer
      const startTime = Date.now();
      const durationInterval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        if (type === 'video') {
          setVideoRecording(prev => ({ ...prev, duration: elapsed }));
        } else {
          setAudioRecording(prev => ({ ...prev, duration: elapsed }));
        }
      }, 1000);

      // Store interval reference
      if (type === 'video') {
        setVideoRecording(prev => ({ ...prev, durationInterval }));
      } else {
        setAudioRecording(prev => ({ ...prev, durationInterval }));
      }

    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Could not start recording. Please check your camera/microphone permissions.');
    }
  }, [onUpload]);

  const stopRecording = useCallback((type: 'video' | 'audio') => {
    const recording = type === 'video' ? videoRecording : audioRecording;
    
    if (recording.mediaRecorder && recording.isRecording) {
      recording.mediaRecorder.stop();
      
      // Stop all tracks
      if (recording.stream) {
        recording.stream.getTracks().forEach(track => track.stop());
      }

      // Clear duration interval
      if ((recording as any).durationInterval) {
        clearInterval((recording as any).durationInterval);
      }

      // Reset recording state
      const resetState = {
        isRecording: false,
        recordedChunks: [],
        duration: 0
      };

      if (type === 'video') {
        setVideoRecording(resetState);
        if (videoPreviewRef.current) {
          videoPreviewRef.current.srcObject = null;
        }
      } else {
        setAudioRecording(resetState);
      }
    }
  }, [videoRecording, audioRecording]);

  // Format duration helper
  const formatDuration = useCallback((seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  // Remove uploaded file
  const removeFile = useCallback((id: string) => {
    setUploadedFiles(prev => {
      const file = prev.find(f => f.id === id);
      if (file?.url) {
        URL.revokeObjectURL(file.url);
      }
      return prev.filter(f => f.id !== id);
    });
  }, []);

  return (
    <div className={cn("space-y-6", className)}>
      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Upload Media Files
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* File Input */}
          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
            <input
              ref={fileInputRef}
              type="file"
              accept={[...(acceptedTypes.video || []), ...(acceptedTypes.audio || [])].join(',')}
              onChange={(e) => handleFileSelect(e.target.files)}
              className="hidden"
            />
            <div className="space-y-2">
              <div className="mx-auto w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                <Upload className="w-6 h-6 text-muted-foreground" />
              </div>
              <div>
                <h3 className="font-medium">Choose files to upload</h3>
                <p className="text-sm text-muted-foreground">
                  Video: up to {maxSizeVideo}MB | Audio: up to {maxSizeAudio}MB
                </p>
              </div>
              <Button onClick={() => fileInputRef.current?.click()}>
                Select Files
              </Button>
            </div>
          </div>

          {/* Upload Progress */}
          {isUploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Uploading...</span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recording Section */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Video Recording */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video className="w-5 h-5" />
              Video Recording
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Video Preview */}
            <div className="aspect-video bg-muted rounded-lg overflow-hidden">
              <video
                ref={videoPreviewRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover"
              />
            </div>

            {/* Recording Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {videoRecording.isRecording ? (
                  <Button
                    onClick={() => stopRecording('video')}
                    variant="destructive"
                    size="sm"
                  >
                    <Square className="w-4 h-4 mr-1" />
                    Stop
                  </Button>
                ) : (
                  <Button
                    onClick={() => startRecording('video')}
                    size="sm"
                  >
                    <Video className="w-4 h-4 mr-1" />
                    Record
                  </Button>
                )}
              </div>
              
              {videoRecording.isRecording && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  {formatDuration(videoRecording.duration)}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Audio Recording */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mic className="w-5 h-5" />
              Audio Recording
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Audio Visualizer Placeholder */}
            <div className="h-32 bg-muted rounded-lg flex items-center justify-center">
              {audioRecording.isRecording ? (
                <div className="flex items-center gap-1">
                  {[...Array(10)].map((_, i) => (
                    <div
                      key={i}
                      className="w-2 bg-primary rounded-full animate-pulse"
                      style={{
                        height: `${20 + Math.random() * 40}px`,
                        animationDelay: `${i * 0.1}s`
                      }}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center">
                  <Mic className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Ready to record</p>
                </div>
              )}
            </div>

            {/* Recording Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {audioRecording.isRecording ? (
                  <Button
                    onClick={() => stopRecording('audio')}
                    variant="destructive"
                    size="sm"
                  >
                    <Square className="w-4 h-4 mr-1" />
                    Stop
                  </Button>
                ) : (
                  <Button
                    onClick={() => startRecording('audio')}
                    size="sm"
                  >
                    <Mic className="w-4 h-4 mr-1" />
                    Record
                  </Button>
                )}
              </div>
              
              {audioRecording.isRecording && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  {formatDuration(audioRecording.duration)}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Uploaded Files List */}
      {uploadedFiles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Uploaded Media</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {uploadedFiles.map((file) => (
                <div key={file.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                      {file.type === 'video' ? (
                        <Video className="w-5 h-5" />
                      ) : (
                        <Mic className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{file.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {file.type} • {(file.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {file.url && (
                      <>
                        {file.type === 'video' ? (
                          <video 
                            src={file.url} 
                            controls 
                            className="w-20 h-12 object-cover rounded"
                          >
                            <track kind="captions" src="" label="No captions available" />
                          </video>
                        ) : (
                          <audio 
                            src={file.url} 
                            controls 
                            className="w-32"
                          >
                            <track kind="captions" src="" label="No captions available" />
                          </audio>
                        )}
                      </>
                    )}
                    <Button
                      onClick={() => removeFile(file.id)}
                      variant="ghost"
                      size="sm"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
