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

// Update the window load event to load both files:
window.addEventListener("load", async () => {
  try {
    const response = await fetch("./data.json");
    if (!response.ok) throw new Error("Failed to load data");
    vehicleData = await response.json();
    console.log("Data loaded successfully.");
  } catch (error) {
    console.error("Error loading JSON:", error);
  }

  setTimeout(() => {
    loader.style.opacity = "0";
    setTimeout(() => (loader.style.display = "none"), 500);
  }, 2500);

  viewer.addEventListener("load", calculateBikeCenter);
});

let originalBikeCenter = null;

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

    // STORE ORIGINAL CENTER ONLY ONCE
    if (!originalBikeCenter) {
      originalBikeCenter = new THREE.Vector3();
      bikeBox.getCenter(originalBikeCenter);
      cachedBikeCenter = originalBikeCenter.clone(); // Keep a copy
    }

    console.log("=== INITIAL BIKE CALCULATION ===");
    console.log("📦 Original Bike Center:", originalBikeCenter);

    // ALWAYS use the original center, never recalculate
    viewer.cameraTarget = `${originalBikeCenter.x}m ${originalBikeCenter.y}m ${originalBikeCenter.z}m`;

    // Store default orbit
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

async function focusOnMesh(meshName) {
  try {
    await viewer.updateComplete;

    // RESET TO ORIGINAL POSITION FIRST
    viewer.cameraTarget = `${originalBikeCenter.x}m ${originalBikeCenter.y}m ${originalBikeCenter.z}m`;

    // Wait for reset to complete
    await new Promise((resolve) => setTimeout(resolve, 100)).catch((e) =>
      console.error("Reset timeout error:", e)
    );
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

    console.log(
      `📦 ${meshName} center: (${center.x}, ${center.y}, ${center.z})`
    );

    // ✅ FIX FOR ALL ELEMENTS: Keep X at 0 to prevent left/right movement
    const fixedCenter = new THREE.Vector3(0, center.y, cachedBikeCenter.z);
    console.log(
      `🎯 Fixed center: (${fixedCenter.x}, ${fixedCenter.y}, ${fixedCenter.z})`
    );

    viewer.timeScale = 0.5;
    viewer.cameraTarget = `${fixedCenter.x}m ${fixedCenter.y}m ${fixedCenter.z}m`;
    let cameraOrbit;

    if (meshName.includes("screen") || meshName.includes("display")) {
      cameraOrbit = "-258deg 68deg 0.28m";
      console.log("🎥 Using perfect screen camera angle");
    } else if (meshName.includes("mirror") || meshName.includes("Mirror")) {
      cameraOrbit = "-245.4deg 60.4deg 0.415m";
      console.log("🎥 Using perfect mirror camera angle");
    } else {
      cameraOrbit = "-90deg 75deg 0.3m";
    }

    viewer.cameraOrbit = cameraOrbit;

    setTimeout(() => {
      const actualOrbit = viewer.getCameraOrbit();
      console.log("🔍 ACTUAL ORBIT APPLIED:", actualOrbit);
      console.log("🎯 ORBIT I SET:", cameraOrbit);
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

window.logAllMeshNames = logAllMeshNames;
window.setupScreenDragListener = setupScreenDragListener;
