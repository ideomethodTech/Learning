export function handleMenu(
  category,
  element,
  vehicleData,
  activeItemId,
  viewer,
  cachedBikeCenter,
  defaultCameraOrbit,
  originalBikeCenter,
  THREE,
  ICON_MAP,
  resetCameraToDefault,
  focusOnMesh,
  showDetail,
  closeInfo,
  bikeData
) {
  const subMenuBar = document.getElementById("subMenuBar");
  const currentlyActive = document.querySelector(".feature-item.active ");
  document.querySelectorAll(".feature-item").forEach((el) => el.classList.remove("active"));
  if (element) element.classList.add("active");

  // Only close if clicking the SAME active category
  if (element && element === currentlyActive && subMenuBar.classList.contains("visible")) {
    element.classList.remove("active");
    subMenuBar.classList.remove("visible");
    closeInfo();
    resetCameraToDefault(viewer, cachedBikeCenter, defaultCameraOrbit);
    activeItemId = null;
    return null;
  }

  closeInfo();

  const data = vehicleData[category];
  if (!data) return;

  subMenuBar.innerHTML = "";

  if (data.type === "color") {
    const meshName = data.meshName || "BackPanel_metalShape";

    data.items.forEach((color) => {
      const div = document.createElement("div");
      div.className = "sub-item";
      div.onclick = () => {
        const changeColorModule = import("../core/color-handler.js");
        changeColorModule.then((module) => module.changeColor(color.hex, meshName, viewer));
      };
      div.innerHTML = `
      <div class="color-dot" style="background: ${color.hex};"></div>
      <span>${color.name}</span>
    `;
      subMenuBar.appendChild(div);
    });
  } else {
    if (!data.items || data.items.length === 0) {
      subMenuBar.innerHTML = "<div class='sub-item'><span>Coming Soon</span></div>";
    } else {
      data.items.forEach((item) => {
        const div = document.createElement("div");
        div.className = "sub-item";

        // Changed: Check by item.id instead of meshName
        if (item.id === activeItemId) {
          div.classList.add("active");
        }

        const iconClass = ICON_MAP[item.id] || ICON_MAP["default"];

        div.onclick = () => {
          console.log(`🖱️ Clicked: "${item.label}" (ID: ${item.id})`);

          // Changed: Compare by item.id
          if (item.id === activeItemId) {
            console.log(`⏪ Toggling OFF - Resetting camera`);
            resetCameraToDefault(viewer, cachedBikeCenter, defaultCameraOrbit);
            activeItemId = null;
            closeInfo();
            handleMenu(
              category,
              element,
              vehicleData,
              activeItemId,
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
          } else {
            console.log(`⏩ Toggling ON - Focusing mesh`);
            const modelSrc = viewer.src;
            const description =
              item.id === "battery" && modelSrc.includes("electrn.glb") ? item.descElectrn : item.desc;
            showDetail(item.title, description);
            if (item.meshName) {
              focusOnMesh(item, viewer, originalBikeCenter, THREE, cachedBikeCenter, bikeData.modelOrientation);
              activeItemId = item.id; // Store the item ID, not meshName
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

  return activeItemId; // Return the item ID
}
