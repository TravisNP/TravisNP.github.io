import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { DragControls } from 'three/addons/controls/DragControls.js';

let scene, camera, renderer, orbitControls;
const draggableObjects = [];
const pointObjects = {}; // To store points by name for easy access
let parallelogram;
let rotatedPoint;
let rotationArcGroup;
let arcLine, arcHead;

function init() {
    // --- Scene Setup ---
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);

    // --- Camera Setup ---
    const container = document.getElementById('3d-container');
    camera = new THREE.PerspectiveCamera(70, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.set(-2, 3.5, 5);

    // --- Renderer Setup ---
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // --- Lighting ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 7.5);
    scene.add(directionalLight);

    // --- Controls ---
    orbitControls = new OrbitControls(camera, renderer.domElement);
    orbitControls.enableDamping = true;

    // --- Axes Helper ---
    const axesHelper = new THREE.AxesHelper(5); // The number 5 determines the size of the axes
    scene.add(axesHelper);


    // --- Point Configuration ---
    const pointsConfig = [
        { name: 'red', color: 0xff0000, initialPos: new THREE.Vector3(2, 0, 0), hasArrow: true },
        { name: 'green', color: 0x00ff00, initialPos: new THREE.Vector3(1, 2, 1), hasArrow: false },
        { name: 'blue', color: 0x0000ff, initialPos: new THREE.Vector3(0, 0, 2), hasArrow: true }
    ];

    pointsConfig.forEach(config => {
        // Create the dot (sphere)
        const geometry = new THREE.SphereGeometry(0.2, 32, 16);
        const material = new THREE.MeshStandardMaterial({ color: config.color });
        const sphere = new THREE.Mesh(geometry, material);
        sphere.position.copy(config.initialPos);
        sphere.userData.name = config.name; // Store name for identification
        pointObjects[config.name] = sphere; // Store reference by name
        scene.add(sphere);
        draggableObjects.push(sphere);

        // Create an arrow if configured
        if (config.hasArrow) {
            const origin = new THREE.Vector3(0, 0, 0);
            const dir = sphere.position.clone().normalize();
            const length = config.initialPos.length();
            const arrow = new THREE.ArrowHelper(dir, origin, length, config.color, 0.3, 0.2);
            sphere.userData.arrow = arrow; // Link arrow to the sphere
            scene.add(arrow);
        }
    });

    // --- Create Parallelogram ---
    const parallelogramGeo = new THREE.BufferGeometry();
    const pRed = pointObjects.red.position;
    const pBlue = pointObjects.blue.position;
    const vertices = new Float32Array([
        0, 0, 0,                       // v0: origin
        pRed.x, pRed.y, pRed.z,        // v1: red point
        pBlue.x, pBlue.y, pBlue.z,     // v2: blue point
        pRed.x + pBlue.x, pRed.y + pBlue.y, pRed.z + pBlue.z // v3: sum
    ]);
    parallelogramGeo.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    parallelogramGeo.setIndex([0, 2, 1, 1, 2, 3]); // Two triangles: (0,2,1) and (1,2,3)

    const parallelogramMat = new THREE.MeshBasicMaterial({
        color: 0x800080, // Purple
        transparent: true,
        opacity: 0.5,
        side: THREE.DoubleSide
    });
    parallelogram = new THREE.Mesh(parallelogramGeo, parallelogramMat);
    scene.add(parallelogram);

    // --- Create Rotated Point ---
    const rotatedPointGeo = new THREE.SphereGeometry(0.2, 32, 16);
    const rotatedPointMat = new THREE.MeshStandardMaterial({ color: 0xffff00 }); // Yellow
    rotatedPoint = new THREE.Mesh(rotatedPointGeo, rotatedPointMat);

    // Calculate initial position
    const u_initial = pointObjects.red.position.toArray();
    const v_initial = pointObjects.blue.position.toArray();
    const x_initial = pointObjects.green.position.toArray();
    const rotation_initial = applyRotorFromVectors(u_initial, v_initial, x_initial);
    rotatedPoint.position.set(...rotation_initial.rotated);

    scene.add(rotatedPoint);

    // --- Create Rotation Arc ---
    rotationArcGroup = new THREE.Group();

    // Line part of the arc
    const arcLineMaterial = new THREE.LineBasicMaterial({ color: 0x00ffff }); // Cyan
    const arcLineGeometry = new THREE.BufferGeometry();
    arcLine = new THREE.Line(arcLineGeometry, arcLineMaterial);
    rotationArcGroup.add(arcLine);

    // Arrowhead part of the arc
    const arcHeadGeometry = new THREE.ConeGeometry(0.1, 0.3, 16);
    const arcHeadMaterial = new THREE.MeshBasicMaterial({ color: 0x00ffff });
    arcHead = new THREE.Mesh(arcHeadGeometry, arcHeadMaterial);
    rotationArcGroup.add(arcHead);

    scene.add(rotationArcGroup);
    // Draw initial arc
    updateRotationArc(pointObjects.green.position, rotation_initial.axis, rotation_initial.angle, rotatedPoint.position);




    // --- Drag Controls ---
    const dragControls = new DragControls(draggableObjects, camera, renderer.domElement);

    dragControls.addEventListener('dragstart', function (event) {
        orbitControls.enabled = false; // Disable camera rotation while dragging
        event.object.material.emissive.set(0x333333); // Highlight the object
    });

    dragControls.addEventListener('drag', function (event) {
        const draggedObject = event.object;

        // Update arrow if it exists
        if (draggedObject.userData.arrow) {
            const arrow = draggedObject.userData.arrow;
            const position = draggedObject.position;
            arrow.setDirection(position.clone().normalize());
            arrow.setLength(position.length(), 0.3, 0.2);
        }

        // Update parallelogram if red or blue point is dragged
        if (draggedObject.userData.name === 'red' || draggedObject.userData.name === 'blue') {
            const pRed = pointObjects.red.position;
            const pBlue = pointObjects.blue.position;
            const positions = parallelogram.geometry.attributes.position.array;

            // Update v1 (red)
            positions[3] = pRed.x; positions[4] = pRed.y; positions[5] = pRed.z;
            // Update v2 (blue)
            positions[6] = pBlue.x; positions[7] = pBlue.y; positions[8] = pBlue.z;
            // Update v3 (sum)
            positions[9] = pRed.x + pBlue.x;
            positions[10] = pRed.y + pBlue.y;
            positions[11] = pRed.z + pBlue.z;

            parallelogram.geometry.attributes.position.needsUpdate = true;
        }

        // Update the rotated point's position regardless of which point was dragged
        const u = pointObjects.red.position.toArray();
        const v = pointObjects.blue.position.toArray();
        const x = pointObjects.green.position.toArray();
        const rotationData = applyRotorFromVectors(u, v, x);
        rotatedPoint.position.set(...rotationData.rotated);
        updateRotationArc(pointObjects.green.position, rotationData.axis, rotationData.angle, rotatedPoint.position);

    });

    dragControls.addEventListener('dragend', function (event) {
        orbitControls.enabled = true; // Re-enable camera rotation
        event.object.material.emissive.set(0x000000); // Remove highlight
    });

    // --- Handle Window Resize ---
    window.addEventListener('resize', onWindowResize);

    // --- Animation Loop ---
    animate();
}

function onWindowResize() {
    const container = document.getElementById('3d-container');
    if (container) {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    }
}

function animate() {
    requestAnimationFrame(animate);
    orbitControls.update();
    renderer.render(scene, camera);
}

function updateRotationArc(startPoint, axis, angle, endPoint) {
    const arcPoints = [];
    const segments = 32;
    const axisVector = new THREE.Vector3(...axis);

    if (angle < 1e-10) {
        arcLine.geometry.setFromPoints([]);
        arcHead.visible = false;
        return;
    }

    arcHead.visible = true;
    for (let i = 0; i <= segments; i++) {
        const t = i / segments;
        const currentAngle = angle * t;
        const pointOnArc = startPoint.clone().applyAxisAngle(axisVector, currentAngle);
        arcPoints.push(pointOnArc);
    }
    arcLine.geometry.setFromPoints(arcPoints);

    // Point the cone along the tangent of the arc.
    // The tangent is perpendicular to the rotation axis and the position vector.
    const tangent = new THREE.Vector3().crossVectors(axisVector, endPoint).normalize();
    arcHead.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), tangent);

    // Update arrowhead position to be at the end of the arc, offset by half its height
    const coneHeight = arcHead.geometry.parameters.height;
    const offset = tangent.clone().multiplyScalar(coneHeight / 2);
    arcHead.position.copy(endPoint).sub(offset);
}

// Given two vectors u = (r1, s1, t1) and v = (r2, s2, t2)
// Returns the rotated point x' = rxr† where r = exp(u ∧ v)
function applyRotorFromVectors(u, v, x) {
	const [r1, s1, t1] = u;
	const [r2, s2, t2] = v;
	const [x1, x2, x3] = x;

	// Step 1: Calculate bivector B = u ∧ v
	const B12 = r1 * s2 - s1 * r2;  // e1∧e2 component
	const B23 = s1 * t2 - t1 * s2;  // e2∧e3 component
	const B13 = r1 * t2 - t1 * r2;  // e1∧e3 component

	// Step 2: Calculate θ = ||B||
	const theta = Math.sqrt(B12 * B12 + B23 * B23 + B13 * B13);

	// Handle zero rotation case
	if (theta < 1e-10) {
		return { rotated: [x1, x2, x3], axis: [0, 1, 0], angle: 0 };
	}

	// Step 3: The bivector in 3D corresponds to a dual vector (axis of rotation)
	// In Cl(3), the bivector (B12, B23, B13) dualizes to axis (-B23, B13, -B12)
	const axis_x = -B23 / theta;
	const axis_y = B13 / theta;
	const axis_z = -B12 / theta;

	// Step 4: Use Rodrigues' rotation formula
	// x' = x*cos(θ) + (axis × x)*sin(θ) + axis*(axis·x)*(1-cos(θ))
	const cosTheta = Math.cos(theta);
	const sinTheta = Math.sin(theta);

	// axis · x
	const axis_dot_x = axis_x * x1 + axis_y * x2 + axis_z * x3;

	// axis × x
	const cross_x = axis_y * x3 - axis_z * x2;
	const cross_y = axis_z * x1 - axis_x * x3;
	const cross_z = axis_x * x2 - axis_y * x1;

	// Apply Rodrigues formula
	const x_prime_1 = x1 * cosTheta + cross_x * sinTheta + axis_x * axis_dot_x * (1 - cosTheta);
	const x_prime_2 = x2 * cosTheta + cross_y * sinTheta + axis_y * axis_dot_x * (1 - cosTheta);
	const x_prime_3 = x3 * cosTheta + cross_z * sinTheta + axis_z * axis_dot_x * (1 - cosTheta);

	return {
		rotated: [x_prime_1, x_prime_2, x_prime_3],
		axis: [axis_x, axis_y, axis_z],
		angle: theta % (2 * Math.PI)
	};
}

// --- Initialize only when the tab is shown ---
const researchTab = document.getElementById('current-research-tab');
let isInitialized = false;

researchTab.addEventListener('shown.bs.tab', function () {
    if (!isInitialized) {
        init();
        isInitialized = true;
    }
    // Ensure the renderer resizes correctly when tab becomes visible
    onWindowResize();
});

// Check if the tab is already active on page load
if (researchTab.classList.contains('active')) {
    if (!isInitialized) {
        init();
        isInitialized = true;
    }
}