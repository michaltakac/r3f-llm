import React, { useEffect, useState } from "react";
import { useWhisper } from "@chengsokdara/use-whisper";
import { useStore } from "../../../store";

export function TranscriptButtons() {
  const [transcribing, setTranscribing] = useState(false);
  const prompt = useStore((state) => state.prompt);
  const setPromptText = useStore((state) => state.setPromptText);
  const setAudioRecordingInfo = useStore((state) => state.setAudioRecordingInfo);
  const audioRecordingInfo = useStore((state) => state.audioRecordingInfo);

  const onTranscribe = async (blob) => {
    // setAudioRecordingInfo("Transcribing...");
    setTranscribing(true);
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
    try {
      const { text } = await response.json();
      setAudioRecordingInfo("");
      setTranscribing(false);

      if (text) {
        setPromptText(prompt + (prompt ? `\n${text}` : `${text}`));
      }

      return {
        blob,
        text,
      };
    } catch (e) {
      console.log(e)
      setAudioRecordingInfo("");
      setTranscribing(false);

      return {
        blob,
        text: "",
      };
    }
  };

  const { recording, pauseRecording, startRecording, stopRecording } = useWhisper({
    // apiKey: process.env.REACT_APP_OPENAI_API_KEY,
    mode: "transcriptions",
    // streaming: true,
    // timeSlice: 1_000, // 1 second
    removeSilence: true,
    onTranscribe,
  });

  useEffect(() => {
    if (recording) {
      setAudioRecordingInfo("Text will be transcribed after recording is stopped...");
    } else {
      setAudioRecordingInfo("");
    }
  }, [recording]);
  return (
    <>
      <button
        onClick={() => startRecording()}
        disabled={recording || transcribing}
        className="shadow bg-red-500 hover:bg-red-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 mr-1 rounded"
      >
        {recording ? "Recording..." : transcribing ? "Transcribing..." : "Start transcribing audio"}
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
      <div>{audioRecordingInfo}</div>
    </>
  );
}
