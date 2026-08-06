// src/images.d.ts
declare module "*.jpeg" {
  const src: string;
  export default src;
}
declare module "*.jpg" {
  const src: string;
  export default src;
}
declare module "*.png" {
  const src: string;
  export default src;
}
// R3F Three.js JSX elements
/// <reference types="@react-three/fiber" />

declare module "*.css" {
  const content: Record<string, string>;
  export default content;
}
