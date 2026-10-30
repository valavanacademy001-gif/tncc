'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

interface Hero3DLogoProps {
  className?: string;
  style?: React.CSSProperties;
}

export default function Hero3DLogo({ className = '', style }: Hero3DLogoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let animationFrameId: number;
    let isDisposed = false;
    let isVisible = true;

    // Dimensions
    let width = container.clientWidth || 480;
    let height = container.clientHeight || 480;

    // Scene
    const scene = new THREE.Scene();

    // Camera with natural perspective
    const camera = new THREE.PerspectiveCamera(34, width / height, 0.1, 50);
    camera.position.set(0, 0, 3.8);

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
    renderer.toneMappingExposure = 1.1;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    // Studio Lighting setup to accentuate the 4 solid colors & 3D relief
    // 1. Soft Ambient Light for balanced base illumination
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    // 2. Key Directional Light (upper right)
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.0);
    keyLight.position.set(3.5, 4.0, 4.5);
    scene.add(keyLight);

    // 3. Fill Light (lower left) with soft warmth to soften shadows
    const fillLight = new THREE.DirectionalLight(0xfff7ed, 1.2);
    fillLight.position.set(-3.5, -1.5, 3.0);
    scene.add(fillLight);

    // 4. Subtle Back / Rim Light for edge separation
    const rimLight = new THREE.DirectionalLight(0x00B5C8, 0.7);
    rimLight.position.set(0, 3.0, -3.5);
    scene.add(rimLight);

    // Group for mouse rotation & auto-centering
    const logoGroup = new THREE.Group();
    scene.add(logoGroup);

    // Draco Loader for KHR_draco_mesh_compression
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('/draco/');

    // GLTF Loader
    const loader = new GLTFLoader();
    loader.setDRACOLoader(dracoLoader);

    // Target and current rotations (in radians)
    // Horizontal rotation: -15° to +15° (~0.26 rad)
    // Vertical rotation: -8° to +8° (~0.14 rad)
    const MAX_ROT_Y = 15 * (Math.PI / 180);
    const MAX_ROT_X = 8 * (Math.PI / 180);

    let targetRotX = 0;
    let targetRotY = 0;
    let currentRotX = 0;
    let currentRotY = 0;
    let isHovered = false;

    // Check if device is primarily touch-based
    const isTouchDevice =
      typeof window !== 'undefined' &&
      (window.matchMedia('(hover: none) and (pointer: coarse)').matches ||
        'ontouchstart' in window);

    // Load Model
    loader.load(
      '/regional_map_logo.glb',
      (gltf) => {
        if (isDisposed) return;

        const model = gltf.scene;

        // Traverse meshes to ensure materials look clean and preserve solid colours
        model.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            if (mesh.material) {
              const mat = mesh.material as THREE.MeshStandardMaterial;
              // Preserve original colors & textures while providing subtle premium sheen
              mat.roughness = Math.min(Math.max(mat.roughness ?? 0.35, 0.25), 0.6);
              mat.metalness = Math.min(mat.metalness ?? 0.08, 0.25);
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

        // Auto-scale to fit comfortably inside the viewport with ample whitespace
        const maxDim = Math.max(size.x, size.y, size.z) || 1;
        // On desktop/tablet, height 2.0 maps to scale ~ 1.05
        const baseScale = 2.15 / maxDim;
        logoGroup.scale.set(baseScale, baseScale, baseScale);

        logoGroup.add(model);
        setIsLoading(false);
      },
      undefined,
      (error) => {
        console.error('Error loading 3D logo:', error);
        if (!isDisposed) {
          setLoadError('Failed to load 3D logo');
          setIsLoading(false);
        }
      }
    );

    // Mouse Interaction
    const handleMouseMove = (e: MouseEvent) => {
      if (isTouchDevice) return;
      const rect = container.getBoundingClientRect();
      // Mouse position normalized from -1 (left/top) to +1 (right/bottom)
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;

      const clampedX = Math.max(-1.1, Math.min(1.1, nx));
      const clampedY = Math.max(-1.1, Math.min(1.1, ny));

      // Right mouse -> rotates right (+Y rotation)
      // Left mouse -> rotates left (-Y rotation)
      targetRotY = clampedX * MAX_ROT_Y;

      // Up mouse -> tilts up (-X rotation)
      // Down mouse -> tilts down (+X rotation)
      targetRotX = -clampedY * MAX_ROT_X;
      isHovered = true;
    };

    const handleMouseLeave = () => {
      // Smoothly return to original front-facing position
      targetRotX = 0;
      targetRotY = 0;
      isHovered = false;
    };

    // Attach mouse events to container and window for smooth exit tracking
    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('blur', handleMouseLeave);

    // Responsive Resize Handler with ResizeObserver
    const handleResize = () => {
      if (!container || isDisposed) return;
      width = container.clientWidth || 400;
      height = container.clientHeight || 400;

      camera.aspect = width / height;

      // Adjust camera distance for mobile / tablet screens to prevent clipping
      if (width < 640) {
        camera.position.z = 4.2;
      } else if (width < 1024) {
        camera.position.z = 3.9;
      } else {
        camera.position.z = 3.7;
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

      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Smooth interpolation (lerp factor ~ 0.055)
      currentRotX += (targetRotX - currentRotX) * 0.055;
      currentRotY += (targetRotY - currentRotY) * 0.055;

      // Subtle organic breathing float when idle
      const idleFloatY = isHovered ? 0 : Math.sin(time * 0.8) * 0.035;
      const idleFloatX = isHovered ? 0 : Math.cos(time * 0.6) * 0.018;

      logoGroup.rotation.y = currentRotY + idleFloatY;
      logoGroup.rotation.x = currentRotX + idleFloatX;

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup on unmount
    return () => {
      isDisposed = true;
      cancelAnimationFrame(animationFrameId);

      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('blur', handleMouseLeave);

      resizeObserver.disconnect();
      intersectionObserver.disconnect();

      dracoLoader.dispose();

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
        minHeight: '380px',
        cursor: 'grab',
        ...style,
      }}
      title="TNCC 3D Tamil Nadu Logo — Move cursor to inspect"
    >
      {/* Loading Skeleton */}
      {isLoading && !loadError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 pointer-events-none animate-pulse">
          <div className="w-48 h-48 sm:w-64 sm:h-64 rounded-full border-2 border-dashed border-[#00B5C8]/30 flex items-center justify-center">
            <div className="w-10 h-10 rounded-full border-2 border-[#E84020] border-t-transparent animate-spin" />
          </div>
          <span className="text-xs font-bold tracking-wider uppercase text-gray-400">
            Loading 3D Logo...
          </span>
        </div>
      )}

      {/* Error Fallback */}
      {loadError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
          <p className="text-xs text-gray-400">{loadError}</p>
        </div>
      )}
    </div>
  );
}
