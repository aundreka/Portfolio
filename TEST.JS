const carousel = document.querySelector(".piano-carousel");
const prevBtn = document.getElementById("prevbtn");
const nextBtn = document.getElementById("nextbtn");
const pianos = document.querySelectorAll(".piano");

let currentAngle = 0;
const totalPianos = pianos.length
const angleStep = 360 / totalPianos;
const radius = 620;  // Increased spacing for better visibility
const heightFactor = 120; // Lifts back pianos higher
const offsetFactor = 80; // Moves back pianos sideways for better visibility

function updateCarousel() {
  pianos.forEach((piano, index) => {
    let baseAngle = index * angleStep;
    let effectiveAngle = baseAngle + currentAngle;
    // Normalize angle to [-180, 180]
    effectiveAngle = ((effectiveAngle + 180) % 360) - 180;
    
    // Determine a slight forward tilt (rotateX)
    let tilt = 0;
    if (Math.abs(effectiveAngle) >= 5) {
      tilt = Math.min(80, (Math.abs(effectiveAngle) / 90) * -10);
    }

    // Convert to radians
    let rad = (baseAngle + currentAngle) * (Math.PI / 180);
    let x = Math.sin(rad) * radius;
    let z = Math.cos(rad) * radius;

    // Elevate back pianos and shift them sideways
    let y = (1 - Math.abs(Math.cos(rad))) * heightFactor;
    let offsetX = Math.sin(rad) * offsetFactor;

    // Reduce y-shift for front pianos (those near 0 degrees)
    if (Math.abs(effectiveAngle) < 144) {
      y = 0;
      offsetX = 0; // Keep front pianos centered
    }

    // Rotate to always face the viewer
    let rotateY = -(baseAngle + currentAngle);

    piano.style.transform = `
      translateX(${x + offsetX}px) 
      translateZ(${z}px) 
      translateY(${-y}px)
      rotateY(${rotateY}deg)
      rotateX(${tilt}deg)
    `;
  });
}

// Button event listeners
nextBtn.addEventListener("click", () => {
  currentAngle -= angleStep;
  updateCarousel();
});

prevBtn.addEventListener("click", () => {
  currentAngle += angleStep;
  updateCarousel();
});

// Initial placement
updateCarousel();
