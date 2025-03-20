const carousel = document.querySelector(".piano-carousel");
const prevBtn = document.getElementById("prevbtn");
const nextBtn = document.getElementById("nextbtn");
const pianos = document.querySelectorAll(".piano");

let currentAngle = 0;
const totalPianos = pianos.length;
const angleStep = 360 / totalPianos;
const radius = 620;
const heightFactor = 120;
const offsetFactor = 80;

function updateCarousel() {
  pianos.forEach((piano, index) => {
    let baseAngle = index * angleStep;
    let effectiveAngle = (baseAngle + currentAngle) % 360;

    let rad = (baseAngle + currentAngle) * (Math.PI / 180);
    let x = Math.sin(rad) * radius;
    let z = Math.cos(rad) * radius;
    let y = (1 - Math.abs(Math.cos(rad))) * heightFactor;
    let offsetX = Math.sin(rad) * offsetFactor;

    if (Math.abs(effectiveAngle) < 144) {
      y = 0;
      offsetX = 0;
    }

    let rotateY = 0; // Default facing direction

    if (Math.abs(effectiveAngle) < 36 || Math.abs(effectiveAngle) > 324) {
      rotateY = 180; // Front piano faces back
    } else if (Math.abs(effectiveAngle - 72) < 36) {
      rotateY = -90; // Right-side piano faces left
    } else if (Math.abs(effectiveAngle + 72) < 36) {
      rotateY = 90; // Left-side piano faces right
    } else {
      rotateY = 0; // Back pianos face front
    }

    piano.style.transform = `
      translateX(${x + offsetX}px) 
      translateZ(${z}px) 
      translateY(${-y}px)
      rotateY(${rotateY}deg)
    `;
  });
}

nextBtn.addEventListener("click", () => {
  currentAngle -= angleStep;
  updateCarousel();
});

prevBtn.addEventListener("click", () => {
  currentAngle += angleStep;
  updateCarousel();
});

updateCarousel();
