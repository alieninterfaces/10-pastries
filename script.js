load("./data.json", 0, "header", "#section1Bg", () =>
  animate1("#section1Bg .img")
);
load("./data2.json", 1, "section2", "#carousel", () => animate2("#carousel"));
load("./data3.json", 2, "section3", "#section3B", () =>
  animate3("#section3B", ".img")
);
load("./data4.json", 3, "section4", "#sectionC1", () =>
  animate3("#sectionC1", ".img")
);
load("./data5.json", 4, "section5", "#sectionC2", () =>
  animate3("#sectionC2", ".img")
);

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

function animate2(selector) {
  // get the container element
  let container = document.querySelector(selector);

  // get all child elements
  let children = container.querySelectorAll(".img");

  console.log(container, children);
  // create a timeline for the container rotation
  let containerTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: document.body,
      start: "top top",
      end: "bottom top",
      scrub: true,
    },
  });

  // rotate the container 360 degrees as the user scrolls
  containerTimeline.to(container, {
    rotation: 360,
    duration: 1,
    ease: "none",
  });

  // create a timeline for each child
  children.forEach((child) => {
    let childTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: document.body,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });

    // rotate the child -360 degrees (opposite direction to the container) as the user scrolls
    childTimeline.to(child, {
      rotation: -360,
      duration: 1,
      ease: "none",
    });
  });
}

function animate3(selector, childSelector) {
  // get the parent element
  let parent = document.querySelector(selector);
  const parentRect = parent.getBoundingClientRect();

  // get all child elements
  let children = parent.querySelectorAll(childSelector);

  // get the center of the parent
  let centerX = parent.offsetWidth / 2;
  let centerY = parent.offsetHeight / 2;

  // animate each child
  children.forEach((child) => {
    // get the child's default position
    let rect = child.getBoundingClientRect();
    let childX = rect.left + rect.width / 2 - parentRect.left;
    let childY = rect.top + rect.height / 2 - parentRect.top;

    // calculate the direction to animate
    let directionX = childX - centerX > 0 ? "+=" : "-=";
    let directionY = childY - centerY > 0 ? "+=" : "-=";

    const goalX = directionX + Math.abs((childX - centerX) * 10);
    const goalY = directionY + Math.abs((childY - centerY) * 10);

    // set the child's initial position to be out of the center of the parent
    gsap.set(child, {
      x: goalX,
      y: goalY,
    });

    // create a timeline for the child
    let childTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: document.body,
        start: "top bottom",
        end: "bottom bottom",
        scrub: true,
      },
    });

    // animate the child to its default position as the user scrolls
    childTimeline.to(child, {
      x: 0,
      y: 0,
      duration: 1,
      ease: "none",
    });
  });
}

function animate() {}
