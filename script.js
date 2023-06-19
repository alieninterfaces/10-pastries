load("./data.json", 0, "header", "#section1Bg", () =>
  animate1("#section1Bg .img")
);
load("./data2.json", 1, "section2", "#carousel", animate);
load("./data3.json", 2, "section3", "#section3B", animate);
load("./data4.json", 3, "section4", "#sectionC1", animate);
load("./data5.json", 4, "section5", "#sectionC2", animate);

function load(url, index, dir, selector, callback) {
  const parent = document.querySelector(selector);

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      for (let i = 0; i < data.children.length; i++) {
        const child = data.children[i];
        const fills = child.fills;

        for (let j = 0; j < fills.length; j++) {
          const fill = fills[j];
          const type = fill.type;

          if (type === "IMAGE") {
            const img = document.createElement("img");
            img.src = `./assets/${dir}/${child.name}.png`;
            img.classList.add("img");
            img.id = `img${index}_${i + 1}`;

            const docWidth = data.absoluteRenderBounds.width;
            const docHeight = data.absoluteRenderBounds.height;

            const parentWidth = parent.offsetWidth;
            const parentHeight = parent.offsetHeight;

            const normalizedScaleX = parentWidth / docWidth;
            const normalizedScaleY = parentHeight / docHeight;

            let x = child.x / parentWidth;
            let y = child.y / parentHeight;

            x *= 100;
            y *= 100;

            x *= normalizedScaleX;
            y *= normalizedScaleY;

            let width = child.width / parentWidth;
            width *= 100;
            width *= normalizedScaleX;

            img.style.left = `${x}%`;
            img.style.top = `${y}%`;
            img.style.width = `${width}%`;
            img.style.minWidth = `${child.width / 2}px`;
            parent.appendChild(img);
          }
        }
      }
    })
    .then(() => {
      callback();
    });
}

function animate1(selector) {
  // Ensure gsap and ScrollTrigger are available
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
    console.log("GSAP or ScrollTrigger is not loaded");
    return;
  }

  // Define the class of the elements to animate

  // Get the elements
  let elements = document.querySelectorAll(selector);

  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;

  let tl = gsap.timeline({
    scrollTrigger: {
      trigger: "#section1",
      start: "top top", // start when top of the element hits the center
      end: "bottom top", // end when bottom of the element hits the center
      scrub: true, // smooth scrubbing, takes 1 second to "catch up" to the scrollba
    },
  });

  // For each element
  elements.forEach((element) => {
    // Get the element's current position
    let rect = element.getBoundingClientRect();

    const elementX = rect.left + rect.width / 2;

    const directionX = elementX - centerX > 0 ? "+=" : "-=";
    const directionY = "-=";

    const goalX = directionX + Math.abs(elementX - centerX);
    const goalY = directionY + (600 - Math.abs(elementX - centerX));

    // Create the gsap animation

    tl.to(
      element,
      {
        x: goalX,
        y: goalY,
        duration: 1,
        ease: "power1.out",
      },
      0
    );
  });
}
function animate() {}
