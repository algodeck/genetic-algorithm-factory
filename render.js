import SVG from "svg.js";

const drawPotato = (contextEl, gene, score, scale = 1.0) => {
  contextEl.innerHTML = "";
  const size = 512;
  const draw = SVG(contextEl)
    .size(size, size)
    .viewbox(`0 0 ${size} ${size}`)
    .group();

  const [
    bodyWidth,
    bodyHeight,
    eyeLeftX,
    eyeRightX,
    eyeY,
    eyeRadius,
    mouthX,
    mouthY,
    mouthHeight,
    mouthWidth
  ] = [
    gene.bodyWidth * 512,
    gene.bodyHeight * 512,
    gene.eyeLeftX * 256,
    gene.eyeRightX * 256 + 256,
    gene.eyeY * 512,
    gene.eyeRadius * 80,
    gene.mouthX * 512,
    gene.mouthY * 512,
    gene.mouthHeight * 60,
    gene.mouthWidth * 100
  ];

  draw.rect(512, 512)
    .fill("white")
    .move(0, 0);

  draw.ellipse(bodyWidth, bodyHeight)
    .fill("#fdae61")
    .move((512 - bodyWidth) / 2 , (512 - bodyHeight) / 2);

  draw.circle(eyeRadius)
    .fill("#2b83ba")
    .move(eyeLeftX, eyeY);

  draw.circle(eyeRadius)
    .fill("#2b83ba")
    .move(eyeRightX, eyeY);

  draw.ellipse(mouthWidth, mouthHeight)
    .fill("#d7191c")
    .move(mouthX, mouthY);

  draw.text(`${Math.round(score)}`)
    .attr("font-size", 40)
    .fill("black")
    .move(14, 14);
};

const drawGeneration = (generation, index) => {
  const elem = document.querySelector(".generation__list");
  const parent = document.createElement("div");
  parent.setAttribute("data-generation", index);
  elem.appendChild(parent);
  drawPotato(parent, generation.phenotype, generation.score, 0.5);
};

const update = generations => {
  const mainEl = document.getElementById("current");
  drawPotato(mainEl, generations[0].phenotype, generations[0].score);
  const listEl = document.querySelector(".generation__list");
  listEl.innerHTML = "";
  generations.map(drawGeneration);
};

export { update };
