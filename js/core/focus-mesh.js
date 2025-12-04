export async function focusOnMesh(
  item,
  viewer,
  originalBikeCenter,
  THREE,
  cachedBikeCenter
) {
  try {
    await viewer.updateComplete;

    // RESET TO ORIGINAL POSITION FIRST
    viewer.cameraTarget = `${originalBikeCenter.x}m ${originalBikeCenter.y}m ${originalBikeCenter.z}m`;
    viewer.fieldOfView = "auto";
    //  Wait for animation to complete before allowing next click
    await new Promise((resolve) => setTimeout(resolve, 150));
  } catch (error) {
    console.error("❌ Error in focusOnMesh:", error);
  }

  try {
    const modelViewerSymbols = Object.getOwnPropertySymbols(viewer);
    const sceneSymbol = modelViewerSymbols.find(
      (symbol) => symbol.description === "scene"
    );

    if (!sceneSymbol) return;
    const scene = viewer[sceneSymbol];

    // Find the SPECIFIC mesh
    let targetMeshes = [];
    scene.traverse((child) => {
      if (child.isMesh && child.name && child.name === item.meshName) {
        targetMeshes.push(child);
        console.log(`🔍 Found mesh: ${child.name}`);
        console.log(
          `📍 ${item.meshName} World Position:`,
          child.getWorldPosition(new THREE.Vector3())
        );
        console.log(`📍 ${item.meshName} Local Position:`, child.position);
      }
    });

    if (targetMeshes.length === 0) {
      console.warn(`⚠️ No meshes found: ${item.meshName}`);
      return;
    }

    const worldPosition = new THREE.Vector3();
    targetMeshes[0].getWorldPosition(worldPosition);
    const center = worldPosition;

    console.log(
      `📦 ${item.meshName} center: (${center.x}, ${center.y}, ${center.z})`
    );
    // Check if the BIKE ITSELF is moving
    const bikeRoot = scene.children[0]; // First child is usually the model
    console.log("🚲 Bike root position:", bikeRoot.position);
    console.log(
      "🚲 Bike root world position:",
      bikeRoot.getWorldPosition(new THREE.Vector3())
    );

    // ✅ FIX FOR ALL ELEMENTS: Keep X at 0 to prevent left/right movement
    let fixedCenter = new THREE.Vector3(0, center.y, cachedBikeCenter.z);

    // 🎯 SPECIAL FIX FOR SCREEN: Move target UP to avoid collision
    if (item.meshName.includes("screen") || item.meshName.includes("display")) {
      fixedCenter.y = center.y + 0.05; // Push 2cm upward instead of forward
      console.log(fixedCenter.y, "fixedcentery+0.05");
    }

    viewer.timeScale = 0.5;
    viewer.cameraTarget = `${fixedCenter.x}m ${fixedCenter.y}m ${fixedCenter.z}m`;

    if (item.cameraOrbit) viewer.cameraOrbit = item.cameraOrbit;
    if (item.fieldOfView) viewer.fieldOfView = item.fieldOfView;

    setTimeout(() => {
      const actualOrbit = viewer.getCameraOrbit();
      console.log("🔍 ACTUAL ORBIT APPLIED:", actualOrbit);
      console.log("🎯 ORBIT I SET:", item.cameraOrbit);
    }, 100);

    // Reset speed when camera stops moving
    let cameraChangeTimeout;
    function onCameraChange() {
      clearTimeout(cameraChangeTimeout);
      cameraChangeTimeout = setTimeout(() => {
        viewer.timeScale = 1.0;
        viewer.removeEventListener("camera-change", onCameraChange);
        console.log("✅ Zoom complete");
      }, 1000);
    }

    viewer.addEventListener("camera-change", onCameraChange);
  } catch (error) {
    console.error("❌ Error focusing:", error);
  }
}
