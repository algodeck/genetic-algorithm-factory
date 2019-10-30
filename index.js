import { update } from "./render.js";

const population = [];

// {
//   genes: [0.1, 0.2 ...],
//   score: 0,
// }

const phenotypeMap = {
  bodyWidth: 0,
  bodyHeight: 1,
  eyeLeftX: 2,
  eyeRightX: 3,
  eyeY: 4,
  mouthX: 5,
  mouthY: 6,
  mouthWidth: 7,
  mouthHeight: 8,
  eyeRadius: 9
};

const genotypeToPhenotype = potato => {
  const phenotype = {};
  for (const [key, value] of Object.entries(phenotypeMap)) {
    phenotype[key] = potato.genes[value];
  }

  return {
    phenotype,
    score: potato.score
  };
};

const randomPotato = () => {
  const genes = [];
  for (let i in phenotypeMap) {
    genes.push(Math.random());
  }
  return {
    genes,
    score: 1
  };
};

const babyMaking = potato => {
  const mommy = potato;

  const sorted = population.slice();
  sorted.sort((a, b) => a.score < b.score);

  const daddy = sorted[0];

  const baby = randomPotato();

  for (let i in baby.genes) {
    // Crossover
    const crossoverFlip = Math.random();
    if (crossoverFlip < 0.5) {
      baby.genes[i] = mommy.genes[i];
    } else {
      baby.genes[i] = daddy.genes[i];
    }

    // Mutation
    const mutationFlip = Math.random();
    if (mutationFlip < 0.2) {
      baby.genes[i] = Math.random();
    }
  }

  baby.score = (mommy.score + daddy.score) / 2;

  population.unshift(baby);
};

const bigBang = () => {
  population.push(randomPotato());
};

const updateGraphics = () => {
  update(population.map(genotypeToPhenotype));
};

const generationListEl = document.querySelector(".generation__list");
generationListEl.addEventListener("click", e => {
  if (e.target.dataset.generation) {
    const generation = population[window.parseInt(e.target.dataset.generation)];
    generation.score += 1;
    babyMaking(generation);
    updateGraphics();
  }
});

bigBang();
bigBang();

updateGraphics();
