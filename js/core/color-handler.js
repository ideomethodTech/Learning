// // color-handler.js
// export async function changeColor(color, viewer) {
//   await viewer.updateComplete;
//   console.log(color)

//   const modelViewerSymbols = Object.getOwnPropertySymbols(viewer);
//   const sceneSymbol = modelViewerSymbols.find((symbol) => symbol.description === "scene");

//   if (!sceneSymbol) return;

//   const scene = viewer[sceneSymbol];

//   // Find and change BackPanel_metalShape color
//   scene.traverse((child) => {
//     if (child.isMesh && child.name === "BackPanel_metalShape" && child.material) {
//       console.log(`Changing ${child.name} color...`);
//       console.log(`Old color: #${child.material.color.getHexString()}`);

//       // Set new color
//       if (color.name === "red_cresta.glb") {
//         child.material.color.set(0xd62828);
//       } else if (color.name  === "blue_cresta.glb") {
//         child.material.color.set(0x1e88e5);
//       } else if (color.name  === "grey_cresta.glb") {
//         child.material.color.set(0x8e8e8e);
//       } else if (color.name  === "black_cresta.glb") {
//         child.material.color.set(0x111111);
//       }

//       // Force material update
//       child.material.needsUpdate = true;

//       // Force geometry update if it has vertex colors
//       if (child.geometry.attributes.color) {
//         child.geometry.attributes.color.needsUpdate = true;
//       }

//       // Mark the object as needing update
//       child.matrixWorldNeedsUpdate = true;

//       console.log(`New color: #${child.material.color.getHexString()}`);
//     }
//   });

//   // Force viewer to update
//   if (viewer.requestRender) {
//     viewer.requestRender();
//   }

//   // Alternative: Trigger a camera change to force re-render
//   const currentOrbit = viewer.getCameraOrbit();
//   viewer.cameraOrbit = `${currentOrbit.theta}rad ${currentOrbit.phi}rad ${currentOrbit.radius}m`;
// }

// color-handler.js
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
  const threeColor = hexColor.startsWith('#') ? hexColor.substring(1) : hexColor;
  const colorNumber = parseInt(threeColor, 16);
  
  // Find and change the specified mesh color
  let meshFound = false;
  
  scene.traverse((child) => {
    if (child.isMesh && child.name === meshName && child.material) {
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
  });
  
  if (!meshFound) {
    console.warn(`Mesh "${meshName}" not found!`);
  }
  
  // Force re-render
  if (viewer.requestRender) {
    viewer.requestRender();
  }
}
