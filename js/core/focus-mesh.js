let lastFocusedItem = null;

export async function focusOnMesh(
  item,
  viewer,
  originalBikeCenter,
  THREE,
  cachedBikeCenter
) {
  console.log("🎯 Focus called for:", item.label, "| meshName:", item.meshName);
  console.log("📌 Last focused item:", lastFocusedItem);

  try {
    await viewer.updateComplete;

    const isSameMesh = lastFocusedItem && lastFocusedItem.meshName === item.meshName;
    
    console.log("🔍 Is same mesh?", isSameMesh);

    if (!isSameMesh) {
      // Different mesh - do the full reset animation
      console.log("🔄 Switching to different mesh, resetting camera...");
      viewer.cameraTarget = `${originalBikeCenter.x}m ${originalBikeCenter.y}m ${originalBikeCenter.z}m`;
      viewer.fieldOfView = "auto";
      await new Promise((resolve) => setTimeout(resolve, 150));
    } else {
      // Same mesh - NO reset, just update FOV if different
      console.log("⚡ Same mesh detected - minimal adjustment only");
      
      // Only update FOV if it's actually different
      if (item.fieldOfView && item.fieldOfView !== lastFocusedItem.fieldOfView) {
        console.log(`🔍 Adjusting FOV: ${lastFocusedItem.fieldOfView} → ${item.fieldOfView}`);
        viewer.fieldOfView = item.fieldOfView;
      } else {
        console.log("✅ Already at correct position - no changes needed");
      }
      
      // Update the last focused item and return early - no camera movement!
      lastFocusedItem = item;
      return;
    }

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

    let targetMeshes = [];
    scene.traverse((child) => {
      if (child.isMesh && child.name && child.name === item.meshName) {
        targetMeshes.push(child);
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

    let fixedCenter = new THREE.Vector3(0, center.y, cachedBikeCenter.z);

    if (item.meshName.includes("screen") || item.meshName.includes("display") || item.meshName.includes("usb")) {
      fixedCenter.y = center.y + 0.05;
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

    lastFocusedItem = item;
    console.log("💾 Updated lastFocusedItem to:", item.label);

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

export function resetLastFocusedItem() {
  lastFocusedItem = null;
  console.log("🔄 Reset last focused item");
}

