import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

/**
 * 3D Scooter Model Viewer - 360° Experience
 * Interactive scooter model viewer built with Three.js
 */

// Scene Setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x5a7a8a); // Clean blue-grey like the reference

// Camera Setup (Perspective camera for 3D depth)
const camera = new THREE.PerspectiveCamera(
  75, // Field of view
  window.innerWidth / window.innerHeight, // Aspect ratio
  0.1, // Near clipping plane
  1000 // Far clipping plane
);
camera.position.set(2, 1.5, 5);

// Renderer Setup
const canvas = document.querySelector('#canvas');
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  alpha: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// Orbit Controls for mouse interaction
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true; // Smooth camera movements
controls.dampingFactor = 0.05;
controls.minDistance = 2;
controls.maxDistance = 10;

// Lighting Setup
const setupLighting = () => {
  // Stronger ambient light for even illumination
  const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
  scene.add(ambientLight);

  // Main directional light (like the sun)
  const mainLight = new THREE.DirectionalLight(0xffffff, 0.8);
  mainLight.position.set(5, 5, 5);
  mainLight.castShadow = true;
  mainLight.shadow.mapSize.width = 2048;
  mainLight.shadow.mapSize.height = 2048;
  scene.add(mainLight);

  // Subtle fill light from the other side
  const fillLight = new THREE.DirectionalLight(0xffffff, 0.4);
  fillLight.position.set(-5, 3, -5);
  scene.add(fillLight);

  // Very subtle accent lights (less intense)
  const accentLight1 = new THREE.PointLight(0x8b5cf6, 0.3, 10);
  accentLight1.position.set(-3, 2, 2);
  scene.add(accentLight1);

  const accentLight2 = new THREE.PointLight(0x06b6d4, 0.2, 10);
  accentLight2.position.set(3, 2, -2);
  scene.add(accentLight2);

  // Hemisphere light for natural look
  const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.6);
  scene.add(hemiLight);
};

setupLighting();

// Ground/Floor
const createGround = () => {
  const groundGeometry = new THREE.PlaneGeometry(20, 20);
  const groundMaterial = new THREE.MeshStandardMaterial({
    color: 0x1a1a2e,
    roughness: 0.8,
    metalness: 0.2
  });
  const ground = new THREE.Mesh(groundGeometry, groundMaterial);
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -1;
  ground.receiveShadow = true;
  ground.visible = false; // Hide for clean look
  scene.add(ground);

  // Add grid helper for reference
  const gridHelper = new THREE.GridHelper(20, 20, 0x8b5cf6, 0x2a2a3e);
  gridHelper.position.y = -0.99;
  gridHelper.visible = false; // Hide for clean look
  scene.add(gridHelper);
};

createGround();

// Create a detailed Scooter model (inspired by TVS iQube)
const createPlaceholderScooter = () => {
  const scooterGroup = new THREE.Group();

  // Material definitions
  const bodyMaterial = new THREE.MeshStandardMaterial({
    color: 0xa98081, // Copper bronze color (TVS iQube style)
    roughness: 0.3,
    metalness: 0.6
  });

  const blackPlasticMaterial = new THREE.MeshStandardMaterial({
    color: 0x1a1a1a,
    roughness: 0.6,
    metalness: 0.2
  });

  const chromeMaterial = new THREE.MeshStandardMaterial({
    color: 0xcccccc,
    roughness: 0.1,
    metalness: 0.9
  });

  const tireMaterial = new THREE.MeshStandardMaterial({
    color: 0x0a0a0a,
    roughness: 0.9,
    metalness: 0.1
  });

  // === WHEELS ===
  // Front wheel
  const wheelRadius = 0.28;
  const tireThickness = 0.1;

  // Front tire
  const frontTire = new THREE.Mesh(
    new THREE.TorusGeometry(wheelRadius, tireThickness, 20, 32),
    tireMaterial
  );
  frontTire.rotation.y = Math.PI / 2;
  frontTire.position.set(0.85, -0.5, 0);
  frontTire.castShadow = true;
  scooterGroup.add(frontTire);

  // Front wheel rim
  const frontRim = new THREE.Mesh(
    new THREE.CylinderGeometry(wheelRadius - 0.05, wheelRadius - 0.05, 0.08, 16),
    chromeMaterial
  );
  frontRim.rotation.z = Math.PI / 2;
  frontRim.position.set(0.85, -0.5, 0);
  scooterGroup.add(frontRim);

  // Front wheel spokes
  for (let i = 0; i < 5; i++) {
    const spoke = new THREE.Mesh(
      new THREE.BoxGeometry(0.02, wheelRadius * 1.6, 0.01),
      chromeMaterial
    );
    spoke.rotation.z = (Math.PI * 2 / 5) * i;
    spoke.position.set(0.85, -0.5, 0);
    scooterGroup.add(spoke);
  }

  // Rear tire
  const rearTire = new THREE.Mesh(
    new THREE.TorusGeometry(wheelRadius, tireThickness, 20, 32),
    tireMaterial
  );
  rearTire.rotation.y = Math.PI / 2;
  rearTire.position.set(-0.85, -0.5, 0);
  rearTire.castShadow = true;
  scooterGroup.add(rearTire);

  // Rear wheel rim
  const rearRim = new THREE.Mesh(
    new THREE.CylinderGeometry(wheelRadius - 0.05, wheelRadius - 0.05, 0.08, 16),
    chromeMaterial
  );
  rearRim.rotation.z = Math.PI / 2;
  rearRim.position.set(-0.85, -0.5, 0);
  scooterGroup.add(rearRim);

  // Rear wheel spokes
  for (let i = 0; i < 5; i++) {
    const spoke = new THREE.Mesh(
      new THREE.BoxGeometry(0.02, wheelRadius * 1.6, 0.01),
      chromeMaterial
    );
    spoke.rotation.z = (Math.PI * 2 / 5) * i;
    spoke.position.set(-0.85, -0.5, 0);
    scooterGroup.add(spoke);
  }

  // === FLOORBOARD / DECK ===
  const floorboard = new THREE.Mesh(
    new THREE.BoxGeometry(1.3, 0.05, 0.35),
    blackPlasticMaterial
  );
  floorboard.position.set(0, -0.15, 0);
  floorboard.castShadow = true;
  scooterGroup.add(floorboard);

  // === FRONT APRON (curved front body) ===
  const apronCurve = new THREE.Shape();
  apronCurve.moveTo(-0.2, 0);
  apronCurve.quadraticCurveTo(0, 0.4, 0.2, 0);
  apronCurve.lineTo(0.2, -0.5);
  apronCurve.lineTo(-0.2, -0.5);
  apronCurve.lineTo(-0.2, 0);

  const apronGeometry = new THREE.ExtrudeGeometry(apronCurve, {
    depth: 0.5,
    bevelEnabled: true,
    bevelThickness: 0.02,
    bevelSize: 0.02,
    bevelSegments: 3
  });

  const frontApron = new THREE.Mesh(apronGeometry, bodyMaterial);
  frontApron.position.set(0.8, 0.2, -0.25);
  frontApron.castShadow = true;
  scooterGroup.add(frontApron);

  // === SIDE PANELS ===
  // Left side panel
  const sidePanelGeometry = new THREE.BoxGeometry(1.2, 0.4, 0.05);
  const leftPanel = new THREE.Mesh(sidePanelGeometry, bodyMaterial);
  leftPanel.position.set(0, -0.05, 0.2);
  leftPanel.castShadow = true;
  scooterGroup.add(leftPanel);

  // Right side panel
  const rightPanel = new THREE.Mesh(sidePanelGeometry, bodyMaterial);
  rightPanel.position.set(0, -0.05, -0.2);
  rightPanel.castShadow = true;
  scooterGroup.add(rightPanel);

  // === SEAT ===
  const seatGeometry = new THREE.BoxGeometry(0.5, 0.15, 0.4);
  const seatMaterial = new THREE.MeshStandardMaterial({
    color: 0x0a0a0a,
    roughness: 0.7,
    metalness: 0.1
  });
  const seat = new THREE.Mesh(seatGeometry, seatMaterial);
  seat.position.set(-0.4, 0.25, 0);
  seat.castShadow = true;
  scooterGroup.add(seat);

  // Seat cushion (rounded top)
  const seatTop = new THREE.Mesh(
    new THREE.CapsuleGeometry(0.18, 0.3, 8, 16),
    seatMaterial
  );
  seatTop.rotation.z = Math.PI / 2;
  seatTop.position.set(-0.4, 0.35, 0);
  scooterGroup.add(seatTop);

  // === REAR SECTION ===
  const rearBody = new THREE.Mesh(
    new THREE.BoxGeometry(0.3, 0.35, 0.45),
    bodyMaterial
  );
  rearBody.position.set(-0.8, 0.05, 0);
  rearBody.castShadow = true;
  scooterGroup.add(rearBody);

  // Tail light
  const tailLight = new THREE.Mesh(
    new THREE.BoxGeometry(0.05, 0.1, 0.3),
    new THREE.MeshBasicMaterial({
      color: 0xff0000,
      emissive: 0xff0000,
      emissiveIntensity: 0.5
    })
  );
  tailLight.position.set(-0.95, 0.05, 0);
  scooterGroup.add(tailLight);

  // === HANDLEBAR ASSEMBLY ===
  // Handlebar stem (fork)
  const stem = new THREE.Mesh(
    new THREE.CylinderGeometry(0.025, 0.03, 0.8, 16),
    chromeMaterial
  );
  stem.position.set(0.75, 0.35, 0);
  stem.rotation.z = -0.15;
  stem.castShadow = true;
  scooterGroup.add(stem);

  // Handlebar
  const handlebar = new THREE.Mesh(
    new THREE.CylinderGeometry(0.02, 0.02, 0.5, 16),
    chromeMaterial
  );
  handlebar.rotation.z = Math.PI / 2;
  handlebar.position.set(0.7, 0.7, 0);
  handlebar.castShadow = true;
  scooterGroup.add(handlebar);

  // Left mirror
  const mirrorStem = new THREE.Mesh(
    new THREE.CylinderGeometry(0.01, 0.01, 0.15, 8),
    chromeMaterial
  );
  mirrorStem.rotation.z = -Math.PI / 4;
  mirrorStem.position.set(0.65, 0.75, 0.25);
  scooterGroup.add(mirrorStem);

  const leftMirror = new THREE.Mesh(
    new THREE.CircleGeometry(0.08, 16),
    chromeMaterial
  );
  leftMirror.position.set(0.6, 0.85, 0.3);
  scooterGroup.add(leftMirror);

  // Right mirror
  const mirrorStem2 = new THREE.Mesh(
    new THREE.CylinderGeometry(0.01, 0.01, 0.15, 8),
    chromeMaterial
  );
  mirrorStem2.rotation.z = -Math.PI / 4;
  mirrorStem2.position.set(0.65, 0.75, -0.25);
  scooterGroup.add(mirrorStem2);

  const rightMirror = new THREE.Mesh(
    new THREE.CircleGeometry(0.08, 16),
    chromeMaterial
  );
  rightMirror.position.set(0.6, 0.85, -0.3);
  scooterGroup.add(rightMirror);

  // === HEADLIGHT ===
  const headlightHousing = new THREE.Mesh(
    new THREE.CylinderGeometry(0.12, 0.12, 0.08, 16),
    blackPlasticMaterial
  );
  headlightHousing.rotation.z = Math.PI / 2;
  headlightHousing.position.set(0.95, 0.3, 0);
  scooterGroup.add(headlightHousing);

  const headlight = new THREE.Mesh(
    new THREE.CircleGeometry(0.1, 16),
    new THREE.MeshBasicMaterial({
      color: 0xffffff,
      emissive: 0xaaccff,
      emissiveIntensity: 1
    })
  );
  headlight.rotation.y = Math.PI / 2;
  headlight.position.set(0.99, 0.3, 0);
  scooterGroup.add(headlight);

  // === FRONT FENDER ===
  const fenderCurve = new THREE.CylinderGeometry(wheelRadius + 0.1, wheelRadius + 0.1, 0.3, 32, 1, true, 0, Math.PI);
  const frontFender = new THREE.Mesh(fenderCurve, bodyMaterial);
  frontFender.rotation.z = Math.PI / 2;
  frontFender.position.set(0.85, 0, 0);
  scooterGroup.add(frontFender);

  // === REAR FENDER ===
  const rearFender = new THREE.Mesh(fenderCurve, bodyMaterial);
  rearFender.rotation.z = Math.PI / 2;
  rearFender.position.set(-0.85, 0, 0);
  scooterGroup.add(rearFender);

  // Position the entire scooter group
  scooterGroup.position.y = 0.5;

  return scooterGroup;
};

// 🛵 Load Scooter Model - CHOOSE YOUR MODE!
// ==========================================

// OPTION 1: Use placeholder (current - works without downloading anything)
// OPTION 2: Use real 3D model (better quality!)

const USE_REAL_MODEL = true; // ⬅️ Change to `true` after downloading a scooter model!

import { loadModel, scooterPresets } from './advancedModelLoader.js';

const loadScooterModel = async () => {
  try {
    console.log('🔄 Loading scooter model...');

    // Load the actual 3D model
    const scooter = await loadModel('/models/ola_electric_scooter.glb', {
      // Don't override colors - use the model's original materials
      scale: 1.5,  // Slightly larger for better visibility
      position: { x: 0, y: -0.5, z: 0 }  // Lower position
    });

    scene.add(scooter);
    console.log('✅ Scooter loaded successfully!');

    // Hide loading screen
    setTimeout(() => {
      document.getElementById('loading-screen').classList.add('hidden');
    }, 500);

  } catch (error) {
    console.error('❌ Error loading scooter:', error);

    // Fallback: show placeholder if model fails to load
    const fallbackScooter = createPlaceholderScooter();
    scene.add(fallbackScooter);
    document.getElementById('loading-screen').classList.add('hidden');
  }
};

// Function to load your custom Scooter model from JSON
// You'll use this once you provide the JSON file
export const loadCustomScooterModel = async (jsonData) => {
  try {
    // Parse the geometry data from your JSON
    const geometry = new THREE.BufferGeometry();

    // Example: assuming your JSON has vertices, normals, uvs
    if (jsonData.vertices) {
      geometry.setAttribute('position',
        new THREE.Float32BufferAttribute(jsonData.vertices, 3)
      );
    }

    if (jsonData.normals) {
      geometry.setAttribute('normal',
        new THREE.Float32BufferAttribute(jsonData.normals, 3)
      );
    }

    if (jsonData.uvs) {
      geometry.setAttribute('uv',
        new THREE.Float32BufferAttribute(jsonData.uvs, 2)
      );
    }

    if (jsonData.indices) {
      geometry.setIndex(jsonData.indices);
    }

    geometry.computeVertexNormals();

    const scooter = await loadModel('/models/ola_electric_scooter.glb', {
      color: 0xa67c52,      // Bronze (like TVS iQube in your image)
      roughness: 0.3,       // 0 = shiny, 1 = matte
      metalness: 0.7,       // 0 = plastic, 1 = metal
      scale: 1
    });

    // Create material with scooter-appropriate colors


    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;

    // Remove placeholder and add custom model
    const placeholder = scene.children.find(child => child.type === 'Group');
    if (placeholder) scene.remove(placeholder);

    scene.add(mesh);

    console.log('Custom scooter model loaded successfully!');
    return mesh;

  } catch (error) {
    console.error('Error loading custom model:', error);
    return null;
  }
};

// Animation loop
const animate = () => {
  requestAnimationFrame(animate);

  // Update controls
  controls.update();

  // Render the scene
  renderer.render(scene, camera);
};

// Handle window resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Initialize the scene
await loadScooterModel();
animate();

// Make loadCustomScooterModel available globally for easy testing
window.loadCustomScooterModel = loadCustomScooterModel;

console.log('🎨 Three.js scene initialized!');
console.log('🛵 To load your scooter model, use: loadCustomScooterModel(yourJsonData)');
