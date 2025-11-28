# 🛵 How to Use an Actual Scooter Model

Yes! You can use a real 3D scooter model like the TVS iQube Electric shown in your reference image.

## 📥 Step 1: Get a Scooter 3D Model

### Option A: Download Free Models (Recommended)

Visit these sites and download a scooter model in **GLB** or **GLTF** format:

1. **Sketchfab** (Best option - high quality, free downloads)
   - Go to: https://sketchfab.com/search?q=scooter&type=models
   - Filter by "Downloadable" and "Free"
   - Look for electric scooters with GLB/GLTF format
   - Download and save to: `c:\VrindaDevadas\Learning\3d-tv-website\models\scooter.glb`

2. **CGTrader** (Professional models)
   - https://www.cgtrader.com/free-3d-models/vehicle/motorcycle/electric-scooter
   - Download GLB/GLTF format

3. **Poly Pizza** (Simple, free models)
   - https://poly.pizza/search/scooter
   - All models are free and in GLB format

### Option B: I Can Help You Find One

I can search for and download a suitable scooter model for you. Just let me know!

## 🔧 Step 2: Place Model in Your Project

Create a `models` folder (if it doesn't exist) and put your scooter model there:

```
3d-tv-website/
├── models/
│   └── scooter.glb  ← Your scooter model here
├── main.js
├── advancedModelLoader.js
└── ...
```

## 💻 Step 3: Update Your Code

Replace the `loadScooterModel()` function in `main.js` with this:

```javascript
import { loadModel, scooterPresets } from './advancedModelLoader.js';

const loadScooterModel = async () => {
  try {
    console.log('🔄 Loading scooter model...');
    
    // Load the actual 3D model
    const scooter = await loadModel('/models/scooter.glb', {
      ...scooterPresets.tvsIQube,  // TVS iQube style (bronze/brown)
      scale: 1,  // Adjust if model is too big/small
      position: { x: 0, y: 0, z: 0 }
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
```

## 🎨 Step 4: Customize Appearance

### Change Colors & Materials

```javascript
const scooter = await loadModel('/models/scooter.glb', {
  color: 0xa67c52,      // Bronze (like TVS iQube in your image)
  roughness: 0.3,       // 0 = shiny, 1 = matte
  metalness: 0.7,       // 0 = plastic, 1 = metal
  scale: 1
});
```

### Use Presets

```javascript
// TVS iQube style (bronze/brown)
...scooterPresets.tvsIQube

// Modern purple glossy
...scooterPresets.modernGlossy

// Matte black
...scooterPresets.matteFinish
```

### Adjust Size & Position

```javascript
const scooter = await loadModel('/models/scooter.glb', {
  scale: 0.5,  // Make it smaller
  position: { x: 0, y: -0.5, z: 0 },  // Move down
  rotation: { x: 0, y: Math.PI, z: 0 }  // Rotate 180°
});
```

## 🐛 Troubleshooting

### Model doesn't load?
- Check browser console for errors (F12)
- Verify file is in `/models/` folder
- Make sure filename matches exactly: `scooter.glb`
- Try different model file

### Model is black or dark?
- The lighting is already set up in `main.js`
- Try adjusting the color: `color: 0xffffff` (white)

### Model is too big or small?
- Adjust scale: `scale: 0.1` (smaller) or `scale: 2` (bigger)
- Move camera: `camera.position.set(0, 2, 10);`

### Model is upside down?
- Rotate it: `rotation: { x: Math.PI, y: 0, z: 0 }`

## 🚀 Quick Start Example

Want me to search for and integrate a scooter model right now? I can:

1. Find a suitable free scooter model
2. Download it to your project
3. Update your code to load it automatically
4. Style it to match the TVS iQube look from your image

Just say "yes" and I'll get started!

## 📝 Supported File Formats

- ✅ **GLB** (Binary GLTF - Recommended!)
- ✅ **GLTF** (JSON GLTF)
- ✅ **OBJ** (Wavefront OBJ)
- ⚠️ **FBX** (Requires additional loader)

**Tip:** GLB format is best for web - it's compressed and includes textures!

---

Need help? Just ask! I can:
- Find and download a scooter model for you
- Help troubleshoot loading issues
- Customize colors and materials
- Add animations (if the model has them)
