import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { ErrorBoundary } from "react-error-boundary";
import { AIComponent } from "./components/AIComponent";
import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { TestLLM } from "./components/ui/examples/TestLLM";
import { useStore } from "./store";

import "./App.css";
import { TranscriptButtons } from "./components/ui/examples/TranscriptButtons";

function App() {
  const setPromptText = useStore((state) => state.setPromptText);
  const promptText = useStore((state) => state.prompt);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResult, setGeneratedResult] = useState("");

  const sanda3DModel = useLoader(GLTFLoader, "/gangster-santa.glb");

  const handleInputChange = (e) => {
    setPromptText(e.target.value);
  };

  const handleSend = (e) => {
    e.preventDefault();
    setIsGenerating(true);
    if (promptText.trim() !== "") {
      // Replace with your server's API endpoint and key
      const API_ENDPOINT = "http://localhost:8000/generate-code/AIComponent";

      const data = {
        system_prompt: `Below is an instruction that describes a code generation task. Write a response that appropriately completes the request in the format of cleaned and trimmed React component, without any additional explanation or any text beside the code block. Code in the response will be integrated into existing component that is imported into @react-three/fiber app. Leverage components from '@react-three/drei' and include 'import * as THREE from "three";' at the beginning of the code. Don't include any textual explanation or 'Here's the JSX code that completes your request' in the response beside the code. Component should be exported as a named export and the component name is 'AIComponent'`,
        user_prompt: promptText,
        temperature: 0.2,
        max_tokens: 2048,
        // max_tokens: -1,
        stream: false,
      };
      console.log(data);

      fetch(API_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then((data) => {
          setIsGenerating(false);
          console.log(data);
          console.log(data.detail);
          console.log(data.code);
          setGeneratedResult(data.code || "");
        })
        .catch((error) => {
          setIsGenerating(false);
          console.error("Error:", error);
          setGeneratedResult("");
        });
    }
  };
  const logError = (error, info) => {
    // Do something with the error, e.g. log to an external API
    console.log(error);
    console.log(info);
  };

  return (
    <>
      <div className="mx-auto mt-5 items-center w-full container">
        <div className="w-full items-start justify-center text-center text-left">
          <h1 className="my-4 text-2xl font-bold leading-tight">
            React-three-fiber + LLMs + LM Studio
          </h1>
          <p className="mb-8 text-xl leading-normal">A playground for generative 3D on the web.</p>
        </div>
      </div>

      <div className="w-full" style={{ width: "900px" }}>
        <div className="md:flex md:items-center">
          <div className="md:w-1/3"></div>
          <div className="md:w-2/3">
            <TranscriptButtons />
          </div>
        </div>
        <form onSubmit={handleSend}>
          <div className="md:flex md:items-center mb-6">
            <div className="md:w-1/3">
              <label
                className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                htmlFor="inline-full-name"
              >
                Prompt
              </label>
            </div>
            <div style={{ width: "700px" }}>
              <textarea
                rows={5}
                className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                id="inline-full-name"
                type="text"
                value={promptText}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="md:flex md:items-center">
            <div className="md:w-1/3"></div>
            <div className="md:w-2/3">
              <button
                className="shadow bg-green-500 hover:bg-green-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 mr-1 rounded"
                type="submit"
              >
                {isGenerating ? "Generating..." : "Generate 3D objects"}
              </button>
            </div>
          </div>
        </form>
      </div>

      <div className="my-0 w-full py-6 md:mb-40" style={{ width: "100%", height: "800px" }}>
        <Canvas>
          <directionalLight position={[-2, 2, 2]} intensity={1.6} />
          <PerspectiveCamera position={[0, 1.5, 0]} />
          <Environment background preset="dawn" blur={0.8} />
          <ambientLight intensity={0.5} />
          <pointLight position={[20, 30, 10]} intensity={1} />
          <pointLight position={[-10, -10, -10]} color="blue" />
          <OrbitControls />

          <primitive object={sanda3DModel.scene} />

          {/* Simple UI for interacting with the backend */}
          {/* <TestLLM /> */}

          {/* AI-generated stuff */}
          <ErrorBoundary fallback={<group />} onError={logError}>
            <AIComponent generatedResult={generatedResult} />
          </ErrorBoundary>
        </Canvas>
      </div>
    </>
  );
}

export default App;
