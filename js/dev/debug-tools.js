export async function logAllMeshNames(viewer) {
  await viewer.updateComplete;

  const modelViewerSymbols = Object.getOwnPropertySymbols(viewer);
  const sceneSymbol = modelViewerSymbols.find(
    (symbol) => symbol.description === "scene"
  );

  if (!sceneSymbol) return;

  const scene = viewer[sceneSymbol];

  console.log("========== ALL MESH NAMES IN MODEL ==========");

  const allMeshes = [];
  scene.traverse((child) => {
    if (child.isMesh && child.name) {
      allMeshes.push(child.name);
    }
  });

  // Sort alphabetically and log each one
  allMeshes.sort().forEach((name, index) => {
    console.log(`${index + 1}. ${name}`);
  });

  console.log(`✅ Total: ${allMeshes.length} meshes`);
}

// ADD DRAG LISTENER TO FIND PERFECT SCREEN VIEW
export function setupScreenDragListener(viewer) {
  let dragTimeout;

  viewer.addEventListener("camera-change", () => {
    clearTimeout(dragTimeout);
    dragTimeout = setTimeout(() => {
      const orbit = viewer.getCameraOrbit();
      const target = viewer.cameraTarget;

      console.log("🖱️ MANUAL DRAG - Perfect screen view found:");
      console.log(`   Camera Target: ${target}`);
      console.log(`   Camera Orbit:`, orbit);
      console.log(
        `   Copy this: viewer.cameraOrbit = "${
          (orbit.theta * 180) / Math.PI
        }deg ${(orbit.phi * 180) / Math.PI}deg ${orbit.radius}m"`
      );
    }, 500);
  });
}
