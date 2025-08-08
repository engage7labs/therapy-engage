"use client";

import { useState } from "react";
import MediaUpload from "@/components/media/media-upload";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, FileText } from "lucide-react";
import Link from "next/link";

export default function MediaUploadDemo() {
  const [uploadResults, setUploadResults] = useState<Array<{
    fileName: string;
    type: 'video' | 'audio';
    status: 'success' | 'error';
    message: string;
    timestamp: Date;
  }>>([]);

  const handleMediaUpload = async (file: File, type: 'video' | 'audio'): Promise<void> => {
    // Simulate upload process
    console.log(`Uploading ${type} file:`, file.name, `Size: ${(file.size / (1024 * 1024)).toFixed(2)}MB`);
    
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000));
      
      // Simulate occasional failures for demo
      if (Math.random() < 0.1) {
        throw new Error('Simulated upload failure');
      }

      // Success - add to results
      setUploadResults(prev => [...prev, {
        fileName: file.name,
        type,
        status: 'success',
        message: `Successfully uploaded ${type} file`,
        timestamp: new Date()
      }]);

      console.log(`Upload successful: ${file.name}`);
    } catch (error) {
      // Error - add to results
      setUploadResults(prev => [...prev, {
        fileName: file.name,
        type,
        status: 'error',
        message: error instanceof Error ? error.message : 'Upload failed',
        timestamp: new Date()
      }]);

      console.error(`Upload failed: ${file.name}`, error);
      throw error; // Re-throw to let the component handle the error
    }
  };

  const clearResults = () => {
    setUploadResults([]);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
          <h1 className="text-3xl font-bold">Media Upload Demo</h1>
          <p className="text-muted-foreground mt-2">
            Test video and audio upload functionality with file selection and recording capabilities.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Upload Component */}
          <div className="lg:col-span-2">
            <MediaUpload
              onUpload={handleMediaUpload}
              acceptedTypes={{
                video: ['video/mp4', 'video/webm', 'video/avi', 'video/mov'],
                audio: ['audio/mp3', 'audio/wav', 'audio/webm', 'audio/m4a', 'audio/aac']
              }}
              maxSizeVideo={500} // 500MB
              maxSizeAudio={50}  // 50MB
              className="w-full"
            />
          </div>

          {/* Results Panel */}
          <div className="space-y-6">
            {/* Upload Results */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Upload Results
                </CardTitle>
                {uploadResults.length > 0 && (
                  <Button 
                    onClick={clearResults}
                    variant="outline" 
                    size="sm"
                  >
                    Clear
                  </Button>
                )}
              </CardHeader>
              <CardContent className="space-y-3">
                {uploadResults.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No uploads yet. Upload or record some media to see results here.
                  </p>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {uploadResults.slice().reverse().map((result, index) => (
                      <div key={index} className="p-3 border rounded-lg space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-sm truncate">{result.fileName}</span>
                          <Badge variant={result.status === 'success' ? 'default' : 'destructive'}>
                            {result.status}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span className="capitalize">{result.type}</span>
                          <span>{result.timestamp.toLocaleTimeString()}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{result.message}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Feature Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Features</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div>
                  <h4 className="font-medium mb-2">File Upload</h4>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Drag & drop support</li>
                    <li>• File type validation</li>
                    <li>• Size limit enforcement</li>
                    <li>• Progress tracking</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Video Recording</h4>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Live camera preview</li>
                    <li>• Real-time duration tracking</li>
                    <li>• WebM format output</li>
                    <li>• Automatic file generation</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Audio Recording</h4>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Visual recording indicator</li>
                    <li>• Duration tracking</li>
                    <li>• High-quality audio capture</li>
                    <li>• Multiple format support</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Azure Integration</h4>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Blob Storage upload</li>
                    <li>• CDN distribution</li>
                    <li>• Secure access tokens</li>
                    <li>• Metadata tracking</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Technical Specs */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Technical Specs</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <span className="font-medium">Video Formats:</span>
                  <p className="text-muted-foreground">MP4, WebM, AVI, MOV</p>
                </div>
                <div>
                  <span className="font-medium">Audio Formats:</span>
                  <p className="text-muted-foreground">MP3, WAV, WebM, M4A, AAC</p>
                </div>
                <div>
                  <span className="font-medium">Max File Sizes:</span>
                  <p className="text-muted-foreground">Video: 500MB, Audio: 50MB</p>
                </div>
                <div>
                  <span className="font-medium">Recording Quality:</span>
                  <p className="text-muted-foreground">VP9/Opus codec, adaptive bitrate</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
