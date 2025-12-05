import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";
import { logAllMeshNames, setupScreenDragListener, analyzeColorableMeshes } from "./dev/debug-tools.js";
import { focusOnMesh } from "./core/focus-mesh.js";
import { resetCameraToDefault } from "./core/camera-reset.js";
import { calculateBikeCenter } from "./core/calculate-center.js";
import { handleMenu } from "./core/menu-handlers.js";

// Icon Mapping
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

// Variables & Initialization
let vehicleData = {};
let activeMeshName = null;
let originalBikeCenter = null;
let cachedBikeCenter = null;
let defaultCameraOrbit = null;
const viewer = document.getElementById("ecoModel");
const infoOverlay = document.getElementById("infoOverlay");
const infoTitle = document.getElementById("infoTitle");
const infoDesc = document.getElementById("infoDesc");
const loader = document.getElementById("loader");

window.logAllMeshNames = () => logAllMeshNames(viewer);
window.setupScreenDragListener = () => setupScreenDragListener(viewer);
window.analyzeColorableMeshes = () => analyzeColorableMeshes(viewer);
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

  viewer.addEventListener("load", async () => {
    const bikeData = await calculateBikeCenter(THREE, viewer);
    if (bikeData) {
      originalBikeCenter = bikeData.originalBikeCenter;
      cachedBikeCenter = bikeData.cachedBikeCenter;
      defaultCameraOrbit = bikeData.defaultCameraOrbit;
    }
  });
});

window.handleMenu = (category, element) => {
  activeMeshName = handleMenu(
    category,
    element,
    vehicleData,
    activeMeshName,
    viewer,
    cachedBikeCenter,
    defaultCameraOrbit,
    originalBikeCenter,
    THREE,
    ICON_MAP,
    resetCameraToDefault,
    focusOnMesh,
    showDetail,
    closeInfo
  );
};

function showDetail(title, description) {
  infoTitle.innerText = title;
  infoDesc.innerText = description;
  infoOverlay.classList.add("visible");
}

function closeInfo() {
  infoOverlay.classList.remove("visible");
}
