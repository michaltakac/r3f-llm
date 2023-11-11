import { create } from 'zustand'

export const useStore = create((set) => ({
  prompt: `Create 25 3D primitives from react-three/drei component with random type of either Box, Sphere, Torus, Cylinder, Cone, Ring, Octahedron, or Dodecahedron, that will be positioned within 10x10x10 range in 3D, every one with different color, with their rotation animated on every frame.`,
  setPromptText: (text) => set(() => ({ prompt: text })),
  clearPrompt: () => set({ prompt: "" }),
}))