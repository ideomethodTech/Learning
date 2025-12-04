export async function calculateBikeCenter(THREE, viewer) {
  await viewer.updateComplete;

  try {
    const modelViewerSymbols = Object.getOwnPropertySymbols(viewer);
    const sceneSymbol = modelViewerSymbols.find(
      (symbol) => symbol.description === "scene"
    );

    if (!sceneSymbol) return null;

    const scene = viewer[sceneSymbol];
    const bikeBox = new THREE.Box3().setFromObject(scene);

    // Calculate original center
    const originalBikeCenter = new THREE.Vector3();
    bikeBox.getCenter(originalBikeCenter);
    const cachedBikeCenter = originalBikeCenter.clone();

    console.log("=== INITIAL BIKE CALCULATION ===");
    console.log("📦 Original Bike Center:", originalBikeCenter);

    // Set camera target
    viewer.cameraTarget = `${originalBikeCenter.x}m ${originalBikeCenter.y}m ${originalBikeCenter.z}m`;

    // Store default orbit
    const orbit = viewer.getCameraOrbit();
    const defaultCameraOrbit = {
      theta: (orbit.theta * 180) / Math.PI,
      phi: (orbit.phi * 180) / Math.PI,
      radius: orbit.radius,
    };

    console.log("💾 Stored Default Orbit:", defaultCameraOrbit);
    console.log("=== END INITIAL CALCULATION ===");

    return {
      originalBikeCenter,
      cachedBikeCenter,
      defaultCameraOrbit,
    };
  } catch (error) {
    console.error("Error calculating bike center:", error);
    return null;
  }
}
