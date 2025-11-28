import * as THREE from 'three';

/**
 * Model Loader Utility
 * Helper functions to load different 3D model formats
 */

/**
 * Loads a scooter model from JSON geometry data
 * @param {Object} jsonData - The parsed JSON model data
 * @param {Object} options - Configuration options
 * @returns {THREE.Mesh|THREE.Group} The loaded 3D model
 */
export const loadJSONGeometry = (jsonData, options = {}) => {
    const {
        color = 0x8b5cf6,
        roughness = 0.5,
        metalness = 0.6,
        scale = 1,
        position = { x: 0, y: 0, z: 0 }
    } = options;

    try {
        const geometry = new THREE.BufferGeometry();

        // Check different possible JSON formats

        // Format 1: Direct vertex arrays
        if (jsonData.vertices || jsonData.positions) {
            const vertices = jsonData.vertices || jsonData.positions;
            geometry.setAttribute('position',
                new THREE.Float32BufferAttribute(vertices, 3)
            );
        }

        // Format 2: Nested data structure
        if (jsonData.data && jsonData.data.attributes) {
            const attrs = jsonData.data.attributes;

            if (attrs.position) {
                geometry.setAttribute('position',
                    new THREE.Float32BufferAttribute(attrs.position.array, attrs.position.itemSize)
                );
            }

            if (attrs.normal) {
                geometry.setAttribute('normal',
                    new THREE.Float32BufferAttribute(attrs.normal.array, attrs.normal.itemSize)
                );
            }

            if (attrs.uv) {
                geometry.setAttribute('uv',
                    new THREE.Float32BufferAttribute(attrs.uv.array, attrs.uv.itemSize)
                );
            }
        }

        // Format 3: Three.js native format
        if (jsonData.type === 'BufferGeometry') {
            const loader = new THREE.BufferGeometryLoader();
            return loader.parse(jsonData);
        }

        // Add normals if not present
        if (jsonData.normals) {
            geometry.setAttribute('normal',
                new THREE.Float32BufferAttribute(jsonData.normals, 3)
            );
        } else {
            geometry.computeVertexNormals();
        }

        // Add UVs if present
        if (jsonData.uvs || jsonData.uv) {
            const uvs = jsonData.uvs || jsonData.uv;
            geometry.setAttribute('uv',
                new THREE.Float32BufferAttribute(uvs, 2)
            );
        }

        // Add indices if present
        if (jsonData.indices || jsonData.index) {
            const indices = jsonData.indices || jsonData.index;
            geometry.setIndex(indices);
        }

        // Center the geometry
        geometry.computeBoundingBox();
        const center = new THREE.Vector3();
        geometry.boundingBox.getCenter(center);
        geometry.translate(-center.x, -center.y, -center.z);

        // Create material
        const material = new THREE.MeshStandardMaterial({
            color,
            roughness,
            metalness,
            side: THREE.DoubleSide
        });

        // Create mesh
        const mesh = new THREE.Mesh(geometry, material);
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        // Apply transformations
        mesh.scale.set(scale, scale, scale);
        mesh.position.set(position.x, position.y, position.z);

        console.log('✅ Model loaded successfully!');
        console.log('Vertices:', geometry.attributes.position?.count || 0);

        return mesh;

    } catch (error) {
        console.error('❌ Error loading model:', error);
        console.log('JSON structure:', Object.keys(jsonData));
        return null;
    }
};

/**
 * Loads model from a JSON file path
 * @param {string} path - Path to the JSON file
 * @param {Object} options - Configuration options
 * @returns {Promise<THREE.Mesh|THREE.Group>}
 */
export const loadModelFromFile = async (path, options = {}) => {
    try {
        const response = await fetch(path);
        const jsonData = await response.json();
        return loadJSONGeometry(jsonData, options);
    } catch (error) {
        console.error('Error loading model file:', error);
        return null;
    }
};

/**
 * Analyzes JSON structure to help debug
 * @param {Object} jsonData - The JSON data to analyze
 */
export const analyzeJSONStructure = (jsonData) => {
    console.log('📊 JSON Structure Analysis:');
    console.log('━'.repeat(50));

    const analyze = (obj, depth = 0) => {
        const indent = '  '.repeat(depth);

        if (Array.isArray(obj)) {
            console.log(`${indent}Array[${obj.length}]`);
            if (obj.length > 0 && typeof obj[0] === 'number') {
                console.log(`${indent}  Sample: [${obj.slice(0, 6).join(', ')}${obj.length > 6 ? '...' : ''}]`);
            }
        } else if (typeof obj === 'object' && obj !== null) {
            Object.keys(obj).forEach(key => {
                const value = obj[key];
                if (Array.isArray(value)) {
                    console.log(`${indent}${key}: Array[${value.length}]`);
                    if (value.length > 0 && typeof value[0] === 'number') {
                        console.log(`${indent}  Sample: [${value.slice(0, 6).join(', ')}...]`);
                    }
                } else if (typeof value === 'object' && value !== null) {
                    console.log(`${indent}${key}:`);
                    if (depth < 2) analyze(value, depth + 1);
                } else {
                    console.log(`${indent}${key}: ${value}`);
                }
            });
        }
    };

    analyze(jsonData);
    console.log('━'.repeat(50));
};

/**
 * Creates a material preset
 */
export const materialPresets = {
    plastic: {
        color: 0x2a2a2a,
        roughness: 0.4,
        metalness: 0.1
    },
    metal: {
        color: 0x888888,
        roughness: 0.2,
        metalness: 0.9
    },
    screen: {
        color: 0x1a1a1a,
        roughness: 0.1,
        metalness: 0.8,
        emissive: 0x4a90e2,
        emissiveIntensity: 0.3
    },
    glossy: {
        color: 0xffffff,
        roughness: 0.1,
        metalness: 0.5
    }
};
