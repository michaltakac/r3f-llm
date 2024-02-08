import React, { useState } from "react";
import * as THREE from "three";
import * as R3FDrei from "@react-three/drei";

export function TestLLM() {
  const [inputValue, setInputValue] = useState(
    "Create 25 3D primitives from react-three/drei component with random type of either Box, Sphere, Torus, Cylinder, Cone, Ring, Tetrahedron, Octahedron, or Dodecahedron, that will be positioned within 10x10x10 range in 3D, every one with different color, with their rotation animated on every frame.",
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResult, setGeneratedResult] = useState("");

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSend = () => {
    setIsGenerating(true);
    if (inputValue.trim() !== "") {
      // Replace with your server's API endpoint and key
      const API_ENDPOINT = "http://localhost:8000/generate-code/AIComponent";

      const data = {
        system_prompt: `Below is an instruction that describes a code generation task. Write a response that appropriately completes the request in the format of cleaned and trimmed React component, without any additional explanation or any text beside the code block. Code in the response will be integrated into existing component that is imported into @react-three/fiber app. Leverage components from '@react-three/drei' and include 'import * as THREE from "three";' at the beginning of the code. Don't include any textual explanation or 'Here's the JSX code that completes your request' in the response beside the code. Component should be exported as a named export and the component name is 'AIComponent'. Wrap every entity inside <Grabbable> component from "@coconut-xr/natuerlich/defaults"`,
        user_prompt: inputValue,
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
  return (
    <group>
      {/* Input plane with dynamic texture as input field background */}
      <R3FDrei.Plane args={[2.5, 0.5]} position={[-0.5, 0, 0]}>
        {/* Placeholder texture */}
        {/* You might want to create a dynamic texture that reflects the current input or just overlay text */}
        <meshBasicMaterial attach="material" color="#DDD" />
      </R3FDrei.Plane>

      {/* Text input value */}
      <R3FDrei.Text
        position={[-0.5, 0, 0.1]}
        fontSize={0.1}
        color="#000"
        maxWidth={20}
        scale={0.7}
        anchorX="center"
        anchorY="middle"
        onUpdate={(e) => console.log(e)}
      >
        {inputValue || "Enter your prompt"}
      </R3FDrei.Text>

      {/* Send button */}
      <group onClick={handleSend}>
        <R3FDrei.Plane args={[0.5, 0.5]} position={[1.25, 0, 0]}>
          <meshBasicMaterial attach="material" color="#007bff" />
        </R3FDrei.Plane>

        <R3FDrei.Text
          position={[1.25, 0, 0.1]}
          fontSize={0.1}
          color="#FFF"
          anchorX="center"
          anchorY="middle"
        >
          {isGenerating ? "Generating..." : "Send"}
        </R3FDrei.Text>
      </group>
    </group>
  );
}
