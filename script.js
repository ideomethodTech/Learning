// STEP 1: Import Three.js from CDN
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";

// STEP 2: Icon Mapping
const ICON_MAP = {
  headlamp: "fa-lightbulb",
  mirror: "fa-arrows-left-right",
  pillion: "fa-hands",
  display: "fa-tv",
  motor: "fa-cogs",
  battery: "fa-car-battery",
  range: "fa-road",
  bt_indicator: "fa-battery-half",
  bluetooth: "fa-bluetooth-b",
  default: "fa-circle-info",
};

// STEP 3: Variables & Initialization
let vehicleData = {};
let cachedBikeCenter = null;
let defaultCameraOrbit = null;
let activeMeshName = null;
const viewer = document.getElementById("ecoModel");
const subMenuBar = document.getElementById("subMenuBar");
const infoOverlay = document.getElementById("infoOverlay");
const infoTitle = document.getElementById("infoTitle");
const infoDesc = document.getElementById("infoDesc");
const loader = document.getElementById("loader");

let meshBBoxData = {};

// Update the window load event to load both files:
window.addEventListener("load", async () => {
  try {
    const response = await fetch("./data.json");
    if (!response.ok) throw new Error("Failed to load data");
    vehicleData = await response.json();
    console.log("Data loaded successfully.");

    // Load bbox data
    const bboxResponse = await fetch("./mesh_geometry_extract.json");
    if (!bboxResponse.ok) throw new Error("Failed to load bbox data");
    meshBBoxData = await bboxResponse.json();
    console.log("BBox data loaded:", meshBBoxData.length, "meshes");
  } catch (error) {
    console.error("Error loading JSON:", error);
  }

  setTimeout(() => {
    loader.style.opacity = "0";
    setTimeout(() => (loader.style.display = "none"), 500);
  }, 2500);

  viewer.addEventListener("load", calculateBikeCenter);
});

// STEP 4: Calculate Bike Center on Load
async function calculateBikeCenter() {
  await viewer.updateComplete;

  try {
    const modelViewerSymbols = Object.getOwnPropertySymbols(viewer);
    const sceneSymbol = modelViewerSymbols.find(
      (symbol) => symbol.description === "scene"
    );

    if (!sceneSymbol) return;

    const scene = viewer[sceneSymbol];
    const bikeBox = new THREE.Box3().setFromObject(scene);
    cachedBikeCenter = new THREE.Vector3();
    bikeBox.getCenter(cachedBikeCenter);

    // ✅ ADD THIS LOGGING:
    console.log("=== INITIAL BIKE CALCULATION ===");
    console.log("📦 Calculated Bike Center:", cachedBikeCenter);
    console.log("📷 Current Camera Target:", viewer.cameraTarget);
    console.log("📷 Current Camera Orbit:", viewer.getCameraOrbit());

    // Set camera to look at bike center
    viewer.cameraTarget = `${cachedBikeCenter.x}m ${cachedBikeCenter.y}m ${cachedBikeCenter.z}m`;

    console.log("🎯 Setting Camera Target to:", viewer.cameraTarget);

    // Store the default orbit
    const orbit = viewer.getCameraOrbit();
    defaultCameraOrbit = {
      theta: (orbit.theta * 180) / Math.PI,
      phi: (orbit.phi * 180) / Math.PI,
      radius: orbit.radius,
    };

    console.log("💾 Stored Default Orbit:", defaultCameraOrbit);
    console.log("=== END INITIAL CALCULATION ===");
  } catch (error) {
    console.error("Error calculating bike center:", error);
  }
}

// STEP 5: Expose Functions
window.handleMenu = handleMenu;
window.changeColor = changeColor;
window.showDetail = showDetail;
window.closeInfo = closeInfo;

// STEP 6: Logic Functions
function handleMenu(category, element) {
  document
    .querySelectorAll(".feature-item")
    .forEach((el) => el.classList.remove("active"));
  if (element) element.classList.add("active");
  closeInfo();

  const data = vehicleData[category];
  if (!data) return;

  subMenuBar.innerHTML = "";

  if (data.type === "color") {
    data.items.forEach((color) => {
      const div = document.createElement("div");
      div.className = "sub-item";
      div.onclick = () => changeColor(color.modelFile);
      div.innerHTML = `
                <div class="color-dot" style="background: ${color.hex};"></div>
                <span>${color.name}</span>
            `;
      subMenuBar.appendChild(div);
    });
  } else {
    if (!data.items || data.items.length === 0) {
      subMenuBar.innerHTML =
        "<div class='sub-item'><span>Coming Soon</span></div>";
    } else {
      data.items.forEach((item) => {
        const div = document.createElement("div");
        div.className = "sub-item";

        if (item.meshName && item.meshName === activeMeshName) {
          div.classList.add("active");
        }

        const iconClass = ICON_MAP[item.id] || ICON_MAP["default"];

        div.onclick = () => {
          console.log(`🖱️ Clicked: "${item.label}"`);

          if (item.meshName && activeMeshName === item.meshName) {
            console.log(`⏪ Toggling OFF - Resetting camera`);
            resetCameraToDefault();
            activeMeshName = null;
            closeInfo();
            handleMenu(category, element);
          } else {
            console.log(`⏩ Toggling ON - Focusing mesh`);
            showDetail(item.title, item.desc);
            if (item.meshName) {
              focusOnMesh(item.meshName);
              activeMeshName = item.meshName;
              handleMenu(category, element);
            }
          }
        };
        div.innerHTML = `
                    <i class="fas ${iconClass}"></i>
                    <span>${item.label}</span>
                `;
        subMenuBar.appendChild(div);
      });
    }
  }
  subMenuBar.classList.add("visible");
}

function changeColor(modelFileName) {
  console.log("Switching model to:", modelFileName);
}

function showDetail(title, description) {
  infoTitle.innerText = title;
  infoDesc.innerText = description;
  infoOverlay.classList.add("visible");
}

function closeInfo() {
  infoOverlay.classList.remove("visible");
}

// STEP 7: Reset Camera
function resetCameraToDefault() {
  if (!cachedBikeCenter || !defaultCameraOrbit) return;

  // ✅ TURN OFF LIGHT EFFECT
  const modelViewerSymbols = Object.getOwnPropertySymbols(viewer);
  const sceneSymbol = modelViewerSymbols.find(
    (symbol) => symbol.description === "scene"
  );

  if (sceneSymbol) {
    const scene = viewer[sceneSymbol];
    scene.traverse((child) => {
      if (child.isMesh && child.originalMaterial) {
        // Restore original material properties
        child.material.emissive = child.originalMaterial.emissive;
        child.material.emissiveIntensity =
          child.originalMaterial.emissiveIntensity;
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
}

// STEP 8: Focus on Mesh (ZOOM IN)
// async function focusOnMesh(meshName) {
//   console.log(`🎯 Focus requested: ${meshName}`);

//   await viewer.updateComplete;

//   try {
//     // Log CURRENT camera position BEFORE change
//     const currentOrbit = viewer.getCameraOrbit();
//     const currentTarget = viewer.cameraTarget;
//     console.log(`📷 BEFORE - Camera target: ${currentTarget}`);
//     console.log(`📷 BEFORE - Camera orbit:`, currentOrbit);

//     const modelViewerSymbols = Object.getOwnPropertySymbols(viewer);
//     const sceneSymbol = modelViewerSymbols.find(
//       (symbol) => symbol.description === "scene"
//     );

//     if (!sceneSymbol) return;

//     const scene = viewer[sceneSymbol];

//     // Find ALL front light meshes
//     const frontLightMeshes = [];
//     scene.traverse((child) => {
//       if (
//         child.isMesh &&
//         child.name &&
//         (child.name.includes("FntLit") ||
//           child.name.includes("HeadLit") ||
//           child.name.includes("headlamp"))
//       ) {
//         frontLightMeshes.push(child);
//       }
//     });

//     if (frontLightMeshes.length === 0) return;

//     // Calculate combined bounding box
//     const combinedBox = new THREE.Box3();
//     frontLightMeshes.forEach((mesh) => {
//       const meshBox = new THREE.Box3().setFromObject(mesh);
//       combinedBox.union(meshBox);
//     });

//     const center = new THREE.Vector3();
//     combinedBox.getCenter(center);

//     console.log(`📦 COMBINED center: (${center.x}, ${center.y}, ${center.z})`);

//     // ✅ ONLY force center for headlamp, let other elements use natural positions
//     let fixedCenter;
//     if (
//       meshName.includes("FntLit") ||
//       meshName.includes("HeadLit") ||
//       meshName.includes("headlamp")
//     ) {
//       // Headlamp: force X=0 to prevent left shift
//       fixedCenter = new THREE.Vector3(0, center.y, cachedBikeCenter.z);
//       console.log(`🎯 Applied headlamp fix: forced X=0`);
//     } else {
//       // Other elements: use their natural positions
//       fixedCenter = new THREE.Vector3(center.x, center.y, center.z);
//       console.log(`🎯 Using natural position for ${meshName}`);
//     }

//     viewer.cameraTarget = `${fixedCenter.x}m ${fixedCenter.y}m ${fixedCenter.z}m`;
//     // Smooth ZOOM IN
//     viewer.timeScale = 0.5;
//     viewer.cameraOrbit = `-90deg 75deg 0.3m`;

//     // Reset speed when camera stops moving
//     let cameraChangeTimeout;
//     function onCameraChange() {
//       clearTimeout(cameraChangeTimeout);
//       cameraChangeTimeout = setTimeout(() => {
//         // Camera hasn't moved for 200ms = animation finished
//         viewer.timeScale = 1.0;
//         viewer.removeEventListener("camera-change", onCameraChange);
//         console.log("✅ Zoom-in animation complete");
//       }, 200);
//     }

//     viewer.addEventListener("camera-change", onCameraChange);

//     // Add this debug to see what's REALLY happening:
//     console.log(`🔍 DEBUG: center = (${center.x}, ${center.y}, ${center.z})`);
//     console.log(
//       `🔍 DEBUG: fixedCenter = (${fixedCenter.x}, ${fixedCenter.y}, ${fixedCenter.z})`
//     );
//     console.log(`🔍 DEBUG: Setting cameraTarget to: ${viewer.cameraTarget}`);

//     viewer.cameraTarget = `${fixedCenter.x}m ${fixedCenter.y}m ${fixedCenter.z}m`;
//     // Smooth ZOOM IN
//     viewer.timeScale = 0.5;
//     viewer.cameraOrbit = `-90deg 75deg 0.3m`;

//     // Reset speed after animation
//     setTimeout(() => {
//       viewer.timeScale = 1.0;
//     }, 1000);

//     // Check what it actually got set to
//     setTimeout(() => {
//       console.log(`🔍 DEBUG: Actual cameraTarget: ${viewer.cameraTarget}`);
//     }, 100);

//     // Add mouse wheel listener to see what changes
//     viewer.addEventListener("camera-change", () => {
//       const orbit = viewer.getCameraOrbit();
//       const target = viewer.cameraTarget;
//       console.log("🖱️ MOUSE WHEEL - Camera orbit:", orbit);
//       console.log("🖱️ MOUSE WHEEL - Camera target:", target);
//     });
//   } catch (error) {
//     console.error("❌ Error focusing:", error);
//   }
// }

async function focusOnMesh(meshName) {
  console.log(`🎯 Focus requested: ${meshName}`);

  await viewer.updateComplete;

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
      if (child.isMesh && child.name && child.name === meshName) {
        targetMeshes.push(child);
        console.log(`🔍 Found mesh: ${child.name}`);
      }
    });

    if (targetMeshes.length === 0) {
      console.warn(`⚠️ No meshes found: ${meshName}`);
      return;
    }

    // Calculate bounding box
    const combinedBox = new THREE.Box3();
    targetMeshes.forEach((mesh) => {
      const meshBox = new THREE.Box3().setFromObject(mesh);
      combinedBox.union(meshBox);
    });

    const center = new THREE.Vector3();
    combinedBox.getCenter(center);

    console.log(`📦 ${meshName} center: (${center.x}, ${center.y}, ${center.z})`);

    // ✅ FIX FOR ALL ELEMENTS: Keep X at 0 to prevent left/right movement
    const fixedCenter = new THREE.Vector3(0, center.y, cachedBikeCenter.z);
    console.log(`🎯 Fixed center: (${fixedCenter.x}, ${fixedCenter.y}, ${fixedCenter.z})`);

    // Smooth zoom - SIMPLE AND WORKING
    viewer.timeScale = 0.5;
    viewer.cameraTarget = `${fixedCenter.x}m ${fixedCenter.y}m ${fixedCenter.z}m`;
    // In your focusOnMesh function, replace the cameraOrbit line with:
let cameraOrbit;

if (meshName.includes("screen") || meshName.includes("display")) {
    // PERFECT SCREEN VIEW from your manual adjustment
    cameraOrbit = "-258deg 68deg 0.28m";
    console.log("🎥 Using perfect screen camera angle");
} else {
    // Default view for other elements
    cameraOrbit = "-90deg 75deg 0.3m";
}

viewer.cameraOrbit = cameraOrbit;

    // Reset speed when camera stops moving
    let cameraChangeTimeout;
    function onCameraChange() {
      clearTimeout(cameraChangeTimeout);
      cameraChangeTimeout = setTimeout(() => {
        viewer.timeScale = 1.0;
        viewer.removeEventListener("camera-change", onCameraChange);
        console.log("✅ Zoom complete");
      }, 200);
    }

    viewer.addEventListener("camera-change", onCameraChange);

  } catch (error) {
    console.error("❌ Error focusing:", error);
  }
}
async function logAllMeshNames() {
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
  console.log("============================================");
}

// Run this in console
window.logAllMeshNames = logAllMeshNames;
console.log("logAllMeshNames()");

// Calculate smart camera position based on mesh bounds and position
function calculateSmartCamera(bbox, meshName) {
  const center = new THREE.Vector3();
  bbox.getCenter(center);

  const size = new THREE.Vector3();
  bbox.getSize(size);

  console.log(`📊 ${meshName} analysis:`);
  console.log(
    `   Center: (${center.x.toFixed(3)}, ${center.y.toFixed(
      3
    )}, ${center.z.toFixed(3)})`
  );
  console.log(
    `   Size: (${size.x.toFixed(3)}, ${size.y.toFixed(3)}, ${size.z.toFixed(
      3
    )})`
  );

  // Determine optimal viewing angle based on mesh characteristics
  let theta, phi, radius;

  // Calculate based on mesh orientation and size
  if (size.z > size.x && size.z > size.y) {
    // Deep mesh (like screen) - view from front
    theta = -90; // Front view
    phi = 60; // Slightly above
    radius = Math.max(size.x, size.y) * 3; // Dynamic distance based on size
  } else if (size.y > size.x) {
    // Tall mesh - view from slightly above
    theta = -90;
    phi = 45;
    radius = Math.max(size.x, size.z) * 3;
  } else {
    // Wide mesh - standard view
    theta = -90;
    phi = 75;
    radius = Math.max(size.y, size.z) * 3;
  }

  // Special cases for known elements
  if (meshName.includes("screen") || meshName.includes("display")) {
    // Screens are best viewed from slightly above to read them
    theta = -90;
    phi = 40;
    radius = Math.max(size.x, size.y) * 4;
  }

  if (meshName.includes("Mirror")) {
    // Mirrors on sides need angled view
    theta = center.x > 0 ? -45 : -135; // Left or right side view
    phi = 70;
    radius = size.x * 4;
  }

  console.log(`🎥 Smart camera: ${theta}deg ${phi}deg ${radius.toFixed(2)}m`);

  return `${theta}deg ${phi}deg ${radius.toFixed(2)}m`;
}

// ADD DRAG LISTENER TO FIND PERFECT SCREEN VIEW
function setupScreenDragListener() {
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

// Run this in console after page loads
window.setupScreenDragListener = setupScreenDragListener;
