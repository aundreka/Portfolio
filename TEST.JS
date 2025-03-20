const carousel = document.querySelector(".piano-carousel");
const prevBtn = document.getElementById("prevbtn");
const nextBtn = document.getElementById("nextbtn");
const pianos = document.querySelectorAll(".piano");

let currentIndex = 0;
const totalPianos = pianos.length;
const angleStep = 360 / totalPianos;
const radius = 620;
const heightFactor = 60;
const offsetFactor = 60;
const duration = 800; // ⏩ Reduced from 600ms to 400ms for snappier transitions
const colors = ["red", "blue", "green", "yellow", "purple"];

document.querySelectorAll(".piano").forEach((piano, index) => {
  piano.addEventListener("load", async () => {
      const model = piano.model;
      if (!model) return; // Ensure model exists

      const materials = model.materials;
      if (!materials || materials.length === 0) return; // Ensure materials exist

      const material = materials[0]; // Target the first material
      const colorFactor = getColorFactor(colors[index]);

      if (material.pbrMetallicRoughness) {
          material.pbrMetallicRoughness.setBaseColorFactor(colorFactor);
      }
  });
});

function getColorFactor(color) {
  const colorMap = {
    "red": [1, 0.6, 0.6, 1],    // Soft pastel red
    "blue": [0.6, 0.75, 1, 1],   // Soft pastel blue
    "green": [0.6, 1, 0.6, 1],   // Soft pastel green
    "yellow": [1, 1, 0.6, 1],    // Soft pastel yellow
    "purple": [0.8, 0.6, 1, 1]   // Soft pastel purple
    };
  return colorMap[color] || [1, 1, 1, 1]; // Default to white if not found
}


// ✅ Apply smooth transitions to all pianos
pianos.forEach((piano) => {
  piano.style.transition = `transform ${duration}ms ease-out`;
});

// ✅ Optimized Rotation Function
function animateRotation(targetIndex) {
  let targetAngle = targetIndex * angleStep;

  pianos.forEach((piano, index) => {
    let baseAngle = index * angleStep;
    let effectiveAngle = (baseAngle - targetAngle) % 360;
    let rad = effectiveAngle * (Math.PI / 180);

    let x = Math.sin(rad) * radius;
    let z = Math.cos(rad) * radius;
    let y = (1 - Math.abs(Math.cos(rad))) * heightFactor;
    let offsetX = Math.sin(rad) * offsetFactor;

    if (Math.abs(effectiveAngle) < 144) {
      y = -30;
      offsetX = 0;
    }

    let orbitY = 90;
    let orbitX = -effectiveAngle;
    let orbitZ = 90;

    piano.setAttribute("camera-orbit", `${orbitX}deg ${orbitY}deg ${orbitZ}deg`);

    piano.style.transform = `
      translateX(${x + offsetX}px) 
      translateZ(${z}px) 
      translateY(${-y}px)`;
  });

  currentIndex = targetIndex % totalPianos;
}

// ✅ Updated Button Listeners
nextBtn.addEventListener("click", () => {
  animateRotation((currentIndex + 1) % totalPianos);
});

prevBtn.addEventListener("click", () => {
  animateRotation((currentIndex - 1 + totalPianos) % totalPianos);
});

// ✅ Initial Setup
animateRotation(0);

let isDragging = false;
let startX = 0, startY = 0;
let lastOrbitX = 90; // Default X orbit
let lastOrbitY = 90; // Default Y orbit
const centerPiano = document.querySelector(".piano-carousel model-viewer"); // Ensure this targets the correct model

function startDrag(event) {
  isDragging = true;
  startX = event.clientX || event.touches[0].clientX;
  startY = event.clientY || event.touches[0].clientY;

  // Get current orbit values
  let orbit = centerPiano.getAttribute("camera-orbit").split(" ");
  lastOrbitX = parseFloat(orbit[0]); // X (horizontal)
  lastOrbitY = parseFloat(orbit[1]); // Y (vertical)

  event.preventDefault();
}

function drag(event) {
  if (!isDragging) return;

  let clientX = event.clientX || event.touches[0].clientX;
  let clientY = event.clientY || event.touches[0].clientY;

  let deltaX = clientX - startX;
  let deltaY = clientY - startY;

  let sensitivityX = 0.2; // Adjust horizontal sensitivity
  let sensitivityY = 0.15; // Adjust vertical sensitivity

  let newOrbitX = lastOrbitX - deltaX * sensitivityX;
  let newOrbitY = lastOrbitY - deltaY * sensitivityY; // Invert Y-axis for natural feel

  // Limit Y-axis tilt (prevent extreme rotations)
  newOrbitY = Math.max(75, Math.min(105, newOrbitY));
  newOrbitX = Math.max(-30, Math.min(30, newOrbitX));

  centerPiano.setAttribute("camera-orbit", `${newOrbitX}deg ${newOrbitY}deg 90deg`);
}

function stopDrag() {
  isDragging = false;
  setTimeout(() => {
    centerPiano.setAttribute("camera-orbit", "0deg 90deg 90deg");
  }, 500);  
}

// ✅ Attach event listeners to the center piano
centerPiano.addEventListener("mousedown", startDrag);
centerPiano.addEventListener("touchstart", startDrag);

window.addEventListener("mousemove", drag);
window.addEventListener("touchmove", drag);

window.addEventListener("mouseup", stopDrag);
window.addEventListener("touchend", stopDrag);




its only targeting one specific piano but it should target the piano thats in the center, 