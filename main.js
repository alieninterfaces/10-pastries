//load section1
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
          img.id = "img0" + (i + 1);
          if (child.absoluteRenderBounds) {
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
          }
          document.getElementById("section1").appendChild(img);
        }
      }
    }
  });
