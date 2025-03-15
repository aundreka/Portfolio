const carousel = document.querySelector(".piano-carousel");
const prevBtn = document.getElementById("prevbtn");
const nextBtn = document.getElementById("nextbtn");
const pianos = document.querySelectorAll(".piano");

let currentAngle = 0;
const totalPianos = pianos.length;
const angleStep = 360 / totalPianos;
const radius = 200; // radius of the circular path

function updateCarousel() {
  pianos.forEach((piano, index) => {
    // base angle (in degrees) for this piano in the circle
    let baseAngle = index * angleStep;
    // effective angle relative to the viewer (taking the carousel rotation into account)
    let effectiveAngle = baseAngle + currentAngle;
    // Normalize to range [-180, 180]
    effectiveAngle = ((effectiveAngle + 180) % 360) - 180;
    
    // Determine a slight forward tilt (rotateX)
    // Only the piano that is nearly front (effectiveAngle near 0) stays flat.
    let tilt = 0;
    if (Math.abs(effectiveAngle) >= 5) {
      // Map the angle to a tilt value up to a maximum of 10deg
      tilt = Math.min(10, (Math.abs(effectiveAngle) / 90) * 10);
    }
    
    // Calculate the position on the circle using the effective angle (in radians)
    let rad = (baseAngle + currentAngle) * (Math.PI / 180);
    let x = Math.sin(rad) * radius;
    let z = Math.cos(rad) * radius;
    
    // Rotate each piano so that it always faces the viewer.
    // We use the negative of the current angle of the piano.
    let rotateY = -(baseAngle + currentAngle);
    
    piano.style.transform = `
      translateX(${x}px) 
      translateZ(${z}px) 
      rotateY(${rotateY}deg) 
      rotateX(${tilt}deg)
    `;
  });
}

// Update carousel when buttons are clicked
nextBtn.addEventListener("click", () => {
  currentAngle -= angleStep;
  updateCarousel();
});

prevBtn.addEventListener("click", () => {
  currentAngle += angleStep;
  updateCarousel();
});

// Initial placement – the keys "fall into place" can be added as an extra animation if desired.
updateCarousel();
