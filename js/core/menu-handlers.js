export function handleMenu(
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
) {
  document.querySelectorAll(".feature-item").forEach((el) => el.classList.remove("active"));
  if (element) element.classList.add("active");
  closeInfo();

  const data = vehicleData[category];
  if (!data) return;

  const subMenuBar = document.getElementById("subMenuBar");
  subMenuBar.innerHTML = "";

  if (data.type === "color") {
    data.items.forEach((color) => {
      const div = document.createElement("div");
      div.className = "sub-item";
      div.onclick = () => {
        const changeColorModule = import("../core/color-handler.js");
        changeColorModule.then((module) => module.changeColor(color.modelFile));
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

        if (item.meshName && item.meshName === activeMeshName) {
          div.classList.add("active");
        }

        const iconClass = ICON_MAP[item.id] || ICON_MAP["default"];

        div.onclick = () => {
          console.log(`🖱️ Clicked: "${item.label}"`);

          if (item.meshName && activeMeshName === item.meshName) {
            console.log(`⏪ Toggling OFF - Resetting camera`);
            resetCameraToDefault(viewer, cachedBikeCenter, defaultCameraOrbit);
            activeMeshName = null;
            closeInfo();
            handleMenu(
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
          } else {
            console.log(`⏩ Toggling ON - Focusing mesh`);
            showDetail(item.title, item.desc);
            if (item.meshName) {
              focusOnMesh(item, viewer, originalBikeCenter, THREE, cachedBikeCenter);
              activeMeshName = item.meshName;
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

  return activeMeshName;
}
