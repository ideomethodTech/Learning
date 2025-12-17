export async function changeColor(hexColor, meshName, viewer) {
  console.log(`Changing ${meshName} to color: ${hexColor}`);

  if (!viewer) {
    console.error("Viewer not found!");
    return;
  }

  await viewer.updateComplete;

  const modelViewerSymbols = Object.getOwnPropertySymbols(viewer);
  const sceneSymbol = modelViewerSymbols.find((symbol) => symbol.description === "scene");

  if (!sceneSymbol) return;

  const scene = viewer[sceneSymbol];

  // Convert hex string to THREE.js color
  const threeColor = hexColor.startsWith("#") ? hexColor.substring(1) : hexColor;
  const colorNumber = parseInt(threeColor, 16);

  // Check if meshName is array or single string
  const meshNames = Array.isArray(meshName) ? meshName : [meshName];

  // Find and change the specified mesh color
  let meshFound = false;

  scene.traverse((child) => {
    if (child.isMesh && child.material) {
      // Check if child.name matches any in meshNames array
      if (meshNames.includes(child.name)) {
        meshFound = true;
        console.log(`Changing ${child.name} color...`);
        console.log(`Old color: #${child.material.color.getHexString()}`);

        // Set new color
        child.material.color.set(colorNumber);

        // Force updates
        child.material.needsUpdate = true;
        child.matrixWorldNeedsUpdate = true;

        console.log(`New color: #${child.material.color.getHexString()}`);
      }
    }
  });

  if (!meshFound) {
    console.warn(`Mesh "${meshName}" not found!`);
  }

  viewer.autoRotate = true;
  setTimeout(() => {
    viewer.autoRotate = false;
  }, 50);
}

// analyzeColorableMeshes()
// debug-tools.js:80 === COLORABLE MESHES (can change dynamically) ===
// debug-tools.js:82 1. pHelix8Shape
// debug-tools.js:83    Material: MeshStandardMaterial
// debug-tools.js:84    Current: #121212
// debug-tools.js:85    Vertex Colors: NO
// debug-tools.js:86 ---
// debug-tools.js:82 2. pCylinderShape12
// debug-tools.js:83    Material: MeshStandardMaterial
// debug-tools.js:84    Current: #ffffff
// debug-tools.js:85    Vertex Colors: NO
// debug-tools.js:86 ---
// debug-tools.js:82 3. shockup_geo1Shape
// debug-tools.js:83    Material: MeshStandardMaterial
// debug-tools.js:84    Current: #ffffff
// debug-tools.js:85    Vertex Colors: NO
// debug-tools.js:86 ---
// debug-tools.js:82 4. screenShape
// debug-tools.js:83    Material: MeshStandardMaterial
// debug-tools.js:84    Current: #ffffff
// debug-tools.js:85    Vertex Colors: NO
// debug-tools.js:86 ---
// debug-tools.js:82 5. polySurface258Shape
// debug-tools.js:83    Material: MeshStandardMaterial
// debug-tools.js:84    Current: #545353
// debug-tools.js:85    Vertex Colors: NO
// debug-tools.js:86 ---
// debug-tools.js:82 6. pCylinderShape29
// debug-tools.js:83    Material: MeshStandardMaterial
// debug-tools.js:84    Current: #545353
// debug-tools.js:85    Vertex Colors: NO
// debug-tools.js:86 ---
// debug-tools.js:82 7. polySurfaceShape105
// debug-tools.js:83    Material: MeshStandardMaterial
// debug-tools.js:84    Current: #000000
// debug-tools.js:85    Vertex Colors: NO
// debug-tools.js:86 ---
// debug-tools.js:82 8. polySurfaceShape272
// debug-tools.js:83    Material: MeshStandardMaterial
// debug-tools.js:84    Current: #141414
// debug-tools.js:85    Vertex Colors: NO
// debug-tools.js:86 ---
// debug-tools.js:82 9. polySurfaceShape130
// debug-tools.js:83    Material: MeshStandardMaterial
// debug-tools.js:84    Current: #2f2f2f
// debug-tools.js:85    Vertex Colors: NO
// debug-tools.js:86 ---
// debug-tools.js:82 10. polySurfaceShape296
// debug-tools.js:83    Material: MeshStandardMaterial
// debug-tools.js:84    Current: #f09328
// debug-tools.js:85    Vertex Colors: NO
// debug-tools.js:86 ---
// debug-tools.js:82 11. tyreShape
// debug-tools.js:83    Material: MeshStandardMaterial
// debug-tools.js:84    Current: #000000
// debug-tools.js:85    Vertex Colors: NO
// debug-tools.js:86 ---
// debug-tools.js:82 12. polySurface147Shape
// debug-tools.js:83    Material: MeshStandardMaterial
// debug-tools.js:84    Current: #ffffff
// debug-tools.js:85    Vertex Colors: NO
// debug-tools.js:86 ---
// debug-tools.js:82 13. polySurfaceShape159
// debug-tools.js:83    Material: MeshStandardMaterial
// debug-tools.js:84    Current: #2f2f2f
// debug-tools.js:85    Vertex Colors: NO
// debug-tools.js:86 ---
// debug-tools.js:82 14. polySurface22Shape
// debug-tools.js:83    Material: MeshPhysicalMaterial
// debug-tools.js:84    Current: #ffffff
// debug-tools.js:85    Vertex Colors: NO
// debug-tools.js:86 ---
// debug-tools.js:82 15. polySurface22Shape_1
// debug-tools.js:83    Material: MeshPhysicalMaterial
// debug-tools.js:84    Current: #ffffff
// debug-tools.js:85    Vertex Colors: NO
// debug-tools.js:86 ---
// debug-tools.js:82 16. polySurfaceShape158
// debug-tools.js:83    Material: MeshStandardMaterial
// debug-tools.js:84    Current: #2f2f2f
// debug-tools.js:85    Vertex Colors: NO
// debug-tools.js:86 ---
// debug-tools.js:82 17. polySurfaceShape168
// debug-tools.js:83    Material: MeshStandardMaterial
// debug-tools.js:84    Current: #ffffff
// debug-tools.js:85    Vertex Colors: NO
// debug-tools.js:86 ---
// debug-tools.js:82 18. polySurface91Shape
// debug-tools.js:83    Material: MeshStandardMaterial
// debug-tools.js:84    Current: #2f2f2f
// debug-tools.js:85    Vertex Colors: NO
// debug-tools.js:86 ---
// debug-tools.js:82 19. polySurfaceShape46
// debug-tools.js:83    Material: MeshStandardMaterial
// debug-tools.js:84    Current: #ffffff
// debug-tools.js:85    Vertex Colors: NO
// debug-tools.js:86 ---
// debug-tools.js:82 20. polySurfaceShape100
// debug-tools.js:83    Material: MeshStandardMaterial
// debug-tools.js:84    Current: #2f2f2f
// debug-tools.js:85    Vertex Colors: NO
// debug-tools.js:86 ---
// debug-tools.js:82 21. polySurfaceShape180
// debug-tools.js:83    Material: MeshStandardMaterial
// debug-tools.js:84    Current: #000000
// debug-tools.js:85    Vertex Colors: NO
// debug-tools.js:86 ---
// debug-tools.js:82 22. polySurface260Shape
// debug-tools.js:83    Material: MeshStandardMaterial
// debug-tools.js:84    Current: #121212
// debug-tools.js:85    Vertex Colors: NO
// debug-tools.js:86 ---
// debug-tools.js:82 23. polySurfaceShape1
// debug-tools.js:83    Material: MeshStandardMaterial
// debug-tools.js:84    Current: #121212
// debug-tools.js:85    Vertex Colors: NO
// debug-tools.js:86 ---
// debug-tools.js:82 24. pCylinderShape26
// debug-tools.js:83    Material: MeshStandardMaterial
// debug-tools.js:84    Current: #aaaaaa
// debug-tools.js:85    Vertex Colors: NO
// debug-tools.js:86 ---
// debug-tools.js:82 25. polySurfaceShape246
// debug-tools.js:83    Material: MeshStandardMaterial
// debug-tools.js:84    Current: #545353
// debug-tools.js:85    Vertex Colors: NO
// debug-tools.js:86 ---
// debug-tools.js:82 26. polySurfaceShape46_1
// debug-tools.js:83    Material: MeshStandardMaterial
// debug-tools.js:84    Current: #ffffff
// debug-tools.js:85    Vertex Colors: NO
// debug-tools.js:86 ---
// debug-tools.js:82 27. polySurfaceShape295
// debug-tools.js:83    Material: MeshStandardMaterial
// debug-tools.js:84    Current: #545353
// debug-tools.js:85    Vertex Colors: NO
// debug-tools.js:86 ---
// debug-tools.js:82 28. polySurfaceShape295_1
// debug-tools.js:83    Material: MeshStandardMaterial
// debug-tools.js:84    Current: #2f2f2f
// debug-tools.js:85    Vertex Colors: NO
// debug-tools.js:86 ---
// debug-tools.js:82 29. polySurface277Shape
// debug-tools.js:83    Material: MeshStandardMaterial
// debug-tools.js:84    Current: #f09328
// debug-tools.js:85    Vertex Colors: NO
// debug-tools.js:86 ---
// debug-tools.js:82 30. polySurfaceShape187
// debug-tools.js:83    Material: MeshStandardMaterial
// debug-tools.js:84    Current: #2f2f2f
// debug-tools.js:85    Vertex Colors: NO
// debug-tools.js:86 ---
// debug-tools.js:82 31. polySurfaceShape111
// debug-tools.js:83    Material: MeshStandardMaterial
// debug-tools.js:84    Current: #2f2f2f
// debug-tools.js:85    Vertex Colors: NO
// debug-tools.js:86 ---
// debug-tools.js:82 32. polySurface232Shape
// debug-tools.js:83    Material: MeshStandardMaterial
// debug-tools.js:84    Current: #2f2f2f
// debug-tools.js:85    Vertex Colors: NO
// debug-tools.js:86 ---
// debug-tools.js:82 33. polySurfaceShape181
// debug-tools.js:83    Material: MeshStandardMaterial
// debug-tools.js:84    Current: #ffffff
// debug-tools.js:85    Vertex Colors: NO
// debug-tools.js:86 ---
// debug-tools.js:82 34. polySurface286Shape
// debug-tools.js:83    Material: MeshStandardMaterial
// debug-tools.js:84    Current: #141414
// debug-tools.js:85    Vertex Colors: NO
// debug-tools.js:86 ---
// debug-tools.js:82 35. polySurfaceShape177
// debug-tools.js:83    Material: MeshStandardMaterial
// debug-tools.js:84    Current: #ffffff
// debug-tools.js:85    Vertex Colors: NO
// debug-tools.js:86 ---
// debug-tools.js:82 36. White
// debug-tools.js:83    Material: MeshStandardMaterial
// debug-tools.js:84    Current: #ffffff
// debug-tools.js:85    Vertex Colors: NO
// debug-tools.js:86 ---
// debug-tools.js:82 37. diskShape
// debug-tools.js:83    Material: MeshStandardMaterial
// debug-tools.js:84    Current: #ffffff
// debug-tools.js:85    Vertex Colors: NO
// debug-tools.js:86 ---
// debug-tools.js:82 38. tyreShape_1
// debug-tools.js:83    Material: MeshStandardMaterial
// debug-tools.js:84    Current: #000000
// debug-tools.js:85    Vertex Colors: NO
// debug-tools.js:86 ---
// debug-tools.js:82 39. polySurfaceShape171
// debug-tools.js:83    Material: MeshStandardMaterial
// debug-tools.js:84    Current: #121212
// debug-tools.js:85    Vertex Colors: NO
// debug-tools.js:86 ---
// debug-tools.js:82 40. polySurface143Shape
// debug-tools.js:83    Material: MeshStandardMaterial
// debug-tools.js:84    Current: #ffffff
// debug-tools.js:85    Vertex Colors: NO
// debug-tools.js:86 ---
// debug-tools.js:82 41. polySurface143Shape_1
// debug-tools.js:83    Material: MeshStandardMaterial
// debug-tools.js:84    Current: #565656
// debug-tools.js:85    Vertex Colors: NO
// debug-tools.js:86 ---
// debug-tools.js:82 42. polySurface106Shape
// debug-tools.js:83    Material: MeshStandardMaterial
// debug-tools.js:84    Current: #000000
// debug-tools.js:85    Vertex Colors: NO
// debug-tools.js:86 ---
// debug-tools.js:82 43. polySurfaceShape138
// debug-tools.js:83    Material: MeshStandardMaterial
// debug-tools.js:84    Current: #7a0000
// debug-tools.js:85    Vertex Colors: NO
// debug-tools.js:86 ---
// debug-tools.js:82 44. polySurfaceShape138_1
// debug-tools.js:83    Material: MeshStandardMaterial
// debug-tools.js:84    Current: #ffffff
// debug-tools.js:85    Vertex Colors: NO
// debug-tools.js:86 ---
// debug-tools.js:82 45. polySurface298Shape
// debug-tools.js:83    Material: MeshPhysicalMaterial
// debug-tools.js:84    Current: #fafafa
// debug-tools.js:85    Vertex Colors: NO
// debug-tools.js:86 ---
// debug-tools.js:82 46. polySurfaceShape160
// debug-tools.js:83    Material: MeshStandardMaterial
// debug-tools.js:84    Current: #2f2f2f
// debug-tools.js:85    Vertex Colors: NO
// debug-tools.js:86 ---
// debug-tools.js:82 47. polySurfaceShape142
// debug-tools.js:83    Material: MeshPhysicalMaterial
// debug-tools.js:84    Current: #ffffff
// debug-tools.js:85    Vertex Colors: NO
// debug-tools.js:86 ---
// debug-tools.js:82 48. polySurface229Shape_0_0
// debug-tools.js:83    Material: MeshStandardMaterial
// debug-tools.js:84    Current: #ffffff
// debug-tools.js:85    Vertex Colors: NO
// debug-tools.js:86 ---
// debug-tools.js:82 49. polySurface229Shape_0_1
// debug-tools.js:83    Material: MeshStandardMaterial
// debug-tools.js:84    Current: #ffffff
// debug-tools.js:85    Vertex Colors: NO
// debug-tools.js:86 ---
// debug-tools.js:82 50. polySurface229Shape_1
// debug-tools.js:83    Material: MeshStandardMaterial
// debug-tools.js:84    Current: #ffffff
// debug-tools.js:85    Vertex Colors: NO
// debug-tools.js:86 ---
// debug-tools.js:82 51. polySurface87Shape
// debug-tools.js:83    Material: MeshStandardMaterial
// debug-tools.js:84    Current: #141414
// debug-tools.js:85    Vertex Colors: NO
// debug-tools.js:86 ---
// debug-tools.js:82 52. polySurface144Shape
// debug-tools.js:83    Material: MeshStandardMaterial
// debug-tools.js:84    Current: #ffffff
// debug-tools.js:85    Vertex Colors: NO
// debug-tools.js:86 ---
// debug-tools.js:82 53. polySurfaceShape302
// debug-tools.js:83    Material: MeshStandardMaterial
// debug-tools.js:84    Current: #000000
// debug-tools.js:85    Vertex Colors: NO
// debug-tools.js:86 ---
// debug-tools.js:82 54. polySurfaceShape64
// debug-tools.js:83    Material: MeshStandardMaterial
// debug-tools.js:84    Current: #ffffff
// debug-tools.js:85    Vertex Colors: NO
// debug-tools.js:86 ---
// debug-tools.js:82 55. polySurface268Shape
// debug-tools.js:83    Material: MeshStandardMaterial
// debug-tools.js:84    Current: #ffffff
// debug-tools.js:85    Vertex Colors: NO
// debug-tools.js:86 ---
// debug-tools.js:82 56. polySurfaceShape214
// debug-tools.js:83    Material: MeshStandardMaterial
// debug-tools.js:84    Current: #2f2f2f
// debug-tools.js:85    Vertex Colors: NO
// debug-tools.js:86 ---
// debug-tools.js:82 57. pCylinderShape36
// debug-tools.js:83    Material: MeshStandardMaterial
// debug-tools.js:84    Current: #ffffff
// debug-tools.js:85    Vertex Colors: NO
// debug-tools.js:86 ---
// debug-tools.js:82 58. polySurface193Shape
// debug-tools.js:83    Material: MeshStandardMaterial
// debug-tools.js:84    Current: #141414
// debug-tools.js:85    Vertex Colors: NO
// debug-tools.js:86 ---
// debug-tools.js:82 59. polySurface229Shape_0_0_1
// debug-tools.js:83    Material: MeshStandardMaterial
// debug-tools.js:84    Current: #000000
// debug-tools.js:85    Vertex Colors: NO
// debug-tools.js:86 ---
// debug-tools.js:82 60. polySurface229Shape_0_1_1
// debug-tools.js:83    Material: MeshStandardMaterial
// debug-tools.js:84    Current: #ffffff
// debug-tools.js:85    Vertex Colors: NO
// debug-tools.js:86 ---
// debug-tools.js:82 61. polySurface229Shape_1_1
// debug-tools.js:83    Material: MeshStandardMaterial
// debug-tools.js:84    Current: #ffffff
// debug-tools.js:85    Vertex Colors: NO
// debug-tools.js:86 ---
// debug-tools.js:82 62. polySurface193Shape_1
// debug-tools.js:83    Material: MeshStandardMaterial
// debug-tools.js:84    Current: #141414
// debug-tools.js:85    Vertex Colors: NO
// debug-tools.js:86 ---
// debug-tools.js:82 63. polySurfaceShape234
// debug-tools.js:83    Material: MeshStandardMaterial
// debug-tools.js:84    Current: #121212
// debug-tools.js:85    Vertex Colors: NO
// debug-tools.js:86 ---
// debug-tools.js:82 64. polySurfaceShape234_1
// debug-tools.js:83    Material: MeshStandardMaterial
// debug-tools.js:84    Current: #aaaaaa
// debug-tools.js:85    Vertex Colors: NO
// debug-tools.js:86 ---
// debug-tools.js:82 65. polySurfaceShape234_2
// debug-tools.js:83    Material: MeshStandardMaterial
// debug-tools.js:84    Current: #545353
// debug-tools.js:85    Vertex Colors: NO
// debug-tools.js:86 ---
// debug-tools.js:82 66. polySurfaceShape279
// debug-tools.js:83    Material: MeshStandardMaterial
// debug-tools.js:84    Current: #2f2f2f
// debug-tools.js:85    Vertex Colors: NO
// debug-tools.js:86 ---
// debug-tools.js:82 67. polySurfaceShape110
// debug-tools.js:83    Material: MeshStandardMaterial
// debug-tools.js:84    Current: #121212
// debug-tools.js:85    Vertex Colors: NO
// debug-tools.js:86 ---
// debug-tools.js:82 68. brakee_1Shape
// debug-tools.js:83    Material: MeshStandardMaterial
// debug-tools.js:84    Current: #121212
// debug-tools.js:85    Vertex Colors: NO
// debug-tools.js:86 ---
// debug-tools.js:82 69. polySurfaceShape240
// debug-tools.js:83    Material: MeshStandardMaterial
// debug-tools.js:84    Current: #2f2f2f
// debug-tools.js:85    Vertex Colors: NO
// debug-tools.js:86 ---
// debug-tools.js:82 70. polySurfaceShape291
// debug-tools.js:83    Material: MeshStandardMaterial
// debug-tools.js:84    Current: #2f2f2f
// debug-tools.js:85    Vertex Colors: NO
// debug-tools.js:86 ---
// debug-tools.js:82 71. polySurface127Shape
// debug-tools.js:83    Material: MeshStandardMaterial
// debug-tools.js:84    Current: #2f2f2f
// debug-tools.js:85    Vertex Colors: NO
// debug-tools.js:86 ---
// debug-tools.js:82 72. polySurface233Shape
// debug-tools.js:83    Material: MeshStandardMaterial
// debug-tools.js:84    Current: #2f2f2f
// debug-tools.js:85    Vertex Colors: NO
// debug-tools.js:86 ---
// debug-tools.js:82 73. polySurface90Shape
// debug-tools.js:83    Material: MeshStandardMaterial
// debug-tools.js:84    Current: #f80000
// debug-tools.js:85    Vertex Colors: NO
// debug-tools.js:86 ---
// debug-tools.js:82 74. pCylinder52Shape
// debug-tools.js:83    Material: MeshStandardMaterial
// debug-tools.js:84    Current: #000000
// debug-tools.js:85    Vertex Colors: NO
// debug-tools.js:86 ---
// debug-tools.js:82 75. polySurfaceShape117
// debug-tools.js:83    Material: MeshStandardMaterial
// debug-tools.js:84    Current: #121212
// debug-tools.js:85    Vertex Colors: NO
// debug-tools.js:86 ---
// debug-tools.js:82 76. polySurface287Shape
// debug-tools.js:83    Material: MeshStandardMaterial
// debug-tools.js:84    Current: #ffffff
// debug-tools.js:85    Vertex Colors: NO
// debug-tools.js:86 ---
// debug-tools.js:82 77. polySurface287Shape_1
// debug-tools.js:83    Material: MeshStandardMaterial
// debug-tools.js:84    Current: #2f2f2f
// debug-tools.js:85    Vertex Colors: NO
// debug-tools.js:86 ---
// debug-tools.js:82 78. polySurfaceShape245
// debug-tools.js:83    Material: MeshStandardMaterial
// debug-tools.js:84    Current: #545353
// debug-tools.js:85    Vertex Colors: NO
// debug-tools.js:86 ---
// debug-tools.js:82 79. polySurface220Shape
// debug-tools.js:83    Material: MeshStandardMaterial
// debug-tools.js:84    Current: #ffffff
// debug-tools.js:85    Vertex Colors: NO
// debug-tools.js:86 ---
// debug-tools.js:82 80. pHelixShape7
// debug-tools.js:83    Material: MeshStandardMaterial
// debug-tools.js:84    Current: #aaaaaa
// debug-tools.js:85    Vertex Colors: NO
// debug-tools.js:86 ---
// debug-tools.js:82 81. shockup_geo1Shape_1
// debug-tools.js:83    Material: MeshStandardMaterial
// debug-tools.js:84    Current: #ffffff
// debug-tools.js:85    Vertex Colors: NO
// debug-tools.js:86 ---
// debug-tools.js:82 82. polySurfaceShape229
// debug-tools.js:83    Material: MeshStandardMaterial
// debug-tools.js:84    Current: #141414
// debug-tools.js:85    Vertex Colors: NO
// debug-tools.js:86 ---
// debug-tools.js:82 83. polySurface77Shape_0
// debug-tools.js:83    Material: MeshStandardMaterial
// debug-tools.js:84    Current: #000000
// debug-tools.js:85    Vertex Colors: NO
// debug-tools.js:86 ---
// debug-tools.js:82 84. seathandleShape
// debug-tools.js:83    Material: MeshStandardMaterial
// debug-tools.js:84    Current: #000000
// debug-tools.js:85    Vertex Colors: NO
// debug-tools.js:86 ---
// debug-tools.js:82 85. polySurfaceShape143
// debug-tools.js:83    Material: MeshStandardMaterial
// debug-tools.js:84    Current: #ffffff
// debug-tools.js:85    Vertex Colors: NO
// debug-tools.js:86 ---
// debug-tools.js:82 86. polySurfaceShape143_1
// debug-tools.js:83    Material: MeshStandardMaterial
// debug-tools.js:84    Current: #ffffff
// debug-tools.js:85    Vertex Colors: NO
// debug-tools.js:86 ---
// debug-tools.js:82 87. polySurfaceShape63
// debug-tools.js:83    Material: MeshStandardMaterial
// debug-tools.js:84    Current: #4d4d4d
// debug-tools.js:85    Vertex Colors: NO
// debug-tools.js:86 ---
// debug-tools.js:82 88. polySurfaceShape99
// debug-tools.js:83    Material: MeshStandardMaterial
// debug-tools.js:84    Current: #141414
// debug-tools.js:85    Vertex Colors: NO
// debug-tools.js:86 ---
// debug-tools.js:82 89. sidestandShape
// debug-tools.js:83    Material: MeshStandardMaterial
// debug-tools.js:84    Current: #121212
// debug-tools.js:85    Vertex Colors: NO
// debug-tools.js:86 ---
// debug-tools.js:82 90. polySurfaceShape109
// debug-tools.js:83    Material: MeshStandardMaterial
// debug-tools.js:84    Current: #121212
// debug-tools.js:85    Vertex Colors: NO
// debug-tools.js:86 ---
// debug-tools.js:82 91. pCylinderShape13
// debug-tools.js:83    Material: MeshStandardMaterial
// debug-tools.js:84    Current: #aaaaaa
// debug-tools.js:85    Vertex Colors: NO
// debug-tools.js:86 ---
// debug-tools.js:82 92. polySurface281Shape
// debug-tools.js:83    Material: MeshStandardMaterial
// debug-tools.js:84    Current: #5c5c5c
// debug-tools.js:85    Vertex Colors: NO
// debug-tools.js:86 ---
// debug-tools.js:82 93. polySurfaceShape218
// debug-tools.js:83    Material: MeshStandardMaterial
// debug-tools.js:84    Current: #ca0000
// debug-tools.js:85    Vertex Colors: NO
// debug-tools.js:86 ---
// debug-tools.js:82 94. polySurfaceShape99_1
// debug-tools.js:83    Material: MeshStandardMaterial
// debug-tools.js:84    Current: #141414
// debug-tools.js:85    Vertex Colors: NO
// debug-tools.js:86 ---
// debug-tools.js:82 95. polySurface283Shape
// debug-tools.js:83    Material: MeshStandardMaterial
// debug-tools.js:84    Current: #141414
// debug-tools.js:85    Vertex Colors: NO
// debug-tools.js:86 ---
// debug-tools.js:82 96. polySurface283Shape_1
// debug-tools.js:83    Material: MeshStandardMaterial
// debug-tools.js:84    Current: #2f2f2f
// debug-tools.js:85    Vertex Colors: NO
// debug-tools.js:86 ---
// debug-tools.js:82 97. FntLit_glassShape
// debug-tools.js:83    Material: MeshPhysicalMaterial
// debug-tools.js:84    Current: #ffffff
// debug-tools.js:85    Vertex Colors: NO
// debug-tools.js:86 ---
// debug-tools.js:82 98. polySurfaceShape301
// debug-tools.js:83    Material: MeshStandardMaterial
// debug-tools.js:84    Current: #141414
// debug-tools.js:85    Vertex Colors: NO
// debug-tools.js:86 ---
// debug-tools.js:82 99. polySurfaceShape122
// debug-tools.js:83    Material: MeshStandardMaterial
// debug-tools.js:84    Current: #2f2f2f
// debug-tools.js:85    Vertex Colors: NO
// debug-tools.js:86 ---
// debug-tools.js:82 100. polySurfaceShape266
// debug-tools.js:83    Material: MeshStandardMaterial
// debug-tools.js:84    Current: #545353
// debug-tools.js:85    Vertex Colors: NO
// debug-tools.js:86 ---
// debug-tools.js:82 101. seathandleShape_1
// debug-tools.js:83    Material: MeshStandardMaterial
// debug-tools.js:84    Current: #000000
// debug-tools.js:85    Vertex Colors: NO
// debug-tools.js:86 ---
// debug-tools.js:82 102. seathandleShape_2
// debug-tools.js:83    Material: MeshStandardMaterial
// debug-tools.js:84    Current: #000000
// debug-tools.js:85    Vertex Colors: NO
// debug-tools.js:86 ---
// debug-tools.js:82 103. polySurface297Shape
// debug-tools.js:83    Material: MeshStandardMaterial
// debug-tools.js:84    Current: #3f3f3f
// debug-tools.js:85    Vertex Colors: NO
// debug-tools.js:86 ---
// debug-tools.js:82 104. polySurfaceShape242
// debug-tools.js:83    Material: MeshStandardMaterial
// debug-tools.js:84    Current: #121212
// debug-tools.js:85    Vertex Colors: NO
// debug-tools.js:86 ---
// debug-tools.js:82 105. pSphere3Shape
// debug-tools.js:83    Material: MeshPhysicalMaterial
// debug-tools.js:84    Current: #edab00
// debug-tools.js:85    Vertex Colors: NO
// debug-tools.js:86 ---
// debug-tools.js:82 106. polySurfaceShape114
// debug-tools.js:83    Material: MeshStandardMaterial
// debug-tools.js:84    Current: #2f2f2f
// debug-tools.js:85    Vertex Colors: NO
// debug-tools.js:86 ---
// debug-tools.js:82 107. pCylinder28Shape
// debug-tools.js:83    Material: MeshStandardMaterial
// debug-tools.js:84    Current: #2f2f2f
// debug-tools.js:85    Vertex Colors: NO
// debug-tools.js:86 ---
// debug-tools.js:82 108. polySurfaceShape118
// debug-tools.js:83    Material: MeshStandardMaterial
// debug-tools.js:84    Current: #121212
// debug-tools.js:85    Vertex Colors: NO
// debug-tools.js:86 ---
// debug-tools.js:82 109. partpolySurfaceShape298
// debug-tools.js:83    Material: MeshStandardMaterial
// debug-tools.js:84    Current: #ffffff
// debug-tools.js:85    Vertex Colors: NO
// debug-tools.js:86 ---
// debug-tools.js:82 110. partpolySurfaceShape298_1
// debug-tools.js:83    Material: MeshStandardMaterial
// debug-tools.js:84    Current: #e6e6e6
// debug-tools.js:85    Vertex Colors: NO
// debug-tools.js:86 ---
// debug-tools.js:82 111. polySurfaceShape314
// debug-tools.js:83    Material: MeshStandardMaterial
// debug-tools.js:84    Current: #ffffff
// debug-tools.js:85    Vertex Colors: NO
// debug-tools.js:86 ---
// debug-tools.js:82 112. polySurfaceShape317
// debug-tools.js:83    Material: MeshStandardMaterial
// debug-tools.js:84    Current: #ffffff
// debug-tools.js:85    Vertex Colors: NO
// debug-tools.js:86 ---
// debug-tools.js:82 113. pPlane5Shape
// debug-tools.js:83    Material: MeshStandardMaterial
// debug-tools.js:84    Current: #ca0000
// debug-tools.js:85    Vertex Colors: NO
// debug-tools.js:86 ---
// debug-tools.js:82 114. polySurface315Shape
// debug-tools.js:83    Material: MeshStandardMaterial
// debug-tools.js:84    Current: #e6e6e6
// debug-tools.js:85    Vertex Colors: NO
// debug-tools.js:86 ---
// debug-tools.js:82 115. PortpolySurfaceShape317
// debug-tools.js:83    Material: MeshStandardMaterial
// debug-tools.js:84    Current: #141414
// debug-tools.js:85    Vertex Colors: NO
// debug-tools.js:86 ---
// debug-tools.js:82 116. PortpolySurface320Shape
// debug-tools.js:83    Material: MeshStandardMaterial
// debug-tools.js:84    Current: #ffffff
// debug-tools.js:85    Vertex Colors: NO
// debug-tools.js:86 ---
// debug-tools.js:82 117. polySurfaceShape305
// debug-tools.js:83    Material: MeshStandardMaterial
// debug-tools.js:84    Current: #121212
// debug-tools.js:85    Vertex Colors: NO
// debug-tools.js:86 ---
// debug-tools.js:82 118. polySurface303Shape
// debug-tools.js:83    Material: MeshStandardMaterial
// debug-tools.js:84    Current: #141414
// debug-tools.js:85    Vertex Colors: NO
// debug-tools.js:86 ---
// debug-tools.js:82 119. polySurfaceShape50
// debug-tools.js:83    Material: MeshStandardMaterial
// debug-tools.js:84    Current: #141414
// debug-tools.js:85    Vertex Colors: NO
// debug-tools.js:86 ---
// debug-tools.js:82 120. polySurfaceShape50_1
// debug-tools.js:83    Material: MeshStandardMaterial
// debug-tools.js:84    Current: #141414
// debug-tools.js:85    Vertex Colors: NO
// debug-tools.js:86 ---
// debug-tools.js:82 121. polySurface301Shape
// debug-tools.js:83    Material: MeshStandardMaterial
// debug-tools.js:84    Current: #ffffff
// debug-tools.js:85    Vertex Colors: NO
// debug-tools.js:86 ---
// debug-tools.js:82 122. polySurface55Shape
// debug-tools.js:83    Material: MeshStandardMaterial
// debug-tools.js:84    Current: #ffffff
// debug-tools.js:85    Vertex Colors: NO
// debug-tools.js:86 ---
// debug-tools.js:82 123. polySurfaceShape316
// debug-tools.js:83    Material: MeshPhysicalMaterial
// debug-tools.js:84    Current: #f2f2f2
// debug-tools.js:85    Vertex Colors: NO
// debug-tools.js:86 ---
// debug-tools.js:82 124. polySurfaceShape316_1
// debug-tools.js:83    Material: MeshPhysicalMaterial
// debug-tools.js:84    Current: #f2f2f2
// debug-tools.js:85    Vertex Colors: NO
// debug-tools.js:86 ---
// debug-tools.js:82 125. polySurfaceShape313
// debug-tools.js:83    Material: MeshStandardMaterial
// debug-tools.js:84    Current: #ffffff
// debug-tools.js:85    Vertex Colors: NO
// debug-tools.js:86 ---
// debug-tools.js:82 126. polySurfaceShape315
// debug-tools.js:83    Material: MeshStandardMaterial
// debug-tools.js:84    Current: #ffffff
// debug-tools.js:85    Vertex Colors: NO
// debug-tools.js:86 ---
// debug-tools.js:82 127. polySurface201Shape
// debug-tools.js:83    Material: MeshStandardMaterial
// debug-tools.js:84    Current: #ffffff
// debug-tools.js:85    Vertex Colors: NO