load("./data.json", 0, "#section1Bg", run);
load("./data2.json", 1, "#carousel", run2);
load("./data3.json", 2, "#sectionB", () => run3("#sectionB", ".img"));
run3("#sectionA", ".circle");
load("./data4.json", 3, "#sectionC1", () => run3("#sectionC1", ".img"));
load("./data5.json", 3, "#sectionC2", () => run3("#sectionC2", ".img"));

function load(file, num, container, callback) {
  const parent = document.querySelector(container);

  fetch(file)
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
            img.src = `data:image/png;base64,${fill.imgBase64}`;
            img.classList.add("img");
            img.id = `img${num}_` + (i + 1);

            const docWidth = data.absoluteRenderBounds.width;
            const docHeight = data.absoluteRenderBounds.height;

            const parentWidth = parent.offsetWidth;
            const parentHeight = parent.offsetHeight;

            const normalizeScaleX = parentWidth / docWidth;
            const normalizeScaleY = parentHeight / docHeight;

            let x = child.x / parentWidth;
            let y = child.y / parentHeight;

            x *= 100;
            y *= 100;

            x *= normalizeScaleX;
            y *= normalizeScaleY;

            let width = child.width / parentWidth;
            width *= 100;

            width *= normalizeScaleX;

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

function run() {
  // get all elements with class 'up'
  let elements = document.querySelectorAll("#section1 .img");

  // get the center of the window
  let centerX = window.innerWidth / 2;
  let centerY = window.innerHeight / 2;

  let tl = gsap.timeline({
    scrollTrigger: {
      trigger: "#section1",
      start: "top top", // when the top of the element hits the center of the viewport
      end: "bottom top", // when the bottom of the element hits the center of the viewport
      scrub: true, // smooth scrubbing, takes 1 second to "catch up" to the scrollbar
    },
  });

  // animate each element
  elements.forEach((element) => {
    // get the element's position
    let rect = element.getBoundingClientRect();
    let elementX = rect.left + rect.width / 2;
    let elementY = rect.top + rect.height / 2;

    // calculate the direction to animate
    let directionX = elementX - centerX > 0 ? "+=" : "-=";
    //let directionY = elementY - centerY > 0 ? "+=" : "-=";
    let directionY = "-=";
    //let directionY = "+=";

    const goalX = directionX + Math.abs(elementX - centerX);
    const goalY = directionY + (600 - Math.abs(elementX - centerX));
    //const goalY = directionY + Math.abs(elementX - centerX);

    // animate the element
    tl.to(
      element,
      {
        x: goalX,
        y: goalY,
        duration: 1, // duration of 1 second
        ease: "power1.out", // easing function
      },
      0
    );
  });
}

function run2() {
  // get the container element
  let container = document.querySelector("#carousel");

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

function run3(parentSelector, childSelector) {
  // get the parent element
  let parent = document.querySelector(parentSelector);
  const parentRect = parent.getBoundingClientRect();

  // get all child elements
  let children = parent.querySelectorAll(childSelector);

  // get the center of the parent
  let centerX = parent.offsetWidth / 2;
  let centerY = parent.offsetHeight / 2;

  console.log("center", centerX, centerY);

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
