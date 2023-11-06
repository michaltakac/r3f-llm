
import * as THREE from "three";
import { Box, useTexture } from "@react-three/drei";

export const AIComponent = () => {
  const [texture] = useTexture(["/minecraft-texture.jpg"]);

  const createWorld = () => {
    let world = [];
    for (let i = 0; i < 1000; i++) {
      const position = new THREE.Vector3(
        Math.random() * 1000 - 500,
        Math.random() * 1000 - 500,
        Math.random() * 1000 - 500
      );
      world.push(
        <Box position={position} args={[1, 1, 1]} key={i}>
          <meshBasicMaterial attach="material" map={texture} />
        </Box>
      );
    }
    return world;
  };

  const createHollywoodSign = () => {
    let sign = [];
    const letters = [
      { letter: "H", position: new THREE.Vector3(-8, 0, 0) },
      { letter: "O", position: new THREE.Vector3(-6, 0, 0) },
      { letter: "L", position: new THREE.Vector3(-4, 0, 0) },
      { letter: "L", position: new THREE.Vector3(-2, 0, 0) },
      { letter: "Y", position: new THREE.Vector3(0, 0, 0) },
      { letter: "W", position: new THREE.Vector3(2, 0, 0) },
      { letter: "O", position: new THREE.Vector3(4, 0, 0) },
      { letter: "O", position: new THREE.Vector3(6, 0, 0) },
      { letter: "D", position: new THREE.Vector3(8, 0, 0) },
    ];
    for (let i = 0; i < letters.length; i++) {
      sign.push(
        <Box position={letters[i].position} args={[1, 1, 1]} key={i}>
          <meshBasicMaterial attach="material" map={texture} />
          <textGeometry attach="geometry" args={[letters[i].letter, { size: 1, height: 0.2 }]} />
        </Box>
      );
    }
    return sign;
  };

  return (
    <>
      {createWorld()}
      {createHollywoodSign()}
    </>
  );
};
