
import * as THREE from "three";
import { Box } from '@react-three/drei';

export const AIComponent = () => {
  const size = 1; // Size of each block
  const numBlocks = 10; // Number of blocks in each direction

  // Generate a grid of blocks to simulate a Minecraft world
  const blocks = [];
  for (let x = 0; x < numBlocks; x++) {
    for (let z = 0; z < numBlocks; z++) {
      // Randomize the height of each column of blocks
      const height = Math.ceil(Math.random() * 5);
      for (let y = 0; y < height; y++) {
        blocks.push({ position: [x * size, y * size, z * size] });
      }
    }
  }

  return (
    <>
      {blocks.map((block, index) => (
        <Box key={index} args={[size, size, size]} position={block.position}>
          <meshStandardMaterial attach="material" color="green" />
        </Box>
      ))}
    </>
  );
};
