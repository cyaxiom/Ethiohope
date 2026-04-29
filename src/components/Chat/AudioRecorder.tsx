import React, { useState, useRef, useEffect } from 'react';
import { Mic } from 'lucide-react';

interface AudioRecorderProps {
  onSave: (url: string, duration: string) => void;
  onClose: () => void;
}

const AudioRecorder: React.FC<AudioRecorderProps> = ({ onSave, onClose }) => {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const chunksRef = useRef<Blob[]>([]);

  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (!isRecording) return;
    const interval = setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isRecording]);

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
      };

      recorder.start();
      setSeconds(0);
      setIsRecording(true);
    } catch (err) {
      console.error('Error starting audio recording:', err);
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    streamRef.current?.getTracks().forEach((t) => t.stop());
    setIsRecording(false);
  };

  const handleSave = () => {
    if (audioUrl) {
      onSave(audioUrl, new Date(seconds * 1000).toISOString().substring(14, 19));
      onClose();
    }
  };

  return (
    <div className="relative w-full max-w-md mx-auto bg-background rounded-xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">
          {isRecording ? 'Recording...' : 'Share Audio'}
        </h2>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20"
        >
          ✕
        </button>
      </div>

      <div className="text-center text-2xl font-mono mb-6">
        {new Date(seconds * 1000).toISOString().substring(14, 19)}
      </div>

      <div className="flex justify-center mb-8">
        <div
          className={`w-20 h-20 rounded-full flex items-center justify-center
          ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-white/10'}`}
        >
          <Mic className="h-10 w-10" />
        </div>
      </div>

      <div className="flex justify-center gap-4">
        {!isRecording && !audioUrl && (
          <button
            onClick={startRecording}
            className="px-6 py-2 rounded-full bg-green-500 hover:bg-green-600"
          >
            Start
          </button>
        )}

        {isRecording && (
          <button
            onClick={stopRecording}
            className="px-6 py-2 rounded-full bg-red-500 hover:bg-red-600"
          >
            Stop
          </button>
        )}
      </div>

      {audioUrl && (
        <div className="mt-6">
          <audio ref={audioRef} src={audioUrl} controls className="w-full" />

          <div className="mt-4 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-white/10"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AudioRecorder;
