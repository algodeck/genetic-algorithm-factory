class Citizen {
  constructor (phenotypeVariables) {
    this.score = 0
    this.genes = phenotypeVariables.map(() => Math.random())

    // The following code allows to access easily the genes by using the
    // variable name instead of an array index.
    phenotypeVariables.forEach((propertyName) => {
      Object.defineProperty(
        this,
        propertyName,
        {
          get: () => this.genes[phenotypeVariables.indexOf(propertyName)]
        }
      )
    })
  }
}

export default class GA {
  constructor (phenotypeVariables) {
    this.phenotypeVariables = phenotypeVariables
    this.population = []
  }

  bigBang () {
    this.population.push(new Citizen(this.phenotypeVariables))
    this.population.push(new Citizen(this.phenotypeVariables))
  }

  babyMaking (parentA, parentB, crossOverRate = 0.5, mutationRate = 0.2) {
    // Create a baby
    const baby = new Citizen(this.phenotypeVariables)

    for (const i in baby.genes) {
      // Crossover
      const crossoverFlip = Math.random()
      if (crossoverFlip < crossOverRate) {
        baby.genes[i] = parentA.genes[i] // From parent A
      } else {
        baby.genes[i] = parentB.genes[i] // From parent B
      }

      // Mutation
      const mutationFlip = Math.random()
      if (mutationFlip < mutationRate) {
        baby.genes[i] = Math.random() // Mutate
      }
    }

    // Give the baby a weighted score
    baby.score = (parentA.score * crossOverRate) + (parentB.score * (1 - crossOverRate))

    // Add to the population
    this.population.unshift(baby)
  }
}
