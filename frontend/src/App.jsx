import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { ErrorBoundary } from "react-error-boundary";
import { AIComponent } from "./components/AIComponent";
import "./App.css";
import { TestLLM } from "./components/ui/examples/TestLLM";

function App() {
  const logError = (error, info) => {
    // Do something with the error, e.g. log to an external API
    console.log(error);
    console.log(info);
  };

  return (
    <>
      <div className="mx-auto mt-5 flex flex-col flex-wrap items-center md:flex-row md:w-2/3 sm:w-full">
        <div className="flex w-full flex-col items-start justify-center text-center md:w-2/5 md:text-left">
          <h1 className="my-4 text-5xl font-bold leading-tight">
            React-three-fiber + LLMs + LM Studio
          </h1>
          <p className="mb-8 text-2xl leading-normal">A playground for generative 3D on the web.</p>
        </div>
      </div>

      <div className="my-0 w-full py-6 md:mb-40" style={{ width: "100%", height: "800px" }}>
        <Canvas>
          <directionalLight position={[-2, 2, 2]} intensity={1.6} />
          <PerspectiveCamera position={[0, 1.5, 0]} />
          <color attach="background" args={["lightblue"]} />
          <ambientLight intensity={0.5} />
          <pointLight position={[20, 30, 10]} intensity={1} />
          <pointLight position={[-10, -10, -10]} color="blue" />
          <OrbitControls />

          {/* Simple UI for interacting with the backend */}
          <TestLLM />

          {/* AI-generated stuff */}
          <ErrorBoundary fallback={<group />} onError={logError}>
            <AIComponent />
          </ErrorBoundary>
        </Canvas>
      </div>
    </>
  );
}

export default App;
