'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const HeroScene3D: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 400;
    const height = container.clientHeight || 400;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);

    const crystalGroup = new THREE.Group();
    scene.add(crystalGroup);

    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0x10b981,
      metalness: 0.2,
      roughness: 0.1,
      transmission: 0.9,
      thickness: 1.5,
      ior: 1.5,
      transparent: true,
      opacity: 0.6,
      envMapIntensity: 2,
      clearcoat: 1.0,
    });

    const glowMat = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      emissive: 0x10b981,
      emissiveIntensity: 2,
      transparent: true,
      opacity: 0.8,
    });

    const coreGeom = new THREE.IcosahedronGeometry(1.2, 1);
    const core = new THREE.Mesh(coreGeom, glassMat);
    crystalGroup.add(core);

    const coreWire = new THREE.Mesh(
      coreGeom,
      new THREE.MeshBasicMaterial({
        color: 0x10b981,
        wireframe: true,
        transparent: true,
        opacity: 0.3,
      })
    );
    coreWire.scale.set(1.05, 1.05, 1.05);
    core.add(coreWire);

    interface ParticleUserData {
      angle: number;
      radius: number;
      speed: number;
      yAmplitude: number;
      yPhase: number;
    }

    const particles: THREE.Mesh[] = [];
    const particleCount = 40;

    for (let i = 0; i < particleCount; i++) {
      const size = Math.random() * 0.1 + 0.02;
      const geom =
        Math.random() > 0.5
          ? new THREE.SphereGeometry(size, 8, 8)
          : new THREE.BoxGeometry(size, size, size);
      const mat = Math.random() > 0.7 ? glowMat.clone() : glassMat.clone();

      const p = new THREE.Mesh(geom, mat);

      p.userData = {
        angle: Math.random() * Math.PI * 2,
        radius: 2 + Math.random() * 3,
        speed: 0.005 + Math.random() * 0.01,
        yAmplitude: Math.random() * 1.5,
        yPhase: Math.random() * Math.PI * 2,
      } as ParticleUserData;

      scene.add(p);
      particles.push(p);
    }

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const mainLight = new THREE.PointLight(0x10b981, 5, 20);
    mainLight.position.set(5, 5, 5);
    scene.add(mainLight);

    const secondaryLight = new THREE.PointLight(0x06b6d4, 3, 15);
    secondaryLight.position.set(-5, -5, 2);
    scene.add(secondaryLight);

    camera.position.z = 7;

    let animationFrameId: number;
    function animate() {
      animationFrameId = requestAnimationFrame(animate);
      const time = Date.now() * 0.001;

      crystalGroup.rotation.y += 0.005;
      crystalGroup.rotation.x += 0.003;
      core.position.y = Math.sin(time * 0.5) * 0.2;

      particles.forEach((p) => {
        const uData = p.userData as ParticleUserData;
        uData.angle += uData.speed;
        p.position.x = Math.cos(uData.angle) * uData.radius;
        p.position.z = Math.sin(uData.angle) * uData.radius;
        p.position.y = Math.sin(time + uData.yPhase) * uData.yAmplitude;
        p.rotation.x += 0.02;
        p.rotation.y += 0.01;
      });

      renderer.render(scene, camera);
    }

    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return <div ref={containerRef} className="w-full h-full" />;
};
