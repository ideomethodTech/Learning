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
