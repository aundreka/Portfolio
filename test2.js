const carousel = document.querySelector(".piano-carousel");
const prevBtn = document.getElementById("prevbtn");
const nextBtn = document.getElementById("nextbtn");
const pianos = document.querySelectorAll(".piano");

let currentAngle = 0;
const totalPianos = pianos.length;
const angleStep = 360 / totalPianos;
const radius = 520;
const heightFactor = 120;
const offsetFactor = 100;

function updateCarousel() {
    pianos.forEach((piano, index) => {
        let baseAngle = index * angleStep;
        let effectiveAngle = baseAngle + currentAngle;
        effectiveAngle = ((effectiveAngle + 180) % 360) - 180; // Normalize to [-180, 180]

        let rad = (baseAngle + currentAngle) * (Math.PI / 180);
        let x = Math.sin(rad) * radius;
        let z = Math.cos(rad) * radius;

        let y = (1 - Math.abs(Math.cos(rad))) * heightFactor;
        let offsetX = Math.sin(rad) * offsetFactor;
        
        let tilt = 0;
        if (Math.abs(effectiveAngle) >= 5) {
          tilt = Math.min(10, (Math.abs(effectiveAngle) / 90) * 10);
        }
        // Ensure the front piano remains largest
        let scale = 1 - (Math.abs(z) / (radius * 2)); // Back pianos shrink
        if (Math.abs(effectiveAngle) < angleStep / 2) {
            scale = 1; // Keep the front piano at full size
        } else {
            scale = Math.max(0.6, scale); // Limit minimum size
        }

        // Move back pianos further behind the figure
        if (Math.abs(effectiveAngle) > 90) {
            z -= 200; // Push back further
        }

        let rotateY = -(baseAngle + currentAngle);

        piano.style.transform = `
            translateX(${x + offsetX}px) 
            translateZ(${z}px) 
            translateY(${-y}px) 
            rotateY(${rotateY}deg)
            scale(${scale})
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
