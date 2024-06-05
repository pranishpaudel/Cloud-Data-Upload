"use client";
import "regenerator-runtime/runtime";
import React from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { Mic, MicOff } from "lucide-react";

const VoiceRecorder = () => {
  const { listening, browserSupportsSpeechRecognition } =
    useSpeechRecognition();

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn’t support Speech Recognition</span>;
  }

  const handleStart = () => {
    SpeechRecognition.startListening({ continuous: true });
  };

  const handleStop = () => {
    SpeechRecognition.stopListening();
  };
  const handleBoth = () => {
    if (listening) {
      handleStop();
    } else {
      handleStart();
    }
  };

  return (
    <>
      {listening ? (
        <Mic onClick={handleBoth} />
      ) : (
        <MicOff onClick={handleBoth} />
      )}
    </>
  );
};

export default VoiceRecorder;
