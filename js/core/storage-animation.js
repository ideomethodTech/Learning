let isStorageOpen = false;
let originalState = null;

function getSceneFromViewer(viewer) {
  const modelViewerSymbols = Object.getOwnPropertySymbols(viewer);
  const sceneSymbol = modelViewerSymbols.find((symbol) => symbol.description === "scene");
  return sceneSymbol ? viewer[sceneSymbol] : null;
}

export async function toggleStorage(viewer, THREE) {
  if (isStorageOpen) {
    await closeStorage(viewer, THREE);
  } else {
    await openStorage(viewer, THREE);
  }
}

export function getStorageState() {
  return isStorageOpen;
}

export async function openStorage(viewer, THREE) {
  console.log("📦 Opening storage compartment...");

  if (!viewer) {
    console.error("❌ Viewer not found!");
    return;
  }

  await viewer.updateComplete;

  const scene = getSceneFromViewer(viewer);
  if (!scene) return;

  let storageMesh = null;
  scene.traverse((child) => {
    if (child.isMesh && child.name === "SeatShape" || child.name === "polySurface3051002") {
      storageMesh = child;
    }
  });

  if (!storageMesh) {
    console.warn("⚠️ SeatShape not found!");
    return;
  }

  console.log("📍 Original position:", storageMesh.position);
  console.log("📍 Original rotation:", storageMesh.rotation);

  // Store original state BEFORE any modifications
  if (!originalState) {
    originalState = {
      position: storageMesh.position.clone(),
      rotation: storageMesh.rotation.clone(),
    };
    console.log("💾 Saved original state:", originalState);
  }

  // === FIX: DON'T TRANSLATE GEOMETRY, just rotate around Y axis ===
  // Seat opens backward/upward - rotate around Y or Z axis at the hinge point

  // Get bounding box to find hinge
  const box = new THREE.Box3().setFromObject(storageMesh);

  // Hinge is at the BACK of the seat (min X or max Z depending on orientation)
  // From your logs, the seat rotated around Z axis before

  const targetRotation = Math.PI / 3; // 60 degrees
  const duration = 1000;
  const startRotation = storageMesh.rotation.z; // Keep Z rotation (was working)
  const startTime = Date.now();

  function animate() {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);

    // Keep Z rotation (was working before)
    storageMesh.rotation.z = startRotation + (targetRotation - startRotation) * eased;

    // ADD slight Y movement to keep hinge point fixed
    // Calculate how much to adjust Y position based on rotation
    const seatHeight = box.max.y - box.min.y;
    const liftAmount = Math.sin(storageMesh.rotation.z) * (seatHeight * 0.3);
    storageMesh.position.y = originalState.position.y + liftAmount;

    storageMesh.updateMatrixWorld(true);

    if (viewer.requestRender) viewer.requestRender();

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      isStorageOpen = true;
      console.log(
        "✅ Storage opened! Rotation Z:",
        storageMesh.rotation.z,
        "radians =",
        (storageMesh.rotation.z * 180) / Math.PI,
        "degrees"
      );
      console.log("📍 New position Y:", storageMesh.position.y);
    }
  }

  animate();
}

export async function closeStorage(viewer) {
  console.log("📦 Closing storage compartment...");

  await viewer.updateComplete;

  const scene = getSceneFromViewer(viewer);
  if (!scene) return;

  let storageMesh = null;
  scene.traverse((child) => {
    if (child.isMesh && child.name === "SeatShape" || child.name === "polySurface3051002") {
      storageMesh = child;
    }
  });

  if (!storageMesh || !originalState) {
    console.warn("⚠️ Cannot close: mesh or original state not found");
    return;
  }

  console.log("🔙 Restoring to original state:", originalState);

  const targetRotation = originalState.rotation.z;
  const targetPositionY = originalState.position.y;
  const duration = 800;
  const startRotation = storageMesh.rotation.z;
  const startPositionY = storageMesh.position.y;
  const startTime = Date.now();

  function animate() {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);

    storageMesh.rotation.z = startRotation + (targetRotation - startRotation) * eased;
    storageMesh.position.y = startPositionY + (targetPositionY - startPositionY) * eased;
    storageMesh.updateMatrixWorld(true);

    if (viewer.requestRender) viewer.requestRender();

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      // Ensure exact restoration
      storageMesh.rotation.copy(originalState.rotation);
      storageMesh.position.copy(originalState.position);
      storageMesh.updateMatrixWorld(true);

      isStorageOpen = false;
      console.log("✅ Storage closed!");
    }
  }

  animate();
}
