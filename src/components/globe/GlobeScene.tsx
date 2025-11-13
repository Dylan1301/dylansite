"use client";

import { useRef, useMemo, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useTexture, Line, Text, Billboard} from "@react-three/drei";
import * as THREE from "three"

// Coordinates
const HANOI_LAT = 21.0278;
const HANOI_LON = 105.8342;
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

type ManualRotation = {
	x: number;
	y: number;
};

export function GlobeScene({ progress = 0, manualRotation }: { progress?: number; manualRotation?: ManualRotation }) {
	const globeGroupRef = useRef<THREE.Group>(null);
	const planeRef = useRef<THREE.Mesh>(null);
	const cameraTargetRef = useRef(new THREE.Vector3()); // { changed code }
	const progressRef = useRef(progress);
	const manualRotationRef = useRef<ManualRotation>({ x: 0, y: 0 });
	const { camera } = useThree();
	const globeRadius = 2;

	const CAMERA_START_DISTANCE = globeRadius * 3.5;
    const CAMERA_END_DISTANCE = globeRadius * 3.8;
    const FLIGHT_LINE_START = 0.1; // threshold for showing the arc + plane

	useEffect(() => {
		progressRef.current = progress;
	}, [progress]);

	useEffect(() => {
		manualRotationRef.current = manualRotation ?? { x: 0, y: 0 };	
	}, [manualRotation]);

	const hanoiRotation = useMemo(() => {
		return {
			x: THREE.MathUtils.degToRad(HANOI_LAT),
			y: THREE.MathUtils.degToRad(90 - HANOI_LON),
		};
	}, []);

	const melbourneRotation = useMemo(() => {
		return {
			x: THREE.MathUtils.degToRad(-MELBOURNE_LAT),
			y: THREE.MathUtils.degToRad(90 - MELBOURNE_LON),
		};
	}, []);

	const flightCurve = useMemo(() => {
		const start = latLonToVector3(HANOI_LAT, HANOI_LON, globeRadius + 0.1);
		const end = latLonToVector3(MELBOURNE_LAT, MELBOURNE_LON, globeRadius + 0.1);
		const mid = start.clone().add(end).multiplyScalar(0.5).setLength(globeRadius + 1.2);
		return new THREE.CatmullRomCurve3([start, mid, end]);
	}, [globeRadius]);

	const flightPoints = useMemo(() => flightCurve.getPoints(256), [flightCurve]);

	const markerColor = "#ef4444";
	const markerSize = 0.02;
	const markers = useMemo(
		() => [
			{ position: latLonToVector3(HANOI_LAT, HANOI_LON, globeRadius + 0.1), label: "Hanoi", start: 0.05, end: 0.55 },
			{ position: latLonToVector3(MELBOURNE_LAT, MELBOURNE_LON, globeRadius + 0.1), label: "Melbourne", start: 0.45, end: 1 },
		],
		[globeRadius]
	);

	// Load high-resolution Earth textures
	const [dayMap, ufo] = useTexture(["/textures/earth_day_2k.png", "/textures/ufo.png"], (textures) => {
		textures.forEach((texture) => {
			texture.anisotropy = 32;
			texture.colorSpace = THREE.SRGBColorSpace;
			texture.flipY = true;
			texture.wrapS = THREE.RepeatWrapping;
			texture.wrapT = THREE.RepeatWrapping;
		});
	});	

	const hanoiCameraPosition = useMemo( // { changed code }
        () => latLonToVector3(HANOI_LAT, HANOI_LON, CAMERA_START_DISTANCE),
        [CAMERA_START_DISTANCE]
    );
    const melbourneCameraPosition = useMemo( // { changed code }
        () => latLonToVector3(MELBOURNE_LAT, MELBOURNE_LON, CAMERA_END_DISTANCE),
        [CAMERA_END_DISTANCE]
    );

	useEffect(() => {
		// position camera so it looks toward Hanoi on mount
		camera.position.copy(hanoiCameraPosition); // { changed code }
		camera.lookAt(0, 0, 0);

		// optional: set initial globe rotation so Hanoi is perfectly centered if camera is kept on +Z
		if (globeGroupRef.current) {
			globeGroupRef.current.rotation.x = hanoiRotation.x;
			globeGroupRef.current.rotation.y = hanoiRotation.y;
		}
	}, [camera, hanoiCameraPosition, hanoiRotation]); // { changed code }

	useFrame(() => {
        const offset = progressRef.current;
        const manual = manualRotationRef.current;
        const cameraTarget = cameraTargetRef.current;
        const HANOI_ZOOM_END = 0.25;
        const HANOI_FOCUS_END = 0.35;
        const TRANSITION_END = 0.65;

        let initialZoom = 1.5;

        cameraTarget.copy(hanoiCameraPosition);

        if (offset < HANOI_ZOOM_END) {
            const zoomProgress = offset / HANOI_ZOOM_END;
            initialZoom = THREE.MathUtils.lerp(1.5, 2.75, zoomProgress);
            const zoomDistance = THREE.MathUtils.lerp(CAMERA_START_DISTANCE * 1.05, CAMERA_START_DISTANCE * 0.85, zoomProgress);
            cameraTarget.setLength(zoomDistance);
        } else if (HANOI_ZOOM_END <= offset && offset < HANOI_FOCUS_END) {
            const focusProgress = (offset - HANOI_ZOOM_END) / (HANOI_FOCUS_END - HANOI_ZOOM_END);
            // initialZoom = THREE.MathUtils.lerp(3, 1.5, focusProgress);
            const focusDistance = THREE.MathUtils.lerp(CAMERA_START_DISTANCE * 0.85, CAMERA_START_DISTANCE * 0.9, focusProgress);
            cameraTarget.setLength(focusDistance);
			initialZoom = 2.75;
            if (planeRef.current) {
                planeRef.current.visible = false;
            }
        } else if (offset < TRANSITION_END) {
            const transitProgress = (offset - HANOI_FOCUS_END) / (TRANSITION_END - HANOI_FOCUS_END);
            const clampedTransit = THREE.MathUtils.clamp(transitProgress, 0, 1);
            cameraTarget.copy(hanoiCameraPosition).lerp(melbourneCameraPosition, clampedTransit);
            const transitDistance = THREE.MathUtils.lerp(CAMERA_START_DISTANCE * 0.9, CAMERA_END_DISTANCE, clampedTransit);
            cameraTarget.setLength(transitDistance);
			initialZoom= 2.75;

            if (planeRef.current) {
                const planeProgress = clampedTransit;
                const point = flightCurve.getPointAt(planeProgress);
                const tangent = flightCurve.getTangentAt(Math.max(planeProgress - 0.01, 0)).normalize();
                
				planeRef.current.position.copy(point);
				planeRef.current.quaternion.copy(camera.quaternion);
                // planeRef.current.lookAt(point.clone().add(tangent));
                planeRef.current.visible = planeProgress > 0 && planeProgress < 0.99;
            }
        } else {
            const melbProgress = (offset - TRANSITION_END) / Math.max(1 - TRANSITION_END, 0.0001);
            // initialZoom = THREE.MathUtils.lerp(1.5, 2.4, melbProgress);
			initialZoom = 2.75;
            cameraTarget.copy(melbourneCameraPosition);
            const melbourneDistance = THREE.MathUtils.lerp(CAMERA_END_DISTANCE, CAMERA_END_DISTANCE * 0.9, THREE.MathUtils.clamp(melbProgress, 0, 1));
            cameraTarget.setLength(melbourneDistance);
            if (planeRef.current) {
                planeRef.current.visible = false;
            }
        }

        const manualEuler = new THREE.Euler(manual.x, manual.y, 0, "YXZ");
        const finalCameraPosition = cameraTarget.clone().applyEuler(manualEuler);

        camera.position.lerp(finalCameraPosition, 0.1);
        camera.zoom = initialZoom;
        camera.updateProjectionMatrix();
        camera.lookAt(0, 0, 0);

        if (globeGroupRef.current) {
            globeGroupRef.current.rotation.set(0, 0, 0);
        }
    });

	return (
		<>

			<ambientLight intensity={0.9} />
			{/* <hemisphereLight skyColor={"#ffffff"} groundColor={"#666666"} intensity={0.6} /> */}
			{/* Keep a directional highlight but much softer */}
			<directionalLight position={[5, 3, 5]} intensity={2} />

			<group ref={globeGroupRef}>
				{/* Earth globe */}
				<mesh>
					<sphereGeometry args={[globeRadius, 128, 128]} />
					{/* Less metallic, slightly brighter (emissive) and not tone-mapped so texture remains vivid */}
					<meshStandardMaterial
						map={dayMap}
						roughness={0.7}
						metalness={0.1}
						emissive="#ffffff"
						emissiveIntensity={0.00}
						toneMapped={false}
					/>
				</mesh>

				{/* City markers */}
				{markers.map((marker) => {
					const isVisible = progress >= marker.start && progress <= marker.end;
					if (!isVisible) return null;
					return (
						<group key={marker.label} position={marker.position}>
						<Billboard  lockX={false} lockY={false} lockZ={false}>
							<Text
                            position={[0, markerSize * 2, 0]}
                            fontSize={0.05}
                            color="#ffffff"
                            anchorX="center"
                            anchorY="bottom"
                            outlineWidth={0.01}
                            outlineColor="#000000"
                            // toneMapped={false}
							// billboard={true}
                        >
                            {marker.label}
                        </Text>		
						</Billboard>				
							{/* Glow halo to ensure visibility */}
							<mesh scale={[1.4, 1.4, 1.4]} renderOrder={-1}>
								<sphereGeometry args={[markerSize, 10, 10]} />
								<meshBasicMaterial
									color={markerColor}
									transparent
									opacity={0.25}
									depthWrite={false}
									depthTest={false}
									toneMapped={false}
								/>
							</mesh>
							{/* Main pin */}
							<mesh>
								<sphereGeometry args={[markerSize * 0.75, 32, 32]} />
								<meshStandardMaterial color={markerColor} emissive={markerColor} emissiveIntensity={0.5} />
							</mesh>
						</group>
					);
				})}

				{/* Flight arc */}
                {progress > FLIGHT_LINE_START && ( // show after scrolling past 0.1
                    <Line
                        points={flightPoints}
                        color="#fda4af"
                        opacity={0.4}
                        lineWidth={3}
                        transparent
                        dashed
                        dashSize={0.02}
                        gapSize={0.01}
						// renderOrder={1}
                    />
                )}

				{/* Plane indicator */}
				<mesh ref={planeRef} visible={false} renderOrder={2} scale = {0.6}>
					<planeGeometry args={[0.35, 0.35]} />
					<meshBasicMaterial
						map={ufo}
						transparent
						depthTest={false}
					/>
					{/* <coneGeometry args={[0.05, 0.25, 16]} /> */}
					{/* <meshStandardMaterial color="#f97316" emissive="#f97316" emissiveIntensity={1} toneMapped={false} /> */}
				</mesh>
			</group>

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
