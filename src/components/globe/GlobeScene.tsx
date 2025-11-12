"use client";

import { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useScroll, useTexture, Sphere } from "@react-three/drei";
import { animated, useSpring } from "@react-spring/three";
import * as THREE from "three";

// Melbourne coordinates: -37.8136° S, 144.9631° E
const MELBOURNE_LAT = -37.8136;
const MELBOURNE_LON = 144.9631;

// Convert lat/lon to 3D coordinates on sphere
function latLonToVector3(lat: number, lon: number, radius: number): THREE.Vector3 {
	const phi = (90 - lat) * (Math.PI / 180);
	const theta = (lon + 180) * (Math.PI / 180);
	const x = -(radius * Math.sin(phi) * Math.cos(theta));
	const z = radius * Math.sin(phi) * Math.sin(theta);
	const y = radius * Math.cos(phi);
	return new THREE.Vector3(x, y, z);
}

export function GlobeScene({ onScrollProgress }: { onScrollProgress?: (progress: number) => void }) {
	const globeRef = useRef<THREE.Mesh>(null);
	const scroll = useScroll();
	const { camera } = useThree();

	// Load textures (fallback to SVG placeholders if JPG/PNG not available)
	const [dayMap, nightMap, cloudsMap] = useTexture(
		["/textures/earth_day_2k.svg", "/textures/earth_night_2k.svg", "/textures/earth_clouds_2k.svg"],
		(textures) => {
			// Attempt to load JPG/PNG versions if they exist
			// For now using SVG placeholders
		}
	);

	// Animated camera position
	const [{ cameraZ, cameraY }] = useSpring(() => ({
		cameraZ: 5,
		cameraY: 0,
		config: { tension: 50, friction: 20 },
	}));

	useFrame(() => {
		const offset = scroll.offset;

		if (globeRef.current) {
			// Phase 1: Initial rotation (0 - 0.3)
			if (offset < 0.3) {
				const rotateProgress = offset / 0.3;
				globeRef.current.rotation.y = rotateProgress * Math.PI * 0.5;
				globeRef.current.rotation.x = 0;
			}
			// Phase 2: Rotate to Melbourne (0.3 - 0.7)
			else if (offset < 0.7) {
				const melbProgress = (offset - 0.3) / 0.4;
				const targetRotY = THREE.MathUtils.degToRad(90 - MELBOURNE_LON);
				const targetRotX = THREE.MathUtils.degToRad(MELBOURNE_LAT);

				globeRef.current.rotation.y = THREE.MathUtils.lerp(Math.PI * 0.5, targetRotY, melbProgress);
				globeRef.current.rotation.x = THREE.MathUtils.lerp(0, targetRotX, melbProgress);
			}
			// Phase 3: Hold position and zoom (0.7 - 1.0)
			else {
				const zoomProgress = (offset - 0.7) / 0.3;
				const targetRotY = THREE.MathUtils.degToRad(90 - MELBOURNE_LON);
				const targetRotX = THREE.MathUtils.degToRad(MELBOURNE_LAT);
				globeRef.current.rotation.y = targetRotY;
				globeRef.current.rotation.x = targetRotX;

				// Zoom camera
				const startZ = 5;
				const endZ = 3;
				camera.position.z = THREE.MathUtils.lerp(startZ, endZ, zoomProgress);
			}
		}

		// Callback for overlay trigger
		if (onScrollProgress) {
			onScrollProgress(offset);
		}
	});

	// Custom shader material for day/night blend
	const earthMaterial = useMemo(() => {
		return new THREE.ShaderMaterial({
			uniforms: {
				dayTexture: { value: dayMap },
				nightTexture: { value: nightMap },
				sunDirection: { value: new THREE.Vector3(1, 0, 1).normalize() },
			},
			vertexShader: `
        varying vec2 vUv;
        varying vec3 vNormal;
        void main() {
          vUv = uv;
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
			fragmentShader: `
        uniform sampler2D dayTexture;
        uniform sampler2D nightTexture;
        uniform vec3 sunDirection;
        varying vec2 vUv;
        varying vec3 vNormal;
        
        void main() {
          vec3 dayColor = texture2D(dayTexture, vUv).rgb;
          vec3 nightColor = texture2D(nightTexture, vUv).rgb;
          
          float intensity = dot(vNormal, sunDirection);
          float mixAmount = smoothstep(-0.2, 0.2, intensity);
          
          vec3 color = mix(nightColor, dayColor, mixAmount);
          gl_FragColor = vec4(color, 1.0);
        }
      `,
		});
	}, [dayMap, nightMap]);

	return (
		<>
			{/* Ambient light */}
			<ambientLight intensity={0.3} />
			{/* Directional light (sun) */}
			<directionalLight position={[5, 3, 5]} intensity={1.2} />

			{/* Earth globe */}
			<mesh ref={globeRef}>
				<sphereGeometry args={[2, 64, 64]} />
				<primitive object={earthMaterial} attach="material" />
			</mesh>

			{/* Cloud layer */}
			<Sphere args={[2.01, 64, 64]}>
				<meshPhongMaterial map={cloudsMap} transparent opacity={0.4} depthWrite={false} />
			</Sphere>

			{/* Stars background */}
			<Stars />
		</>
	);
}

// Simple stars background
function Stars() {
	const starsRef = useRef<THREE.Points>(null);

	const starGeometry = useMemo(() => {
		const geometry = new THREE.BufferGeometry();
		const positions = new Float32Array(2000 * 3);
		for (let i = 0; i < 2000; i++) {
			const radius = 50 + Math.random() * 50;
			const theta = Math.random() * Math.PI * 2;
			const phi = Math.acos(2 * Math.random() - 1);
			positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
			positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
			positions[i * 3 + 2] = radius * Math.cos(phi);
		}
		geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
		return geometry;
	}, []);

	return (
		<points ref={starsRef}>
			<primitive object={starGeometry} attach="geometry" />
			<pointsMaterial size={0.1} color="#ffffff" sizeAttenuation />
		</points>
	);
}

