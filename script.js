// --- 1. ICON MAPPING (Logic is here, Data is in JSON) ---
const ICON_MAP = {
    // Design
    "headlamp": "fa-lightbulb",
    "mirror": "fa-arrows-left-right",
    "pillion": "fa-hands",
    "display": "fa-tv",
    
    // Performance
    "motor": "fa-cogs",
    "battery": "fa-car-battery",
    "range": "fa-road",
    
    // SmartXonnect
    "bt_indicator": "fa-battery-half",
    "bluetooth": "fa-bluetooth-b",

    // Default fallback
    "default": "fa-circle-info"
};

// --- 2. VARIABLES & INITIALIZATION ---
let vehicleData = {};
const viewer = document.getElementById("ecoModel");
const subMenuBar = document.getElementById("subMenuBar");
const infoOverlay = document.getElementById("infoOverlay");
const infoTitle = document.getElementById("infoTitle");
const infoDesc = document.getElementById("infoDesc");
const loader = document.getElementById("loader");

window.addEventListener('load', async () => {
    // Fetch JSON
    try {
        const response = await fetch('./data.json');
        if (!response.ok) throw new Error("Failed to load data");
        vehicleData = await response.json();
        console.log("Data loaded successfully.");
    } catch (error) {
        console.error("Error loading JSON:", error);
    }

    // Hide Loader
    setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => loader.style.display = 'none', 500);
    }, 2500);
});

// --- 3. EXPOSE FUNCTIONS ---
window.handleMenu = handleMenu;
window.changeColor = changeColor;
window.showDetail = showDetail;
window.closeInfo = closeInfo;

// --- 4. LOGIC FUNCTIONS ---

function handleMenu(category, element) {
    // UI Updates
    document.querySelectorAll('.feature-item').forEach(el => el.classList.remove('active'));
    if(element) element.classList.add('active');
    closeInfo();

    // Get Data
    const data = vehicleData[category];
    if (!data) return;

    // Build Sub Menu
    subMenuBar.innerHTML = ""; 

    if (data.type === 'color') {
        data.items.forEach(color => {
            const div = document.createElement('div');
            div.className = 'sub-item';
            div.onclick = () => changeColor(color.modelFile);
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
            data.items.forEach(item => {
                const div = document.createElement('div');
                div.className = 'sub-item';
                
                // MAPPING LOGIC: Look up the icon using the ID from JSON
                const iconClass = ICON_MAP[item.id] || ICON_MAP['default'];

                div.onclick = () => showDetail(item.title, item.desc);
                div.innerHTML = `
                    <i class="fas ${iconClass}"></i>
                    <span>${item.label}</span>
                `;
                subMenuBar.appendChild(div);
            });
        }
    }
    subMenuBar.classList.add('visible');
}

function changeColor(modelFileName) {
    console.log("Switching model to:", modelFileName);
    // viewer.src = modelFileName; // Enable when GLB files exist
}

function showDetail(title, description) {
    infoTitle.innerText = title;
    infoDesc.innerText = description;
    infoOverlay.classList.add('visible');
}

function closeInfo() {
    infoOverlay.classList.remove('visible');
}