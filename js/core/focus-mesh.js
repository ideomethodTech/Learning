import { openStorage, getStorageState, closeStorage } from "./storage-animation.js";

let lastFocusedItem = null;

export async function focusOnMesh(
  item,
  viewer,
  originalBikeCenter,
  THREE,
  cachedBikeCenter,
  modelOrientation,
  modelSrc
) {
  console.log("🎯 Focus called for:", item.label, "| meshName:", item.meshName);
  console.log("📌 Last focused item:", lastFocusedItem);

  try {
    await viewer.updateComplete;

    const isSameMesh = lastFocusedItem && lastFocusedItem.meshName === item.meshName;

    console.log("🔍 Is same mesh?", isSameMesh);

    //  Open storage when focusing on storage compartment
    // if (item.id === "storage" && !modelSrc.includes("electrn.glb")) {
    //   console.log("📦 Opening storage compartment...");
    //   try {
    //     openStorage(viewer, THREE, modelOrientation);
    //   } catch (error) {
    //     console.error("❌ Failed to open storage:", error);
    //   }
    // }

    // Close storage if open when switching to different mesh
    // if (getStorageState() && item.meshName !== "SeatShape") {
    //   await closeStorage(viewer, THREE, modelOrientation);
    // }

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
    const sceneSymbol = modelViewerSymbols.find((symbol) => symbol.description === "scene");

    if (!sceneSymbol) return;
    const scene = viewer[sceneSymbol];

    let targetMeshes = [];
    scene.traverse((child) => {
      const meshNameList = Array.isArray(item.meshName) ? item.meshName : [item.meshName];
      const chosenMeshName = meshNameList.find((name) => scene.getObjectByName(name)) || meshNameList[0];
      item.meshName = chosenMeshName;

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

    console.log(`📦 ${item.meshName} center: (${center.x}, ${center.y}, ${center.z})`);

    // Calculate scale factor based on model size

    let scaleFactor = 1;
    if (sceneSymbol) {
      const scene = viewer[sceneSymbol];
      const box = new THREE.Box3().setFromObject(scene);
      const size = new THREE.Vector3();
      box.getSize(size);
      const diagonal = Math.sqrt(size.x * size.x + size.y * size.y + size.z * size.z);
      const referenceSize = 0.24; // Old model diagonal size
      scaleFactor = diagonal / referenceSize;
    }

    // Normalize Y coordinate for larger models
    let normalizedY = center.y;
    if (scaleFactor > 1.5) {
      normalizedY = (center.y / scaleFactor) * 0.7; // Bring Y down proportionally
    }

    let fixedCenter = new THREE.Vector3(0, normalizedY, cachedBikeCenter.z);

    // Check if this is the problematic model
    const isProblemModel = modelSrc.includes("verv.glb");

    if (item.meshName.includes("screen") || item.meshName.includes("display") || item.meshName.includes("usb")) {
      fixedCenter.y = center.y + 0.05;
      if (isProblemModel) {
        fixedCenter.y = center.y + 0.4;
      }
    }

    if (item.label.includes("Disc Brake")) {
      fixedCenter.y = center.y - 0.02;
      fixedCenter.x = center.x - 0.05;
    }

    if (item.label.includes("Tubeless Tires")) {
      fixedCenter.y = center.y - 0.03;
      fixedCenter.x = center.x + 0.02;
      if (isProblemModel) {
        fixedCenter.y = center.y - 0.5;
      }
    }

    if (item.label.includes("Side Stand Alert")) {
      fixedCenter.y = center.y - 0.03;
      if (isProblemModel) {
        fixedCenter.y = center.y - 0.5;
      }
    }

    if (item.meshName.includes("buttonShape")) {
      fixedCenter.y = center.y + 0.001;
      fixedCenter.x = center.x - 0.06;
    }

    if (item.label.includes("Wheels")) {
      fixedCenter.x = center.x - 0.01;

      if (isProblemModel) {
        fixedCenter.y = center.y + 0.4;
      }
    }

    viewer.timeScale = 0.5;
    viewer.cameraTarget = `${fixedCenter.x}m ${fixedCenter.y}m ${fixedCenter.z}m`;

    // **Adjust camera orbit based on model orientation AND scale**
    let adjustedOrbit = item.cameraOrbit;

    if (item.cameraOrbit) {
      const orbitMatch = item.cameraOrbit.match(/([-\d.]+)deg\s+([-\d.]+)deg\s+([-\d.]+)m/);
      if (orbitMatch) {
        let theta = parseFloat(orbitMatch[1]);
        const phi = orbitMatch[2];
        let radius = parseFloat(orbitMatch[3]);

        // Rotate theta by 90 degrees for Z-axis models
        if (modelOrientation === "Z-axis") {
          theta = theta + 90;
        }

        // **Scale radius based on model size (compare to reference size ~0.24m)**
        const modelViewerSymbols = Object.getOwnPropertySymbols(viewer);
        const sceneSymbol = modelViewerSymbols.find((symbol) => symbol.description === "scene");
        if (sceneSymbol) {
          const scene = viewer[sceneSymbol];
          const box = new THREE.Box3().setFromObject(scene);
          const size = new THREE.Vector3();
          box.getSize(size);
          const diagonal = Math.sqrt(size.x * size.x + size.y * size.y + size.z * size.z);

          const referenceSize = 0.24; // Old model diagonal size
          const scaleFactor = diagonal / referenceSize;

          // Scale radius proportionally
          radius = radius * scaleFactor;
        }

        adjustedOrbit = `${theta}deg ${phi}deg ${radius}m`;
      }
    }

    if (adjustedOrbit) viewer.cameraOrbit = adjustedOrbit;
    if (item.fieldOfView) viewer.fieldOfView = item.fieldOfView;

    setTimeout(() => {
      const actualOrbit = viewer.getCameraOrbit();
      console.log("🔍 ACTUAL ORBIT APPLIED:", actualOrbit);
      console.log("🎯 ORBIT I SET:", adjustedOrbit);
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
