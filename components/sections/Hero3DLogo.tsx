'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

// Module-level in-memory cache to make subsequent renders instant
let cachedGLTF: any = null;

interface Hero3DLogoProps {
  className?: string;
  style?: React.CSSProperties;
}

export default function Hero3DLogo({ className = '', style }: Hero3DLogoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let animationFrameId: number;
    let isDisposed = false;
    let isVisible = true;

    // Dimensions
    let width = container.clientWidth || 650;
    let height = container.clientHeight || 750;

    // Scene
    const scene = new THREE.Scene();

    // Camera calibrated close-up for massive heroic presence matching Neptune
    const camera = new THREE.PerspectiveCamera(44, width / height, 0.1, 50);
    camera.position.set(0, 0, 3.25);

    // Renderer with transparency & high-fidelity color management
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, 0); // Transparent
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    // Studio Lighting setup to accentuate the 4 solid colors & 3D relief
    // 1. Ambient Light for balanced base illumination
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.85);
    scene.add(ambientLight);

    // 2. Key Directional Light (upper right)
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.3);
    keyLight.position.set(4.0, 4.5, 4.5);
    scene.add(keyLight);

    // 3. Left Fill Light (to illuminate left side when turning left)
    const leftFillLight = new THREE.DirectionalLight(0xffffff, 1.7);
    leftFillLight.position.set(-4.0, 2.0, 3.5);
    scene.add(leftFillLight);

    // 4. Warm Bottom Fill Light
    const bottomFillLight = new THREE.DirectionalLight(0xfff7ed, 1.15);
    bottomFillLight.position.set(0, -3.0, 2.5);
    scene.add(bottomFillLight);

    // 5. Subtle Rim Light for edge separation
    const rimLight = new THREE.DirectionalLight(0x00B5C8, 0.95);
    rimLight.position.set(0, 3.5, -3.5);
    scene.add(rimLight);

    // Group for mouse rotation & auto-centering
    const logoGroup = new THREE.Group();
    scene.add(logoGroup);

    // Target and current rotations (in radians)
    // Horizontal Yaw: -18° to +18° (~0.31 rad) - smooth, visible turn
    // Vertical Pitch: -6.5° to +6.5° (~0.11 rad) - calibrated so top/bottom never cut off
    const MAX_ROT_Y = 18 * (Math.PI / 180);
    const MAX_ROT_X = 6.0 * (Math.PI / 180);
    const MAX_ROT_Z = 1.8 * (Math.PI / 180);

    let targetRotX = 0;
    let targetRotY = 0;
    let targetRotZ = 0;
    let currentRotX = 0;
    let currentRotY = 0;
    let currentRotZ = 0;
    let isInteracting = false;
    let lastInteractionTime = performance.now();

    // Check if device is primarily touch-based
    const isTouchDevice =
      typeof window !== 'undefined' &&
      (window.matchMedia('(hover: none) and (pointer: coarse)').matches ||
        'ontouchstart' in window);

    const setupModel = (gltf: any) => {
      if (isDisposed) return;
      const model = gltf.scene.clone();

      // Traverse meshes to ensure materials look clean and preserve solid colours
      model.traverse((child: any) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          if (child.material) {
            const mat = child.material;
            mat.roughness = Math.min(Math.max(mat.roughness ?? 0.32, 0.22), 0.55);
            mat.metalness = Math.min(mat.metalness ?? 0.08, 0.22);
            mat.needsUpdate = true;
          }
        }
      });

      // Compute Bounding Box to precisely center the geometry at (0, 0, 0)
      const box = new THREE.Box3().setFromObject(model);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());

      model.position.x = -center.x;
      model.position.y = -center.y;
      model.position.z = -center.z;

      // Colossal scale: fills 96% of frustum height prominently like the Neptune reference
      const maxDim = Math.max(size.x, size.y, size.z) || 1;
      const baseScale = 1.55 / maxDim;
      logoGroup.scale.set(baseScale, baseScale, baseScale);
      logoGroup.position.set(0.20, 0, 0);

      logoGroup.add(model);
      setIsReady(true);
    };

    // If already cached, instantiate immediately without any network roundtrip
    if (cachedGLTF) {
      setupModel(cachedGLTF);
    } else {
      const dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderPath('/draco/');

      const loader = new GLTFLoader();
      loader.setDRACOLoader(dracoLoader);

      loader.load(
        '/regional_map_logo.glb?v=3',
        (gltf) => {
          cachedGLTF = gltf;
          setupModel(gltf);
        },
        undefined,
        (error) => {
          console.error('Error loading 3D logo:', error);
          if (!isDisposed) {
            setIsReady(true);
          }
        }
      );
    }

    // Mouse Interaction across the ENTIRE Hero Section
    const heroSection = container.closest('section') || container;

    const handleMouseMove = (e: MouseEvent) => {
      if (isTouchDevice) return;
      const rect = heroSection.getBoundingClientRect();
      
      // Normalized coordinate from -1 to +1 across the whole hero section
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;

      // Clamp slightly past bounds for continuous responsiveness
      const clampedX = Math.max(-1.12, Math.min(1.12, nx));
      const clampedY = Math.max(-1.12, Math.min(1.12, ny));

      // Right mouse -> model turns right (+Y)
      // Left mouse -> model turns left (-Y)
      targetRotY = clampedX * MAX_ROT_Y;

      // Up mouse -> model tilts slightly up (-X)
      // Down mouse -> model tilts slightly down (+X)
      targetRotX = -clampedY * MAX_ROT_X;

      // Subtle roll tilt on Z
      targetRotZ = -clampedX * MAX_ROT_Z;

      isInteracting = true;
      lastInteractionTime = performance.now();
    };

    const handleMouseLeave = () => {
      targetRotX = 0;
      targetRotY = 0;
      targetRotZ = 0;
      isInteracting = false;
    };

    // Attach to the entire hero section so moving anywhere turns the 3D logo
    heroSection.addEventListener('mousemove', handleMouseMove);
    heroSection.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('blur', handleMouseLeave);

    // Responsive Resize Handler with aspect-ratio adaptive camera
    const handleResize = () => {
      if (!container || isDisposed) return;
      width = container.clientWidth || 600;
      height = container.clientHeight || 750;

      const aspect = width / height;
      camera.aspect = aspect;

      // Model aspect ratio is ~0.76. If screen width is narrower, adapt z so width never clips
      const modelAspect = 0.76;
      if (aspect < modelAspect) {
        camera.position.z = (3.25 * modelAspect) / aspect;
        logoGroup.position.x = 0.05; // center more on mobile / narrow viewports
      } else {
        camera.position.z = 3.25;
        logoGroup.position.x = 0.20; // shift right to fill right spacing on desktop
      }

      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    };

    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });
    resizeObserver.observe(container);

    // IntersectionObserver to pause rendering when hero is off-screen
    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
        });
      },
      { threshold: 0.05 }
    );
    intersectionObserver.observe(container);

    // Animation Loop with Smooth Interpolation (Lerp)
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (!isVisible || document.hidden) return;

      const time = clock.getElapsedTime();

      // Smooth interpolation (lerp factor ~ 0.045 for silky easing)
      currentRotX += (targetRotX - currentRotX) * 0.045;
      currentRotY += (targetRotY - currentRotY) * 0.045;
      currentRotZ += (targetRotZ - currentRotZ) * 0.045;

      // When idle, add a gentle organic floating motion
      const now = performance.now();
      const idleBlend = Math.min(1, Math.max(0, (now - lastInteractionTime - 1200) / 1000));
      const idleFloatY = Math.sin(time * 0.75) * 0.028 * idleBlend;
      const idleFloatX = Math.cos(time * 0.55) * 0.014 * idleBlend;

      logoGroup.rotation.y = currentRotY + idleFloatY;
      logoGroup.rotation.x = currentRotX + idleFloatX;
      logoGroup.rotation.z = currentRotZ;

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup on unmount
    return () => {
      isDisposed = true;
      cancelAnimationFrame(animationFrameId);

      heroSection.removeEventListener('mousemove', handleMouseMove);
      heroSection.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('blur', handleMouseLeave);

      resizeObserver.disconnect();
      intersectionObserver.disconnect();

      // Traverse & dispose geometries, materials, textures
      scene.traverse((object) => {
        if ((object as THREE.Mesh).isMesh) {
          const mesh = object as THREE.Mesh;
          mesh.geometry?.dispose();
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach((mat) => mat.dispose());
          } else if (mesh.material) {
            mesh.material.dispose();
          }
        }
      });

      renderer.dispose();
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full flex items-center justify-center select-none ${className}`}
      style={{
        width: '100%',
        height: '100%',
        minHeight: 'inherit',
        opacity: isReady ? 1 : 0,
        transition: 'opacity 0.3s ease',
        ...style,
      }}
      title="TNCC 3D Tamil Nadu Logo"
    />
  );
}
