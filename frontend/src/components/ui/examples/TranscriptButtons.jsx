import React, { useEffect } from "react";
import { useWhisper } from "@chengsokdara/use-whisper";
import { useStore } from "../../../store";

export function TranscriptButtons() {
  const setPromptText = useStore((state) => state.setPromptText);

  const onTranscribe = async (blob) => {
    console.log("transcribing");
    const base64 = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
    const API_ENDPOINT = "http://localhost:8000/transcribe-audio";
    const body = JSON.stringify({ file: base64, model: "small.en" });
    const headers = { "Content-Type": "application/json" };
    const response = await fetch(API_ENDPOINT, {
      method: "POST",
      headers,
      body,
    });
    const { text } = await response.data;
    // you must return result from your server in Transcript format
    return {
      blob,
      text,
    };
  };

  const {
    transcript,
    pauseRecording,
    startRecording,
    stopRecording,
  } = useWhisper({
    apiKey: process.env.REACT_APP_OPENAI_API_KEY,
    mode: "transcriptions",
    streaming: true,
    timeSlice: 1_000, // 1 second
    removeSilence: true,
    whisperConfig: {
      language: "en",
    },
  });

  useEffect(() => {
    if (transcript.text) {
      setPromptText(transcript.text);
    }
  }, [transcript.text]);
  return (
    <>
      <button
        onClick={() => startRecording()}
        className="shadow bg-red-500 hover:bg-red-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 mr-1 rounded"
      >
        Start transcribing audio
      </button>
      <button
        onClick={() => pauseRecording()}
        className="shadow bg-blue-500 hover:bg-blue-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 mr-1 rounded"
      >
        Pause
      </button>
      <button
        onClick={() => stopRecording()}
        className="shadow bg-blue-500 hover:bg-blue-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 mr-1 rounded"
      >
        Stop
      </button>
    </>
  );
}
