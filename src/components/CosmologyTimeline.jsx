import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const CosmologyTimeline = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    // --- 1. Scene Setup ---
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    const camera = new THREE.PerspectiveCamera(60, currentMount.clientWidth / currentMount.clientHeight, 0.1, 1000);
    camera.position.set(0, 5, 25);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    currentMount.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // --- 2. Defining Cosmic Expansion Geometry ---
    const universeLength = 30; 
    const segmentsX = 60;
    const segmentsY = 30;

    function getUniverseRadius(z) {
        const t = z / universeLength; 
        if (t < 0.05) {
            return 1.5 + Math.sin((t / 0.05) * Math.PI / 2) * 1.5;
        } else {
            return 3.0 + Math.pow(t - 0.05, 3) * 8.0;
        }
    }

    const geometry = new THREE.CylinderGeometry(1, 1, universeLength, segmentsX, segmentsY, true);
    const positionAttribute = geometry.attributes.position;

    for (let i = 0; i < positionAttribute.count; i++) {
        let x = positionAttribute.getX(i);
        let y = positionAttribute.getY(i);
        let z = positionAttribute.getZ(i);

        const timelinePos = y + universeLength / 2; 
        const radiusFactor = getUniverseRadius(timelinePos);
        
        const angle = Math.atan2(z, x);
        x = Math.cos(angle) * radiusFactor;
        z = Math.sin(angle) * radiusFactor;

        positionAttribute.setXYZ(i, x, y, z);
    }
    geometry.computeVertexNormals();
    geometry.rotateZ(Math.PI / 2);

    const cosmicMaterial = new THREE.MeshBasicMaterial({
        color: 0x4477aa,
        transparent: true,
        opacity: 0.15,
        side: THREE.DoubleSide
    });
    const universeMesh = new THREE.Mesh(geometry, cosmicMaterial);
    scene.add(universeMesh);

    const wireframeGeom = new THREE.WireframeGeometry(geometry);
    const lineMaterial = new THREE.LineBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.35
    });
    const gridLines = new THREE.LineSegments(wireframeGeom, lineMaterial);
    scene.add(gridLines);

    // --- 3. The Big Bang Flash & CMB Disk ---
    const flashGeo = new THREE.SphereGeometry(1.2, 32, 32);
    const flashMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const bigBangFlash = new THREE.Mesh(flashGeo, flashMat);
    bigBangFlash.position.set(-universeLength / 2, 0, 0);
    scene.add(bigBangFlash);

    const bigBangLight = new THREE.PointLight(0xffffff, 6, 50);
    bigBangLight.position.set(-universeLength / 2, 0, 0);
    scene.add(bigBangLight);

    const cmbGeo = new THREE.CircleGeometry(getUniverseRadius(0.5), 32);
    const cmbMat = new THREE.ShaderMaterial({
        vertexShader: `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            varying vec2 vUv;
            void main() {
                float pulse = sin(vUv.x * 35.0) * cos(vUv.y * 35.0);
                vec3 color = vec3(0.0, 0.3, 0.7);
                if(pulse > 0.2) color = vec3(0.0, 0.8, 0.5);
                if(pulse > 0.6) color = vec3(0.9, 0.8, 0.2);
                gl_FragColor = vec4(color, 0.95);
            }
        `,
        side: THREE.DoubleSide
    });
    const cmbDisk = new THREE.Mesh(cmbGeo, cmbMat);
    cmbDisk.position.set(-universeLength / 2 + 0.4, 0, 0);
    cmbDisk.rotateY(Math.PI / 2);
    scene.add(cmbDisk);

    // --- 4. Cosmic Particle Field (Stars & Galaxies) ---
    const particleCount = 4500;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const colorObject = new THREE.Color();

    for (let i = 0; i < particleCount; i++) {
        const pct = Math.random(); 
        const uX = pct * universeLength - (universeLength / 2);
        const localTimelinePos = uX + (universeLength / 2);
        const maxRadius = getUniverseRadius(localTimelinePos);
        
        const radius = Math.sqrt(Math.random()) * (maxRadius - 0.15); 
        const angle = Math.random() * Math.PI * 2;
        
        positions[i * 3] = uX;
        positions[i * 3 + 1] = Math.cos(angle) * radius;
        positions[i * 3 + 2] = Math.sin(angle) * radius;

        if (pct < 0.18) {
            colorObject.setHSL(0.58, 0.9, 0.2 + Math.random() * 0.2); 
        } else if (pct < 0.55) {
            colorObject.setHSL(0.6, 0.2, 0.7 + Math.random() * 0.3);  
        } else {
            const randType = Math.random();
            if (randType > 0.6) colorObject.setHex(0xffb84d);       
            else if (randType > 0.2) colorObject.setHex(0x73d2ff);  
            else colorObject.setHex(0xffffff);
        }

        colors[i * 3] = colorObject.r;
        colors[i * 3 + 1] = colorObject.g;
        colors[i * 3 + 2] = colorObject.b;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const pMat = new THREE.PointsMaterial({
        size: 0.16,
        vertexColors: true,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    const galaxyField = new THREE.Points(particleGeometry, pMat);
    scene.add(galaxyField);

    // --- 5. Animation Engine & Resizing ---
    const clock = new THREE.Clock();

    const animate = () => {
        requestAnimationFrame(animate);
        const elapsedTime = clock.getElapsedTime();
        
        universeMesh.rotation.x = elapsedTime * 0.04;
        gridLines.rotation.x = elapsedTime * 0.04;
        galaxyField.rotation.x = elapsedTime * 0.04;

        controls.update();
        renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
        if (!currentMount) return;
        camera.aspect = currentMount.clientWidth / currentMount.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
        window.removeEventListener('resize', handleResize);
        if (currentMount && renderer.domElement) {
          currentMount.removeChild(renderer.domElement);
        }
        renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} style={{ width: '100%', height: '100vh', position: 'relative' }} />;
};

export default CosmologyTimeline;
