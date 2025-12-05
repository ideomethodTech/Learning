export async function calculateBikeCenter(THREE, viewer) {
  await viewer.updateComplete;

  try {
    const modelViewerSymbols = Object.getOwnPropertySymbols(viewer);
    const sceneSymbol = modelViewerSymbols.find((symbol) => symbol.description === "scene");

    if (!sceneSymbol) return null;

    const scene = viewer[sceneSymbol];

    // Calculate the bounding box BEFORE moving
    const bikeBox = new THREE.Box3().setFromObject(scene);
    const originalCenter = new THREE.Vector3();
    bikeBox.getCenter(originalCenter);

    console.log("=== INITIAL BIKE CALCULATION ===");
    console.log("📦 Original Model Center:", originalCenter);

    // Move the model to origin (0,0,0)
    scene.position.sub(originalCenter);

    console.log("✅ Model moved to origin");
    console.log("🎯 New scene position:", scene.position);

    // Recalculate box after moving
    const centeredBox = new THREE.Box3().setFromObject(scene);
    const size = new THREE.Vector3();
    centeredBox.getSize(size);

    console.log("📏 Model size:", size);
    console.log("📦 Centered box min:", centeredBox.min);
    console.log("📦 Centered box max:", centeredBox.max);

    // **FIX: Use consistent framing based on what camera actually sees**
    // From angle -90deg (side view), camera sees X (width) and Y (height)
    // Calculate distance to fit BOTH dimensions in view
    const visibleWidth = size.x; // What camera sees horizontally
    const visibleHeight = size.y; // What camera sees vertically

    // Use diagonal for more consistent framing across different bike shapes
    const diagonal = Math.sqrt(size.x * size.x + size.y * size.y + size.z * size.z);
    const cameraDistance = diagonal * 1.5; // Lower multiplier since diagonal is larger

    console.log("📐 Visible dimensions from camera angle:", visibleWidth, visibleHeight);
    console.log("📐 Diagonal:", diagonal);
    console.log("📷 Camera distance:", cameraDistance);

    // Set camera target to origin
    viewer.cameraTarget = "0m 0m 0m";

    // Set camera orbit with calculated distance
    viewer.cameraOrbit = `-90deg 80deg ${cameraDistance}m`;

    // Wait for camera to settle
    await new Promise((resolve) => setTimeout(resolve, 100));

    const defaultCameraOrbit = {
      theta: -90,
      phi: 80,
      radius: cameraDistance,
    };

    console.log("💾 Default Camera Orbit:", defaultCameraOrbit);
    console.log("=== END INITIAL CALCULATION ===");

    return {
      originalBikeCenter: new THREE.Vector3(0, 0, 0),
      cachedBikeCenter: new THREE.Vector3(0, 0, 0),
      defaultCameraOrbit,
      modelSize: size,
    };
  } catch (error) {
    console.error("Error calculating bike center:", error);
    return null;
  }
}
