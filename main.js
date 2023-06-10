//load section1
fetch("./data.json")
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
    for (let i = 0; i < data.children.length; i++) {
      const child = data.children[i];
      console.log(child);
      const fills = child.fills;

      for (let j = 0; j < fills.length; j++) {
        const fill = fills[j];
        const type = fill.type;
        if (type === "IMAGE") {
          const img = document.createElement("img");
          img.src = `data:image/png;base64,${fill.imgBase64}`;
          img.classList.add("img");
          img.id = "img0" + (i + 1);

          const docWidth = 1728;
          const docHeight = 1117;

          let x = child.x / docWidth;
          let y = child.y / (docHeight + 300);

          x *= 100;
          y *= 100;

          let width = child.width / docWidth;
          width *= 100;

          img.style.left = `${x}%`;
          img.style.top = `${y}%`;
          img.style.width = `${width}%`;
          img.style.minWidth = `${child.width / 2}px`;
          document.getElementById("section1").appendChild(img);
        }
      }
    }
  })
  .then(() => {
    run();
  });

fetch("./data2.json")
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
    for (let i = 0; i < data.children.length; i++) {
      const child = data.children[i];
      console.log(child);
      const fills = child.fills;

      for (let j = 0; j < fills.length; j++) {
        const fill = fills[j];
        const type = fill.type;
        if (type === "IMAGE") {
          const img = document.createElement("img");
          img.src = `data:image/png;base64,${fill.imgBase64}`;
          img.classList.add("img");
          img.id = "img2" + (i + 1);

          const docWidth = 1728;
          const docHeight = 1117;

          let x = child.x / docWidth;
          let y = child.y / docHeight;

          x *= 100;
          y *= 100;

          let width = child.width / docWidth;
          width *= 100;

          img.style.left = `${x}%`;
          img.style.top = `${y}%`;
          img.style.width = `${width}%`;
          document.getElementById("section2").appendChild(img);
        }
      }
    }
  });

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

    /*
    let tl = gsap.timeline({
      scrollTrigger: {
        trigger: element,
        start: "top top", // when the top of the element hits the center of the viewport
        end: "bottom top", // when the bottom of the element hits the center of the viewport
        scrub: true, // smooth scrubbing, takes 1 second to "catch up" to the scrollbar
      },
    });
    */

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
