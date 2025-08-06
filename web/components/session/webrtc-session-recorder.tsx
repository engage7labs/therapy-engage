'use client';

import React from 'react';

/**
 * ###desabilitado_mvp### WebRTCSessionRecorder
 * 
 * Funcionalidade de gravação WebRTC temporariamente desabilitada para MVP.
 * Esta versão contém apenas a estrutura básica do componente.
 */

export interface WebRTCSessionRecorderProps {
  sessionId?: string;
  patientName?: string;
  className?: string;
  onRecordingStart?: () => void;
  onRecordingStop?: () => void;
  onSessionComplete?: (sessionData: any) => void;
  onSessionEnd?: () => void;
  onError?: (error: Error) => void;
}

export function WebRTCSessionRecorder({
  sessionId,
  patientName,
  className = '',
  onRecordingStart,
  onRecordingStop,
  onSessionComplete,
  onSessionEnd,
  onError
}: WebRTCSessionRecorderProps) {
  return (
    <div className={`webrtc-session-recorder p-4 border border-dashed border-gray-300 rounded-lg ${className}`}>
      <div className="flex items-center justify-center h-32 bg-gray-50 rounded">
        <div className="text-center">
          <div className="text-sm text-gray-500 mb-2">###desabilitado_mvp###</div>
          <div className="text-lg font-medium text-gray-700">WebRTC Session Recorder</div>
          <div className="text-sm text-gray-500 mt-1">
            Componente de gravação de sessão em desenvolvimento
          </div>
          {sessionId && (
            <div className="text-xs text-gray-400 mt-2">
              Session ID: {sessionId}
            </div>
          )}
          {patientName && (
            <div className="text-xs text-gray-400 mt-1">
              Patient: {patientName}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default WebRTCSessionRecorder;
