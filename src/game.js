const canvas = document.getElementById("game");
const engine = new BABYLON.Engine(canvas, true, { antialias: true, preserveDrawingBuffer: true });
const scene = new BABYLON.Scene(engine);
scene.clearColor = new BABYLON.Color4(0.68, 0.79, 0.78, 1);
scene.fogMode = BABYLON.Scene.FOGMODE_EXP2;
scene.fogDensity = 0.0025;
scene.fogColor = new BABYLON.Color3(0.68, 0.79, 0.78);

const camera = new BABYLON.ArcRotateCamera(
  "thirdPersonCamera", -1.4, 1.28, 19,
  new BABYLON.Vector3(0, 1.2, -15), scene
);
camera.lowerRadiusLimit = 15;
camera.upperRadiusLimit = 26;
camera.panningSensibility = 0;
scene.activeCamera = camera;

const sun = new BABYLON.HemisphericLight("skyLight", new BABYLON.Vector3(-0.3, 1, 0.2), scene);
sun.intensity = 0.92;
const warmLight = new BABYLON.DirectionalLight("lateSun", new BABYLON.Vector3(0.45, -1, 0.25), scene);
warmLight.position = new BABYLON.Vector3(-30, 45, -20);
warmLight.intensity = 0.48;

function mat(name, hex, options = {}) {
  const material = new BABYLON.StandardMaterial(name, scene);
  material.diffuseColor = BABYLON.Color3.FromHexString(hex);
  if (options.emissive) material.emissiveColor = BABYLON.Color3.FromHexString(options.emissive);
  if (options.alpha !== undefined) material.alpha = options.alpha;
  material.specularColor = options.specular ? BABYLON.Color3.FromHexString(options.specular) : new BABYLON.Color3(0.08, 0.07, 0.06);
  return material;
}

const colors = {
  asphalt: mat("asphalt", "#434947"),
  sidewalk: mat("sidewalk", "#c8bca4"),
  curb: mat("curb", "#e2d6bd"),
  lane: mat("lane", "#e8c65b", { emissive: "#4a3d18" }),
  glass: mat("shopGlass", "#6c9690", { emissive: "#253e3a" }),
  frame: mat("windowFrame", "#eee1c8"),
  roof: mat("roof", "#9c5741"),
  awning: mat("awning", "#d97c59"),
  tree: mat("treeLeaves", "#50734a"),
  trunk: mat("treeTrunk", "#70523c"),
  planter: mat("planter", "#a56954"),
  scooter: mat("scooter", "#d9e4da"),
  wheel: mat("rubber", "#252a29"),
  metal: mat("metal", "#c5bba5"),
  cart: mat("cartPaint", "#bb694d"),
  mission: mat("mission", "#ffd34d", { emissive: "#a67a18" }),
};

function paintedPlaster(name, hex) {
  const texture = new BABYLON.DynamicTexture(`${name}_brushTexture`, { width: 512, height: 512 }, scene, false);
  const ctx = texture.getContext();
  ctx.fillStyle = hex; ctx.fillRect(0, 0, 512, 512);
  let seed = [...name].reduce((sum, char) => sum + char.charCodeAt(0), 103);
  const random = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
  const base = hex.replace("#", "");
  const rgb = [0, 2, 4].map(index => parseInt(base.slice(index, index + 2), 16));
  for (let i = 0; i < 180; i++) {
    const factor = random() > 0.48 ? 1.22 : 0.72;
    const [r, g, b] = rgb.map(channel => Math.max(0, Math.min(255, Math.round(channel * factor))));
    ctx.strokeStyle = `rgba(${r},${g},${b},${0.09 + random() * 0.13})`;
    ctx.lineWidth = 7 + random() * 20;
    ctx.lineCap = "round";
    const x = random() * 512, y = random() * 512;
    ctx.beginPath(); ctx.moveTo(x, y);
    ctx.lineTo(x + (random() - 0.5) * 160, y + (random() - 0.5) * 46);
    ctx.stroke();
  }
  // Broad, irregular paint remnants give the wall a hand-painted game-art feel.
  for (let i = 0; i < 12; i++) {
    const palette = ["#d9c9a7", "#71877a", "#b76955", "#514f48"];
    ctx.fillStyle = palette[Math.floor(random() * palette.length)];
    ctx.globalAlpha = 0.08 + random() * 0.11;
    ctx.beginPath();
    ctx.ellipse(random() * 512, 200 + random() * 300, 14 + random() * 58, 8 + random() * 26, random() * Math.PI, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
  texture.update();
  const material = new BABYLON.StandardMaterial(name, scene);
  material.diffuseTexture = texture;
  material.diffuseColor = BABYLON.Color3.White();
  material.specularColor = new BABYLON.Color3(0.045, 0.04, 0.035);
  return material;
}

function box(name, size, position, material, parent = null) {
  const mesh = BABYLON.MeshBuilder.CreateBox(name, size, scene);
  mesh.position.copyFrom(position);
  mesh.material = material;
  if (parent) mesh.parent = parent;
  return mesh;
}
function cylinder(name, diameter, height, position, material, parent = null, tessellation = 12) {
  const mesh = BABYLON.MeshBuilder.CreateCylinder(name, { diameter, height, tessellation }, scene);
  mesh.position.copyFrom(position);
  mesh.material = material;
  if (parent) mesh.parent = parent;
  return mesh;
}

// The road corner: a north-south street with an east-west cross street.
const terrain = BABYLON.MeshBuilder.CreateGround("neighborhoodGround", { width: 100, height: 100 }, scene);
terrain.position.y = -0.14;
terrain.material = mat("warmGround", "#75866a");
box("mainRoad", { width: 13, height: 0.18, depth: 94 }, new BABYLON.Vector3(0, -0.02, 0), colors.asphalt);
box("crossRoad", { width: 66, height: 0.19, depth: 13 }, new BABYLON.Vector3(0, -0.01, 5), colors.asphalt);
for (const side of [-1, 1]) {
  box(`sidewalk_${side}`, { width: 5.2, height: 0.46, depth: 94 }, new BABYLON.Vector3(side * 9.1, 0.16, 0), colors.sidewalk);
  box(`curb_${side}`, { width: 0.34, height: 0.42, depth: 94 }, new BABYLON.Vector3(side * 6.55, 0.17, 0), colors.curb);
}
// Lane dashes and a crosswalk make the intersection legible from the camera.
for (let z = -41; z <= 42; z += 10) {
  box(`laneDash_${z}`, { width: 0.16, height: 0.035, depth: 4 }, new BABYLON.Vector3(0, 0.09, z), colors.lane);
}
for (let x = -5.1; x <= 5.1; x += 1.45) {
  box(`crosswalk_${x}`, { width: 0.82, height: 0.035, depth: 5.2 }, new BABYLON.Vector3(x, 0.105, -0.1), colors.curb);
}

function addSign(x, z, label, hex, side) {
  const plane = BABYLON.MeshBuilder.CreatePlane(`sign_${label}`, { width: 4.2, height: 0.72 }, scene);
  plane.position.set(x, 6.35, z);
  plane.rotation.y = side > 0 ? -Math.PI / 2 : Math.PI / 2;
  const tex = new BABYLON.DynamicTexture(`signTexture_${label}`, { width: 840, height: 144 }, scene, false);
  const ctx = tex.getContext();
  ctx.fillStyle = hex;
  ctx.fillRect(0, 0, 840, 144);
  ctx.fillStyle = "#fff4dd";
  ctx.font = "bold 62px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(label, 420, 75);
  tex.update();
  const signMat = new BABYLON.StandardMaterial(`signMat_${label}`, scene);
  signMat.diffuseTexture = tex;
  signMat.emissiveColor = new BABYLON.Color3(0.18, 0.14, 0.1);
  signMat.backFaceCulling = false;
  plane.material = signMat;
}

function addShopHouse(x, z, label, facadeHex, signHex) {
  const side = Math.sign(x);
  const baseX = x;
  const facade = paintedPlaster(`facade_${label}`, facadeHex);
  const building = box(`shopHouse_${label}`, { width: 7.2, height: 9.2, depth: 10.4 }, new BABYLON.Vector3(baseX, 4.72, z), facade);
  building.material = facade;
  const faceX = baseX - side * 3.66;
  box(`roof_${label}`, { width: 7.6, height: 0.48, depth: 10.8 }, new BABYLON.Vector3(baseX, 9.55, z), colors.roof);
  // Ground-floor shop glass and upper-floor windows face the street.
  for (const offset of [-2.55, 2.55]) {
    box(`shopWindow_${label}_${offset}`, { width: 0.12, height: 2.15, depth: 2.2 }, new BABYLON.Vector3(faceX, 1.62, z + offset), colors.glass);
    box(`upperWindow_${label}_${offset}`, { width: 0.13, height: 1.75, depth: 1.9 }, new BABYLON.Vector3(faceX, 4.9, z + offset), colors.glass);
    box(`upperFrame_${label}_${offset}`, { width: 0.17, height: 0.15, depth: 2.25 }, new BABYLON.Vector3(faceX, 5.82, z + offset), colors.frame);
    box(`balconyRail_${label}_${offset}`, { width: 0.35, height: 0.12, depth: 2.1 }, new BABYLON.Vector3(faceX - side * 0.25, 4.1, z + offset), colors.metal);
  }
  box(`door_${label}`, { width: 0.14, height: 2.35, depth: 1.05 }, new BABYLON.Vector3(faceX, 1.48, z), mat(`doorMat_${label}`, "#735345"));
  box(`awning_${label}`, { width: 1.25, height: 0.22, depth: 5.8 }, new BABYLON.Vector3(faceX - side * 0.62, 2.95, z), colors.awning);
  addSign(faceX - side * 0.12, z, label, signHex, side);
}

addShopHouse(-12.8, -18, "TẠP HÓA", "#e8bd89", "#a84c3d");
addShopHouse(-12.8, 0, "BÁNH MÌ", "#d6a478", "#347565");
addShopHouse(-12.8, 18, "CÀ PHÊ", "#d7c9a5", "#6c5143");
addShopHouse(-12.8, 36, "QUÁN NHỎ", "#c8b29b", "#7b573d");
addShopHouse(12.8, -18, "TIỆM MAY", "#b8c7ae", "#536c55");
addShopHouse(12.8, 0, "HẺM 18", "#d8a08a", "#a44e4a");
addShopHouse(12.8, 18, "NHÀ THUỐC", "#d6d0b4", "#4c7974");
addShopHouse(12.8, 36, "TIỆM SÁCH", "#d8b08b", "#5a6f61");
const houseDoorPoints = [-18, 0, 18, 36].flatMap(z => [-1, 1].map(side => new BABYLON.Vector3(-side * 6.7, 0, z)));

// Street trees, pots, a sidewalk food cart, and parked scooters establish neighborhood scale.
function addTree(x, z) {
  cylinder("treeTrunk", 0.42, 3.1, new BABYLON.Vector3(x, 1.75, z), colors.trunk);
  const crown = BABYLON.MeshBuilder.CreateSphere("treeCrown", { diameter: 4.1, segments: 10 }, scene);
  crown.position.set(x, 4.3, z);
  crown.scaling.y = 0.82;
  crown.material = colors.tree;
  cylinder("treePlanter", 1.5, 0.7, new BABYLON.Vector3(x, 0.52, z), colors.planter);
}
for (const x of [-8.4, 8.4]) for (const z of [-34, -4, 27]) addTree(x, z);

function addScooter(x, z, hue) {
  const root = new BABYLON.TransformNode("parkedScooter", scene);
  root.position.set(x, 0.31, z);
  const paint = mat(`scooter_${x}_${z}`, hue);
  for (const offset of [-0.68, 0.68]) {
    const wheel = cylinder(`scooterWheel_${offset}`, 0.62, 0.16, new BABYLON.Vector3(0, 0, offset), colors.wheel, root, 16);
    wheel.rotation.z = Math.PI / 2;
  }
  box("scooterBody", { width: 0.42, height: 0.54, depth: 1.2 }, new BABYLON.Vector3(0, 0.38, 0), paint, root);
  box("scooterSeat", { width: 0.55, height: 0.14, depth: 0.65 }, new BABYLON.Vector3(0, 0.72, -0.16), colors.wheel, root);
  box("scooterHandle", { width: 1.05, height: 0.09, depth: 0.1 }, new BABYLON.Vector3(0, 0.84, 0.62), colors.metal, root);
  return root;
}
const scooters = [
  addScooter(-7.4, -9, "#d6e1d8"),
  addScooter(7.2, 12, "#d75845"),
  addScooter(3.1, -13.5, "#d99c45"),
];

// A small bánh mì cart at the pickup corner.
box("cartCounter", { width: 1.7, height: 1.05, depth: 2.2 }, new BABYLON.Vector3(-5.8, 1.0, 5.2), colors.cart);
box("cartCanopy", { width: 2.25, height: 0.18, depth: 2.7 }, new BABYLON.Vector3(-5.8, 2.4, 5.2), mat("cartCanopy", "#d1a34f"));
box("cartGlass", { width: 0.08, height: 0.7, depth: 1.55 }, new BABYLON.Vector3(-4.92, 1.5, 5.2), colors.glass);
for (const z of [4.55, 5.85]) cylinder("cartWheel", 0.48, 0.16, new BABYLON.Vector3(-5.8, 0.55, z), colors.wheel);

// A small walk-in shop interior, enabled only while the player is inside.
const houseInterior = new BABYLON.TransformNode("banhMiShopInterior", scene);
houseInterior.position.set(-32, 0, 0);
const insideWall = mat("insideWall", "#b9a48a");
const insideWood = mat("insideWood", "#765843");
const insideTile = mat("insideTile", "#c7b99f");
box("interiorFloor", { width: 12, height: 0.18, depth: 10 }, new BABYLON.Vector3(0, -0.09, 0), insideTile, houseInterior);
box("interiorBackWall", { width: 0.22, height: 6, depth: 10 }, new BABYLON.Vector3(-6, 3, 0), insideWall, houseInterior);
box("interiorFrontWall", { width: 0.22, height: 6, depth: 10 }, new BABYLON.Vector3(6, 3, 0), insideWall, houseInterior);
box("interiorLeftWall", { width: 12, height: 6, depth: 0.22 }, new BABYLON.Vector3(0, 3, -5), insideWall, houseInterior);
box("interiorRightWall", { width: 12, height: 6, depth: 0.22 }, new BABYLON.Vector3(0, 3, 5), insideWall, houseInterior);
box("interiorCounter", { width: 1.1, height: 0.95, depth: 3.3 }, new BABYLON.Vector3(3.9, 0.48, 0.3), insideWood, houseInterior);
box("interiorCounterTop", { width: 1.35, height: 0.12, depth: 3.55 }, new BABYLON.Vector3(3.75, 1.02, 0.3), colors.cart, houseInterior);
box("interiorShelf", { width: 0.28, height: 2.2, depth: 3.1 }, new BABYLON.Vector3(-5.55, 2.4, -2.2), insideWood, houseInterior);
for (const y of [1.65, 2.45, 3.25]) box(`interiorShelfBoard_${y}`, { width: 0.42, height: 0.08, depth: 3.3 }, new BABYLON.Vector3(-5.25, y, -2.2), colors.frame, houseInterior);
box("interiorBench", { width: 2.4, height: 0.48, depth: 0.55 }, new BABYLON.Vector3(-1.2, 0.27, -3.75), insideWood, houseInterior);
box("interiorDoor", { width: 0.1, height: 2.6, depth: 1.35 }, new BABYLON.Vector3(5.82, 1.3, 0), mat("interiorDoorMat", "#775642"), houseInterior);
const insideLampMaterial = mat("insideLamp", "#f0c870", { emissive: "#b57e32" });
const insideLamp = BABYLON.MeshBuilder.CreateSphere("interiorLamp", { diameter: 0.42, segments: 10 }, scene);
insideLamp.parent = houseInterior; insideLamp.position.set(0, 5.35, 0); insideLamp.material = insideLampMaterial;
const interiorLight = new BABYLON.PointLight("interiorWarmLight", new BABYLON.Vector3(-32, 4.8, 0), scene);
interiorLight.diffuse = BABYLON.Color3.FromHexString("#ffc979");
interiorLight.intensity = 0.75;
interiorLight.range = 14;
interiorLight.setEnabled(false);
houseInterior.setEnabled(false);

// A small procedural 3D character with articulated limbs and a readable face.
const player = new BABYLON.TransformNode("player", scene);
player.position.set(0, 0, -19);
const characterMaterials = {
  skin: mat("characterSkin", "#dcab87"),
  shirt: mat("characterJacket", "#737a63"),
  undershirt: mat("characterUndershirt", "#d8c3a1"),
  scarf: mat("characterScarf", "#a95743"),
  pants: mat("characterPants", "#394554"),
  shoes: mat("characterShoes", "#e8dfcd"),
  hair: mat("characterHair", "#302b2b"),
  eyes: mat("characterEyes", "#262321"),
  bag: mat("characterBag", "#596044"),
  strap: mat("characterStrap", "#596044"),
};
function characterMesh(name, mesh, position, material, parent = player) {
  mesh.name = name;
  mesh.position.copyFrom(position);
  mesh.material = material;
  mesh.parent = parent;
  return mesh;
}
function characterBox(name, size, position, material, parent = player) {
  return characterMesh(name, BABYLON.MeshBuilder.CreateBox(name, size, scene), position, material, parent);
}
function characterSphere(name, diameter, position, material, parent = player) {
  return characterMesh(name, BABYLON.MeshBuilder.CreateSphere(name, { diameter, segments: 12 }, scene), position, material, parent);
}
function characterCapsule(name, height, diameter, position, material, parent = player) {
  return characterMesh(name, BABYLON.MeshBuilder.CreateCapsule(name, { height, radius: diameter / 2, tessellation: 10 }, scene), position, material, parent);
}

const characterUpperBody = new BABYLON.TransformNode("characterUpperBodyPivot", scene);
characterUpperBody.parent = player;
characterUpperBody.position.y = 1.06;
const coatTorso = characterCapsule("softCoatTorso", 0.96, 0.72, new BABYLON.Vector3(0, 0.35, 0), characterMaterials.shirt, characterUpperBody);
coatTorso.scaling.set(1.02, 1.05, 0.82);
characterSphere("roundedCoatHem", 0.62, new BABYLON.Vector3(0, 0.06, 0), characterMaterials.shirt, characterUpperBody).scaling.set(1.02, 0.28, 0.62);
characterBox("warmUndershirt", { width: 0.2, height: 0.58, depth: 0.04 }, new BABYLON.Vector3(0, 0.42, 0.29), characterMaterials.undershirt, characterUpperBody);
characterSphere("softScarf", 0.2, new BABYLON.Vector3(0, 0.69, 0.28), characterMaterials.scarf, characterUpperBody).scaling.set(0.62, 1.8, 0.45);
characterSphere("neck", 0.23, new BABYLON.Vector3(0, 0.8, 0.015), characterMaterials.skin, characterUpperBody).scaling.y = 0.75;
const characterHead = characterSphere("head", 0.56, new BABYLON.Vector3(0, 1.07, 0.02), characterMaterials.skin, characterUpperBody);
characterHead.scaling.set(0.9, 1.05, 0.82);
characterSphere("hairCap", 0.53, new BABYLON.Vector3(0, 1.25, -0.015), characterMaterials.hair, characterUpperBody).scaling.set(0.95, 0.73, 0.9);
characterSphere("fringe", 0.28, new BABYLON.Vector3(0, 1.27, 0.17), characterMaterials.hair, characterUpperBody).scaling.set(1.15, 0.42, 0.55);
for (const side of [-1, 1]) {
  characterSphere(`ear_${side}`, 0.105, new BABYLON.Vector3(side * 0.215, 1.04, 0.015), characterMaterials.skin, characterUpperBody);
  characterSphere(`eyeWhite_${side}`, 0.07, new BABYLON.Vector3(side * 0.082, 1.09, 0.232), characterMaterials.shoes, characterUpperBody);
  characterSphere(`eye_${side}`, 0.038, new BABYLON.Vector3(side * 0.082, 1.09, 0.267), characterMaterials.eyes, characterUpperBody);
}
characterSphere("nose", 0.065, new BABYLON.Vector3(0, 1.015, 0.25), characterMaterials.skin, characterUpperBody).scaling.set(0.72, 0.8, 0.75);
characterBox("mouth", { width: 0.09, height: 0.018, depth: 0.014 }, new BABYLON.Vector3(0, 0.95, 0.235), characterMaterials.eyes, characterUpperBody);
// Cross-body sling bag sits behind the torso, with its strap visible across the chest.
const satchel = characterCapsule("roundedMessengerBag", 0.42, 0.38, new BABYLON.Vector3(0.25, 0.1, -0.23), characterMaterials.bag, characterUpperBody);
satchel.scaling.set(0.95, 1, 0.65);
const strap = characterBox("bagStrap", { width: 0.075, height: 0.98, depth: 0.045 }, new BABYLON.Vector3(-0.1, 0.44, 0.19), characterMaterials.strap, characterUpperBody);
strap.rotation.z = -0.38;

const leftArm = new BABYLON.TransformNode("leftArmPivot", scene);
leftArm.parent = characterUpperBody; leftArm.position.set(-0.37, 0.66, 0);
const rightArm = new BABYLON.TransformNode("rightArmPivot", scene);
rightArm.parent = characterUpperBody; rightArm.position.set(0.37, 0.66, 0);
const leftLeg = new BABYLON.TransformNode("leftLegPivot", scene);
leftLeg.parent = player; leftLeg.position.set(-0.17, 1.02, 0);
const rightLeg = new BABYLON.TransformNode("rightLegPivot", scene);
rightLeg.parent = player; rightLeg.position.set(0.17, 1.02, 0);
for (const [name, pivot] of [["leftArm", leftArm], ["rightArm", rightArm]]) {
  characterCapsule(`${name}Sleeve`, 0.56, 0.2, new BABYLON.Vector3(0, -0.26, 0), characterMaterials.shirt, pivot);
  characterCapsule(`${name}Forearm`, 0.52, 0.14, new BABYLON.Vector3(0, -0.69, 0.01), characterMaterials.skin, pivot);
  characterSphere(`${name}Hand`, 0.16, new BABYLON.Vector3(0, -0.98, 0.04), characterMaterials.skin, pivot);
}
for (const [name, pivot] of [["leftLeg", leftLeg], ["rightLeg", rightLeg]]) {
  characterCapsule(`${name}Pants`, 0.86, 0.24, new BABYLON.Vector3(0, -0.43, 0), characterMaterials.pants, pivot);
  const shoe = characterCapsule(`${name}Sneaker`, 0.34, 0.18, new BABYLON.Vector3(0, -0.88, 0.075), characterMaterials.shoes, pivot);
  shoe.scaling.set(0.75, 0.58, 1.55);
}
let animationMode = "idle";
let characterYaw = 0;
let walkPhase = 0;
let characterMotionBlend = 0;
const mintMaterial = mat("characterMotionGlow", "#68e0b0", { alpha: 0.42, emissive: "#3bcf99" });
const motionRingA = BABYLON.MeshBuilder.CreateTorus("characterMotionRingA", { diameter: 1.75, thickness: 0.035, tessellation: 32 }, scene);
motionRingA.parent = player; motionRingA.position.y = 1.35; motionRingA.rotation.x = 0.85; motionRingA.material = mintMaterial; motionRingA.isVisible = false;
const motionRingB = BABYLON.MeshBuilder.CreateTorus("characterMotionRingB", { diameter: 1.8, thickness: 0.025, tessellation: 32 }, scene);
motionRingB.parent = player; motionRingB.position.y = 1.35; motionRingB.rotation.z = 1.0; motionRingB.material = mintMaterial; motionRingB.isVisible = false;
const motionOrbA = characterSphere("characterMotionOrbA", 0.11, new BABYLON.Vector3(0.88, 1.35, 0), mintMaterial);
const motionOrbB = characterSphere("characterMotionOrbB", 0.085, new BABYLON.Vector3(-0.82, 1.35, 0), mintMaterial);
motionOrbA.isVisible = false; motionOrbB.isVisible = false;

// One short delivery loop: collect a parcel at the bánh mì cart and deliver it by the alley.
const pickupPoint = new BABYLON.Vector3(-4.1, 0.24, 5.2);
const deliveryPoint = new BABYLON.Vector3(3.7, 0.24, 22);
const marker = BABYLON.MeshBuilder.CreateTorus("missionRing", { diameter: 2.4, thickness: 0.14, tessellation: 40 }, scene);
marker.position.copyFrom(pickupPoint);
marker.material = colors.mission;
const markerGlow = cylinder("missionGlow", 1.7, 0.08, new BABYLON.Vector3(pickupPoint.x, 0.08, pickupPoint.z), mat("missionGlowMat", "#f7d04d", { alpha: 0.28, emissive: "#9b791d" }), null, 32);
marker.isVisible = false;
markerGlow.isVisible = false;

const startScreen = document.getElementById("startScreen");
const finishScreen = document.getElementById("finishScreen");
const playButton = document.getElementById("playButton");
const restartButton = document.getElementById("restartButton");
const topHud = document.getElementById("topHud");
const missionPanel = document.getElementById("missionPanel");
const controls = document.getElementById("controls");
const objective = document.getElementById("objective");
const status = document.getElementById("status");
const prompt = document.getElementById("interactionPrompt");
const toast = document.getElementById("toast");
const missionStep = document.getElementById("missionStep");
const clockLabel = document.getElementById("clockLabel");
const keys = Object.create(null);
let playing = false;
let missionStage = 0;
let startTime = 0;
let toastUntil = 0;
let isInsideHouse = false;
let isDriving = false;
let currentScooter = null;
let currentGroundHeight = 0;
let savedStreetVisibility = null;
let streetReturnPosition = null;

function moveMarker(point, show = true) {
  marker.position.copyFrom(point);
  markerGlow.position.set(point.x, 0.08, point.z);
  marker.isVisible = show;
  markerGlow.isVisible = show;
}
function animateCharacter(mode, dt, groundHeight = 0) {
  animationMode = mode;
  if (mode === "ride") {
    leftLeg.rotation.x = rightLeg.rotation.x = 0.72;
    leftArm.rotation.x = rightArm.rotation.x = -1.08;
    characterUpperBody.rotation.x = 0.04;
    characterUpperBody.rotation.z = 0;
    player.position.y = groundHeight;
    motionRingA.isVisible = motionRingB.isVisible = motionOrbA.isVisible = motionOrbB.isVisible = false;
    return;
  }
  const moving = mode !== "idle";
  const phaseRate = mode === "run" ? 13 : 8;
  if (moving) walkPhase += dt * phaseRate;
  const targetBlend = moving ? 1 : 0;
  characterMotionBlend += (targetBlend - characterMotionBlend) * (1 - Math.exp(-dt * 8));
  const runBlend = mode === "run" ? 1 : 0;
  const stride = (mode === "run" ? 0.88 : 0.55) * characterMotionBlend;
  const swing = Math.sin(walkPhase) * stride;
  const idleSway = Math.sin(performance.now() / 710) * 0.025 * (1 - characterMotionBlend);
  leftLeg.rotation.x = swing;
  rightLeg.rotation.x = -swing;
  leftArm.rotation.x = -swing * 0.82;
  rightArm.rotation.x = swing * 0.82;
  characterUpperBody.rotation.x = 0.045 + runBlend * 0.12 * characterMotionBlend + idleSway;
  characterUpperBody.rotation.z = Math.sin(walkPhase * 0.5) * 0.035 * characterMotionBlend;
  characterUpperBody.position.y = 1.06 + Math.sin(walkPhase * 2) * 0.025 * characterMotionBlend + Math.sin(performance.now() / 520) * 0.012;
  characterHead.rotation.z = Math.sin(walkPhase * 0.5 + 0.8) * 0.025 * characterMotionBlend;
  player.position.y = groundHeight + Math.abs(Math.sin(walkPhase * 2)) * (mode === "run" ? 0.07 : 0.035) * characterMotionBlend;
  motionRingA.isVisible = motionRingB.isVisible = motionOrbA.isVisible = motionOrbB.isVisible = characterMotionBlend > 0.12;
  motionRingA.rotation.y += dt * (mode === "run" ? 2.2 : 1.15);
  motionRingB.rotation.y -= dt * (mode === "run" ? 1.6 : 0.85);
  const orbitTime = performance.now() / 1000;
  motionOrbA.position.set(Math.cos(orbitTime * 1.9) * 0.86, 1.35 + Math.sin(orbitTime * 2.4) * 0.38, Math.sin(orbitTime * 1.9) * 0.42);
  motionOrbB.position.set(Math.cos(orbitTime * 1.45 + Math.PI) * 0.83, 1.35 + Math.sin(orbitTime * 1.8 + 1) * 0.34, Math.sin(orbitTime * 1.45 + Math.PI) * 0.4);
}
function showToast(message) {
  toast.textContent = message;
  toast.classList.add("visible");
  toastUntil = performance.now() + 2200;
}
function distance2D(a, b) {
  return Math.hypot(a.x - b.x, a.z - b.z);
}
function enterHouse(returnPosition) {
  isInsideHouse = true;
  streetReturnPosition = returnPosition.clone();
  savedStreetVisibility = scene.meshes.map(mesh => [mesh, mesh.isVisible]);
  for (const mesh of scene.meshes) mesh.isVisible = false;
  for (const mesh of player.getChildMeshes()) mesh.isVisible = true;
  for (const mesh of houseInterior.getChildMeshes()) mesh.isVisible = true;
  houseInterior.setEnabled(true);
  interiorLight.setEnabled(true);
  player.position.set(-32, 0, 0);
  player.rotation.y = 0;
  characterYaw = 0;
  currentGroundHeight = 0;
  camera.radius = 4.5;
  camera.lowerRadiusLimit = 3.6;
  camera.upperRadiusLimit = 5.2;
  showToast("Đã vào cửa tiệm. Nhấn E để ra phố.");
}
function exitHouse() {
  isInsideHouse = false;
  houseInterior.setEnabled(false);
  interiorLight.setEnabled(false);
  if (savedStreetVisibility) {
    for (const [mesh, visible] of savedStreetVisibility) mesh.isVisible = visible;
    savedStreetVisibility = null;
  }
  if (streetReturnPosition) {
    player.position.copyFrom(streetReturnPosition);
    currentGroundHeight = streetReturnPosition.y;
    streetReturnPosition = null;
  } else player.position.set(-8.2, currentGroundHeight, 0);
  camera.radius = 19;
  camera.lowerRadiusLimit = 15;
  camera.upperRadiusLimit = 26;
  showToast("Đã ra lại góc phố.");
}
function enterScooter(scooter) {
  isDriving = true;
  currentScooter = scooter;
  characterYaw = scooter.rotation.y;
  player.rotation.y = characterYaw;
    player.position.set(scooter.position.x, 0.26, scooter.position.z);
  camera.radius = 23;
  camera.lowerRadiusLimit = 18;
  camera.upperRadiusLimit = 30;
  showToast("Đã lên xe. W tăng ga, A/D bẻ lái, E xuống xe.");
}
function exitScooter() {
  isDriving = false;
  player.position.set(currentScooter.position.x + 1.1, currentGroundHeight, currentScooter.position.z);
  currentScooter = null;
  camera.radius = 19;
  camera.lowerRadiusLimit = 15;
  camera.upperRadiusLimit = 26;
  showToast("Đã xuống xe.");
}
function startGame() {
  if (savedStreetVisibility) {
    for (const [mesh, visible] of savedStreetVisibility) mesh.isVisible = visible;
    savedStreetVisibility = null;
  }
  toast.classList.remove("visible");
  playing = true;
  missionStage = 0;
  startTime = performance.now();
  player.position.set(0, 0, -19);
  characterYaw = 0; player.rotation.y = 0; walkPhase = 0;
  isInsideHouse = false; isDriving = false; currentScooter = null; currentGroundHeight = 0;
  houseInterior.setEnabled(false); interiorLight.setEnabled(false);
  camera.radius = 19; camera.lowerRadiusLimit = 15; camera.upperRadiusLimit = 26;
  objective.textContent = "Ghé xe bánh mì, nhấn E nhận bưu kiện";
  status.textContent = "ĐƠN HÀNG 1 / 2";
  missionStep.textContent = "01 — NHẬN HÀNG";
  status.classList.remove("complete");
  startScreen.hidden = true;
  finishScreen.hidden = true;
  topHud.hidden = false;
  missionPanel.hidden = false;
  controls.hidden = false;
  prompt.hidden = true;
  moveMarker(pickupPoint);
}
function resetGame() {
  if (savedStreetVisibility) {
    for (const [mesh, visible] of savedStreetVisibility) mesh.isVisible = visible;
    savedStreetVisibility = null;
  }
  toast.classList.remove("visible");
  playing = true;
  missionStage = 0;
  startTime = performance.now();
  player.position.set(0, 0, -19);
  characterYaw = 0; player.rotation.y = 0; walkPhase = 0;
  isInsideHouse = false; isDriving = false; currentScooter = null; currentGroundHeight = 0;
  houseInterior.setEnabled(false); interiorLight.setEnabled(false);
  camera.radius = 19; camera.lowerRadiusLimit = 15; camera.upperRadiusLimit = 26;
  objective.textContent = "Ghé xe bánh mì, nhấn E nhận bưu kiện";
  status.textContent = "ĐƠN HÀNG 1 / 2";
  missionStep.textContent = "01 — NHẬN HÀNG";
  status.classList.remove("complete");
  finishScreen.hidden = true;
  startScreen.hidden = true;
  topHud.hidden = false;
  missionPanel.hidden = false;
  controls.hidden = false;
  prompt.hidden = true;
  moveMarker(pickupPoint);
}
function finishGame() {
  toast.classList.remove("visible");
  missionStage = 2;
  status.textContent = "ĐÃ GIAO HÀNG";
  status.classList.add("complete");
  objective.textContent = "Gói hàng đã tới đúng người.";
  missionStep.textContent = "02 — HOÀN THÀNH";
  prompt.hidden = true;
  moveMarker(deliveryPoint, false);
  const seconds = Math.max(1, Math.floor((performance.now() - startTime) / 1000));
  document.getElementById("finishTime").textContent = `Thời gian: ${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
  finishScreen.hidden = false;
}
function interact() {
  if (!playing) return;
  if (isInsideHouse) { exitHouse(); return; }
  if (isDriving) { exitScooter(); return; }

  const nearestDoor = houseDoorPoints
    .map(point => ({ point, distance: distance2D(player.position, point) }))
    .sort((a, b) => a.distance - b.distance)[0];
  if (nearestDoor && nearestDoor.distance < 3.8) { enterHouse(player.position); return; }
  const nearbyScooter = scooters
    .map(scooter => ({ scooter, distance: distance2D(player.position, scooter.position) }))
    .sort((a, b) => a.distance - b.distance)[0];
  if (nearbyScooter && nearbyScooter.distance < 2.25) { enterScooter(nearbyScooter.scooter); return; }
  if (missionStage > 1) return;
  const point = missionStage === 0 ? pickupPoint : deliveryPoint;
  if (distance2D(player.position, point) > 4.5) {
    showToast("Đi gần điểm đánh dấu hơn rồi nhấn E.");
    return;
  }
  if (missionStage === 0) {
    missionStage = 1;
    objective.textContent = "Mang bưu kiện tới khách ở đầu hẻm";
    status.textContent = "ĐƠN HÀNG 2 / 2";
    missionStep.textContent = "02 — GIAO HÀNG";
    moveMarker(deliveryPoint);
    showToast("Đã nhận bưu kiện. Tìm khách ở đầu hẻm!");
  } else {
    finishGame();
  }
}
playButton.addEventListener("click", startGame);
restartButton.addEventListener("click", resetGame);
window.addEventListener("keydown", event => {
  const key = event.key.toLowerCase();
  if (["w", "a", "s", "d", "shift", "arrowup", "arrowdown", "arrowleft", "arrowright", "r", "e"].includes(key)) event.preventDefault();
  keys[key] = true;
  if (key === "e" && !event.repeat) interact();
  if (key === "r" && !event.repeat && playing) resetGame();
});
window.addEventListener("keyup", event => keys[event.key.toLowerCase()] = false);
window.addEventListener("blur", () => Object.keys(keys).forEach(key => keys[key] = false));

scene.onBeforeRenderObservable.add(() => {
  const dt = Math.min(engine.getDeltaTime() / 1000, 0.05);
  if (playing) {
    if (keys.arrowleft) camera.alpha -= 1.8 * dt;
    if (keys.arrowright) camera.alpha += 1.8 * dt;
  }
  camera.target.set(player.position.x, player.position.y + 1.15, player.position.z + 1.5);
  let forwardInput = playing ? (keys.w || keys.arrowup ? 1 : 0) - (keys.s || keys.arrowdown ? 1 : 0) : 0;
  let rightInput = playing ? (keys.d ? 1 : 0) - (keys.a ? 1 : 0) : 0;
  const magnitude = Math.hypot(forwardInput, rightInput);
  if (isDriving && currentScooter) {
    const steering = (keys.d ? 1 : 0) - (keys.a ? 1 : 0);
    if (steering) currentScooter.rotation.y += steering * dt * 1.9 * (forwardInput < 0 ? -1 : 1);
    const driveForward = new BABYLON.Vector3(Math.sin(currentScooter.rotation.y), 0, Math.cos(currentScooter.rotation.y));
    const driveSpeed = keys.shift ? 15 : 10;
    currentScooter.position.x = BABYLON.Scalar.Clamp(currentScooter.position.x + driveForward.x * forwardInput * driveSpeed * dt, -8.2, 8.2);
    currentScooter.position.z = BABYLON.Scalar.Clamp(currentScooter.position.z + driveForward.z * forwardInput * driveSpeed * dt, -43, 39);
    player.position.set(currentScooter.position.x, 0.26, currentScooter.position.z);
    characterYaw = currentScooter.rotation.y;
    player.rotation.y = characterYaw;
    animateCharacter("ride", dt, 0.26);
  } else if (magnitude > 0) {
    forwardInput /= magnitude;
    rightInput /= magnitude;
    const cameraForward = new BABYLON.Vector3(-Math.cos(camera.alpha), 0, -Math.sin(camera.alpha));
    const cameraRight = new BABYLON.Vector3(cameraForward.z, 0, -cameraForward.x);
    const moveX = cameraForward.x * forwardInput + cameraRight.x * rightInput;
    const moveZ = cameraForward.z * forwardInput + cameraRight.z * rightInput;
    const running = Boolean(keys.shift);
    const targetYaw = Math.atan2(moveX, moveZ);
    const yawDelta = Math.atan2(Math.sin(targetYaw - characterYaw), Math.cos(targetYaw - characterYaw));
    characterYaw += yawDelta * Math.min(1, dt * 11);
    player.rotation.y = characterYaw;
    const speed = running ? 7.0 : 4.6;
    if (isInsideHouse) {
      player.position.x = BABYLON.Scalar.Clamp(player.position.x + moveX * speed * dt, -36.6, -27.4);
      player.position.z = BABYLON.Scalar.Clamp(player.position.z + moveZ * speed * dt, -4.4, 4.4);
    } else {
      player.position.x = BABYLON.Scalar.Clamp(player.position.x + moveX * speed * dt, -8.25, 8.25);
      player.position.z = BABYLON.Scalar.Clamp(player.position.z + moveZ * speed * dt, -43, 39);
    }
    const targetGroundHeight = !isInsideHouse && Math.abs(player.position.x) > 6.72 ? 0.32 : 0;
    currentGroundHeight += (targetGroundHeight - currentGroundHeight) * Math.min(1, dt * 9);
    animateCharacter(running ? "run" : "walk", dt, currentGroundHeight);
  } else {
    if (!isDriving) {
      const targetGroundHeight = !isInsideHouse && Math.abs(player.position.x) > 6.72 ? 0.32 : 0;
      currentGroundHeight += (targetGroundHeight - currentGroundHeight) * Math.min(1, dt * 9);
      animateCharacter("idle", dt, currentGroundHeight);
    }
  }
  marker.rotation.y += dt * 0.6;
  markerGlow.scaling.x = markerGlow.scaling.z = 1 + Math.sin(performance.now() / 320) * 0.06;
  if (playing && missionStage < 2) {
    const point = missionStage === 0 ? pickupPoint : deliveryPoint;
    const nearbyMission = !isDriving && !isInsideHouse && distance2D(player.position, point) < 4.5;
    const nearbyDoor = !isDriving && !isInsideHouse && houseDoorPoints.some(point => distance2D(player.position, point) < 3.8);
    const nearestScooter = isDriving ? null : scooters.map(scooter => ({ scooter, distance: distance2D(player.position, scooter.position) })).sort((a, b) => a.distance - b.distance)[0];
    const nearbyScooter = !isDriving && !isInsideHouse && nearestScooter && nearestScooter.distance < 2.25;
    prompt.hidden = !(isDriving || isInsideHouse || nearbyDoor || nearbyScooter || nearbyMission);
    if (isDriving) prompt.textContent = "E  ·  XUỐNG XE";
    else if (isInsideHouse) prompt.textContent = "E  ·  RA PHỐ";
    else if (nearbyDoor) prompt.textContent = "E  ·  VÀO NHÀ";
    else if (nearbyScooter) prompt.textContent = "E  ·  LÁI XE";
    else prompt.textContent = missionStage === 0 ? "E  ·  NHẬN BƯU KIỆN" : "E  ·  GIAO HÀNG";
  } else if (playing) {
    prompt.hidden = !(isDriving || isInsideHouse);
    prompt.textContent = isDriving ? "E  ·  XUỐNG XE" : "E  ·  RA PHỐ";
  }
  if (toast.classList.contains("visible") && performance.now() > toastUntil) toast.classList.remove("visible");
  if (playing) {
    const seconds = Math.floor((performance.now() - startTime) / 1000);
    clockLabel.textContent = `${16 + Math.floor((40 + seconds) / 60)}:${String((40 + seconds) % 60).padStart(2, "0")}  ·  SÀI GÒN`;
  }
});
engine.runRenderLoop(() => scene.render());
window.addEventListener("resize", () => engine.resize());











