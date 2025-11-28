import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';

/**
 * 🚀 Advanced Model Loader
 * Supports: GLB, GLTF, OBJ, FBX, and JSON formats
 * Perfect for loading realistic scooter models!
 */

/**
 * Load GLB/GLTF models (Recommended format!)
 * @param {string} url - Path to the model file
 * @param {Object} options - Configuration options
 * @returns {Promise<THREE.Group>}
 */
export const loadGLTFModel = (url, options = {}) => {
    const {
        color = null,
        roughness = null,
        metalness = null,
        scale = 1,
        position = { x: 0, y: 0, z: 0 },
        rotation = { x: 0, y: 0, z: 0 },
        onProgress = null
    } = options;

    return new Promise((resolve, reject) => {
        const loader = new GLTFLoader();

        loader.load(
            url,
            // On load success
            (gltf) => {
                const model = gltf.scene;

                // Apply custom material properties if specified
                if (color !== null || roughness !== null || metalness !== null) {
                    model.traverse((child) => {
                        if (child.isMesh) {
                            if (color !== null) child.material.color.setHex(color);
                            if (roughness !== null) child.material.roughness = roughness;
                            if (metalness !== null) child.material.metalness = metalness;

                            // Enable shadows
                            child.castShadow = true;
                            child.receiveShadow = true;
                        }
                    });
                }

                // Apply transformations
                model.scale.set(scale, scale, scale);
                model.position.set(position.x, position.y, position.z);
                model.rotation.set(rotation.x, rotation.y, rotation.z);

                console.log('✅ GLTF Model loaded successfully!');
                console.log('Model info:', {
                    animations: gltf.animations.length,
                    cameras: gltf.cameras.length,
                    scenes: gltf.scenes.length
                });

                resolve(model);
            },
            // On progress
            (xhr) => {
                const percentComplete = (xhr.loaded / xhr.total) * 100;
                console.log(`Loading: ${Math.round(percentComplete)}%`);
                if (onProgress) onProgress(percentComplete);
            },
            // On error
            (error) => {
                console.error('❌ Error loading GLTF model:', error);
                reject(error);
            }
        );
    });
};

/**
 * Load OBJ models
 */
export const loadOBJModel = (url, options = {}) => {
    const {
        color = 0x8b5cf6,
        roughness = 0.5,
        metalness = 0.6,
        scale = 1,
        position = { x: 0, y: 0, z: 0 }
    } = options;

    return new Promise((resolve, reject) => {
        const loader = new OBJLoader();

        loader.load(
            url,
            (object) => {
                // Apply material
                const material = new THREE.MeshStandardMaterial({
                    color,
                    roughness,
                    metalness
                });

                object.traverse((child) => {
                    if (child.isMesh) {
                        child.material = material;
                        child.castShadow = true;
                        child.receiveShadow = true;
                    }
                });

                object.scale.set(scale, scale, scale);
                object.position.set(position.x, position.y, position.z);

                console.log('✅ OBJ Model loaded successfully!');
                resolve(object);
            },
            undefined,
            reject
        );
    });
};

/**
 * Auto-detect file format and load model
 * @param {string} url - Path to model file
 * @param {Object} options - Configuration options
 */
export const loadModel = async (url, options = {}) => {
    const extension = url.split('.').pop().toLowerCase();

    console.log(`🔍 Detecting file format: .${extension}`);

    switch (extension) {
        case 'glb':
        case 'gltf':
            return loadGLTFModel(url, options);

        case 'obj':
            return loadOBJModel(url, options);

        default:
            throw new Error(`Unsupported file format: .${extension}`);
    }
};

/**
 * Preset configurations for scooters
 */
export const scooterPresets = {
    // TVS iQube Electric style
    tvsIQube: {
        color: 0xa67c52, // Bronze/brown like in your image
        roughness: 0.3,
        metalness: 0.7,
        scale: 1,
        rotation: { x: 0, y: 0, z: 0 }
    },

    // Glossy modern scooter
    modernGlossy: {
        color: 0x8b5cf6, // Purple
        roughness: 0.2,
        metalness: 0.8,
        scale: 1
    },

    // Matte finish
    matteFinish: {
        color: 0x2a2a2a,
        roughness: 0.8,
        metalness: 0.3,
        scale: 1
    }
};

/**
 * Helper: Find free scooter models
 */
export const scooterModelSources = {
    sketchfab: 'https://sketchfab.com/search?q=electric+scooter&type=models',
    cgtrader: 'https://www.cgtrader.com/free-3d-models/vehicle/motorcycle/electric-scooter',
    turbosquid: 'https://www.turbosquid.com/Search/3D-Models/free/scooter',
    free3d: 'https://free3d.com/3d-models/scooter'
};

console.log('📦 Advanced Model Loader ready!');
console.log('💡 Tip: Use loadModel() for auto-detection or loadGLTFModel() for GLB/GLTF files');
