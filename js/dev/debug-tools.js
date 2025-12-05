export async function logAllMeshNames(viewer) {
  await viewer.updateComplete;

  const modelViewerSymbols = Object.getOwnPropertySymbols(viewer);
  const sceneSymbol = modelViewerSymbols.find((symbol) => symbol.description === "scene");

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
        `   Copy this: viewer.cameraOrbit = "${(orbit.theta * 180) / Math.PI}deg ${(orbit.phi * 180) / Math.PI}deg ${
          orbit.radius
        }m"`
      );
    }, 500);
  });
}

export async function analyzeColorableMeshes(viewer) {
  await viewer.updateComplete;

  const modelViewerSymbols = Object.getOwnPropertySymbols(viewer);
  const sceneSymbol = modelViewerSymbols.find((symbol) => symbol.description === "scene");

  if (!sceneSymbol) return;

  const scene = viewer[sceneSymbol];
  const colorableMeshes = [];

  scene.traverse((child) => {
    if (child.isMesh && child.material) {
      const mat = child.material;
      const meshInfo = {
        name: child.name,
        materialType: mat.type,
        hasColor: !!mat.color,
        currentColor: mat.color ? "#" + mat.color.getHexString() : null,
        isTransparent: mat.transparent,
        vertexColors: child.geometry.hasAttribute("color") ? "YES" : "NO",
      };

      // Materials that CAN be recolored:
      if (mat.color && !mat.transparent && mat.type.includes("Material")) {
        colorableMeshes.push(meshInfo);
      }
    }
  });

  console.log("=== COLORABLE MESHES (can change dynamically) ===");
  colorableMeshes.forEach((mesh, i) => {
    console.log(`${i + 1}. ${mesh.name}`);
    console.log(`   Material: ${mesh.materialType}`);
    console.log(`   Current: ${mesh.currentColor}`);
    console.log(`   Vertex Colors: ${mesh.vertexColors}`);
    console.log("---");
  });

  return colorableMeshes;
}
