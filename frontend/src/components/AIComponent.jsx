
import * as THREE from "three";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Box, Sphere, Torus, Cylinder, Cone, Ring, Octahedron, Dodecahedron } from "@react-three/drei";

const primitives = [Box, Sphere, Torus, Cylinder, Cone, Ring, Octahedron, Dodecahedron];

export const AIComponent = () => {
  const meshRefs = useRef([]);
  meshRefs.current = [];

  const getRandomPrimitive = () => {
    const randomIndex = Math.floor(Math.random() * primitives.length);
    return primitives[randomIndex];
  };

  const getRandomPosition = () => ({
    position: [THREE.MathUtils.randFloatSpread(10), THREE.MathUtils.randFloatSpread(10), THREE.MathUtils.randFloatSpread(10)],
  });

  const getRandomColor = () => {
    return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
  };

  useFrame(() => {
    meshRefs.current.forEach((mesh) => {
      mesh.rotation.x += 0.01;
      mesh.rotation.y += 0.01;
    });
  });

  return (
    <>
      {Array.from({ length: 25 }).map((_, index) => {
        const Primitive = getRandomPrimitive();
        const { position } = getRandomPosition();
        const color = getRandomColor();

        return (
          <Primitive
            key={index}
            ref={(el) => (meshRefs.current[index] = el)}
            position={position}
            args={[1, 1, 1]}
            material={new THREE.MeshStandardMaterial({ color })}
          />
        );
      })}
    </>
  );
};
