<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <title>Eco Sprint Viewer</title>

    <script type="module" src="https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js"></script>

    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body, html {
            height: 100%;
            overflow: hidden;
            background: #e8f6ff;
            font-family: Arial, sans-serif;
        }

        #model-wrapper {
            position: relative;
            width: 100%;
            height: 100vh;
            overflow: hidden;
            background: url('/storage/home/3dmodels/3dbackdrop/BACKDROP3D.png') no-repeat center center;
            background-size: cover;
        }

        model-viewer {
            width: 100%;
            height: calc(100% - 60px);
            margin-top: -40px;
            background: transparent;
            object-fit: cover;
            opacity: 0;
            transition: opacity 0.5s ease;
        }

        /* LOADER */
        #loader {
            position: absolute;
            inset: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            background: rgba(255,255,255,0.7);
            z-index: 50;
        }

        /* SHIMMER LOGO TEXT LOADER */
        .strike-loader {
            font-size: 40px;
            font-weight: 800;
            letter-spacing: 4px;
            font-family: Arial, sans-serif;
            color: #1e88e5;
            position: relative;
            overflow: hidden;
        }

        .strike-loader::before {
            content: "";
            position: absolute;
            top: 0;
            left: -150%;
            width: 150%;
            height: 100%;
            background: linear-gradient(
                120deg,
                transparent 0%,
                rgba(255,255,255,0.9) 50%,
                transparent 100%
            );
            transform: skewX(-20deg);
            animation: shine 2s infinite linear;
        }

        @keyframes shine {
            from { left: -150%; }
            to { left: 150%; }
        }

        /* FEATURE BAR */
        .feature-bar {
            position: absolute;
            bottom: 18px;
            left: 50%;
            transform: translateX(-50%);
            width: 80%;
            height: 70px;
            background: rgba(255,255,255,0.28);
            backdrop-filter: blur(0px);
            box-shadow: inset 0 0 0 2000px rgba(0, 51, 153, 0.18);
            border-radius: 40px;
            z-index: 20;
            display: flex;
            justify-content: space-around;
            align-items: center;
            border: 2px solid #003366;
        }

        .feature-item {
            font-size: 14px;
            cursor: pointer;
            color: #444;
            opacity: 0.7;
            padding: 10px 15px;
        }

        .feature-item.active {
            opacity: 1;
            font-weight: bold;
            color: #007bff;
            border-bottom: 2px solid #007bff;
        }

        /* COLOR BAR */
        .color-bar {
            position: absolute;
            bottom: 95px;
            left: 50%;
            transform: translateX(-50%);
            width: 70%;
            height: 65px;
            display: none;
            justify-content: space-around;
            align-items: center;
            background: rgba(255,255,255,0.28);
            border: 2px solid #003366;
            border-radius: 40px;
            z-index: 30;
        }

        .color-item {
            text-align: center;
            cursor: pointer;
        }

        .color-dot {
            width: 26px;
            height: 26px;
            border-radius: 50%;
            border: 2px solid white;
            margin: 0 auto 5px;
        }

        .color-name {
            font-size: 12px;
            color: #333;
        }
    </style>
</head>

<body>

<div id="model-wrapper">

    <!-- LOADER (UPDATED) -->
    <div id="loader">
        <div class="strike-loader">STRIKECO</div>
    </div>

    <!-- MODEL -->
    <model-viewer id="ecoModel"
        src="/storage/home/3dmodels/eco_sprint/Strikeco_blue.glb"
        camera-controls auto-rotate shadow-intensity="1">
    </model-viewer>

    <!-- COLOR BAR -->
    <div class="color-bar" id="colorBar">
        <div class="color-item" onclick="changeModel('grey')">
            <div class="color-dot" style="background:#8e8e8e;"></div>
            <div class="color-name">Grey</div>
        </div>

        <div class="color-item" onclick="changeModel('blue')">
            <div class="color-dot" style="background:#1e88e5;"></div>
            <div class="color-name">Blue</div>
        </div>

        <div class="color-item" onclick="changeModel('black')">
            <div class="color-dot" style="background:#000;"></div>
            <div class="color-name">Black</div>
        </div>

        <div class="color-item" onclick="changeModel('red')">
            <div class="color-dot" style="background:#d62828;"></div>
            <div class="color-name">Red</div>
        </div>
    </div>

    <!-- FEATURE BAR -->
    <div class="feature-bar">
        <div class="feature-item active" onclick="toggleColorBar()">Color</div>
        <div class="feature-item">Design</div>
        <div class="feature-item">Performance</div>
        <div class="feature-item">Connectivity</div>
        <div class="feature-item">Safety</div>
        <div class="feature-item">Comfort</div>
    </div>

</div>

<script>
    const viewer = document.getElementById("ecoModel");
    const loader = document.getElementById("loader");
    const colorBar = document.getElementById("colorBar");

    viewer.addEventListener("load", () => {
        loader.style.display = "none";
        viewer.style.opacity = "1";
    });

    function changeModel(color) {
        loader.style.display = "flex";
        viewer.style.opacity = "0";

        const files = {
            blue: "/storage/home/3dmodels/eco_sprint/Strikeco_blue.glb",
            black: "/storage/home/3dmodels/eco_sprint/Strikeco_scooter_Black.glb",
            grey: "/storage/home/3dmodels/eco_sprint/Strikeco_scooter_grey.glb",
            red: "/storage/home/3dmodels/eco_sprint/Strikeco_scooter_Red.glb"
        };

        viewer.src = files[color];
    }

    function toggleColorBar() {
        colorBar.style.display =
            (colorBar.style.display === "flex") ? "none" : "flex";
    }
</script>

</body>
</html>
