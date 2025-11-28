/**
 * 🎯 HOW TO LOAD YOUR SCOOTER MODEL
 * 
 * Follow these steps to load your 3D scooter model JSON file
 */

// STEP 1: Copy your JSON file
// ===========================
// Copy your scooter 3D model file to:
// c:\VrindaDevadas\Learning\3d-tv-website\models\scooter-model.json


// STEP 2: Use one of these methods to load it
// ============================================

// METHOD A: Automatic loading (easiest)
// --------------------------------------
// Add this code to main.js, after the loadScooterModel() function:

/*
import { loadModelFromFile } from './modelLoader.js';

// Replace the loadScooterModel function with this:
const loadScooterModel = async () => {
  try {
    const scooterModel = await loadModelFromFile('/models/scooter-model.json', {
      color: 0x8b5cf6,      // Purple color (TVS style)
      roughness: 0.3,       // Shiny surface
      metalness: 0.7,       // Metallic look
      scale: 1,             // Adjust size if needed
      position: { x: 0, y: 0, z: 0 }
    });
    
    if (scooterModel) {
      scene.add(scooterModel);
      console.log('✅ Scooter model loaded!');
    }
    
    document.getElementById('loading-screen').classList.add('hidden');
    
  } catch (error) {
    console.error('Error loading scooter model:', error);
    document.getElementById('loading-screen').classList.add('hidden');
  }
};
*/


// METHOD B: Browser console (for testing)
// ----------------------------------------
// 1. Run: npm run dev
// 2. Open browser developer tools (F12)
// 3. Go to Console tab
// 4. Paste this code:

/*
fetch('/models/scooter-model.json')
  .then(response => response.json())
  .then(data => {
    // First, analyze the structure
    console.log('JSON data:', data);
    
    // Then load it
    const model = window.loadCustomScooterModel(data);
    if (model) {
      console.log('Model loaded successfully!');
    }
  })
  .catch(error => console.error('Error:', error));
*/


// METHOD C: Debug the JSON structure first
// -----------------------------------------
// If the model doesn't load correctly, analyze its structure:

/*
import { analyzeJSONStructure, loadJSONGeometry } from './modelLoader.js';

fetch('/models/scooter-model.json')
  .then(response => response.json())
  .then(data => {
    // Analyze the structure
    analyzeJSONStructure(data);
    
    // Then try to load it
    const model = loadJSONGeometry(data, {
      color: 0x8b5cf6,  // Purple
      scale: 0.5        // Adjust if too big/small
    });
    
    if (model) {
      scene.add(model);
    }
  });
*/


// STEP 3: Customize the appearance
// =================================

// Change colors:
const options = {
    color: 0x8b5cf6,      // Hex color (TVS purple)
    roughness: 0.3,       // 0 = mirror, 1 = rough
    metalness: 0.7,       // 0 = plastic, 1 = metal
    scale: 1,             // Size multiplier
    position: { x: 0, y: 0, z: 0 }  // 3D position
};

// Material presets you can use:
import { materialPresets } from './modelLoader.js';

// Use like this:
/*
const model = await loadModelFromFile('/models/scooter-model.json', {
  ...materialPresets.metal,  // or .plastic, .screen, .glossy
  scale: 1
});
*/


// STEP 4: Common JSON formats supported
// ======================================

/*
Format 1 - Simple arrays:
{
  "vertices": [x1, y1, z1, x2, y2, z2, ...],
  "normals": [nx1, ny1, nz1, ...],
  "indices": [0, 1, 2, ...]
}

Format 2 - Three.js BufferGeometry:
{
  "type": "BufferGeometry",
  "data": {
    "attributes": {
      "position": { "array": [...], "itemSize": 3 },
      "normal": { "array": [...], "itemSize": 3 }
    }
  }
}

Format 3 - Custom structure:
{
  "positions": [...],
  "uv": [...],
  "index": [...]
}
*/


// TROUBLESHOOTING
// ===============

// Model appears black?
// - Check lighting in main.js
// - Try different material colors
// - Verify normals are correct

// Model is upside down or rotated wrong?
// Add rotation:
/*
model.rotation.x = Math.PI / 2;  // Rotate 90 degrees on X axis
model.rotation.y = Math.PI;      // Rotate 180 degrees on Y axis
*/

// Model is too big or too small?
// Adjust scale:
// scale: 0.1   // Much smaller
// scale: 2     // Twice as big

// Model not visible at all?
// - Check browser console for errors
// - Verify JSON file is in /models/ folder
// - Try moving camera further: camera.position.set(0, 2, 10);

console.log('📖 Read LOAD_MODEL_INSTRUCTIONS.js for help!');
console.log('🛵 This is for loading SCOOTER models (like TVS iQube)');
