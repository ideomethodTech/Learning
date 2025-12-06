import { resetLastFocusedItem } from "./focus-mesh.js";

// reset camera  when Toggling OFF
export async function resetCameraToDefault(viewer, cachedBikeCenter, defaultCameraOrbit) {
  if (!cachedBikeCenter || !defaultCameraOrbit) return;
  viewer.fieldOfView = "auto";

  // ✅ TURN OFF LIGHT EFFECT
  const modelViewerSymbols = Object.getOwnPropertySymbols(viewer);
  const sceneSymbol = modelViewerSymbols.find((symbol) => symbol.description === "scene");

  if (sceneSymbol) {
    const scene = viewer[sceneSymbol];
    scene.traverse((child) => {
      if (child.isMesh && child.originalMaterial) {
        // Restore original material properties
        child.material.emissive = child.originalMaterial.emissive;
        child.material.emissiveIntensity = child.originalMaterial.emissiveIntensity;
      }
    });
  }

  // Your existing reset code...
  viewer.timeScale = 0.5;
  viewer.cameraTarget = `${cachedBikeCenter.x}m ${cachedBikeCenter.y}m ${cachedBikeCenter.z}m`;
  viewer.cameraOrbit = `${defaultCameraOrbit.theta}deg ${defaultCameraOrbit.phi}deg ${defaultCameraOrbit.radius}m`;

  let cameraChangeTimeout;
  function onCameraChange() {
    clearTimeout(cameraChangeTimeout);
    cameraChangeTimeout = setTimeout(() => {
      viewer.timeScale = 1.0;
      viewer.removeEventListener("camera-change", onCameraChange);
    }, 200);
  }
  viewer.addEventListener("camera-change", onCameraChange);

  resetLastFocusedItem();

  // Close storage if it's open
  try {
    const storageModule = await import("./storage-animation.js");
    if (storageModule.getStorageState()) {
      await storageModule.closeStorage(viewer);
    }
  } catch (error) {
    console.error("❌ Failed to close storage:", error);
  }
}
