
import React from 'react';
import * as THREE from "three";
import { Box } from '@react-three/drei';

export const AIComponent = () => {
  return (
    <Box
      position={[4, 1, -8]}
      rotation={[-Math.PI / 4, 0, 0]}
      material-color="red"
    />
  );
};
