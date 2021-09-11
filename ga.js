class Citizen {
  constructor (variables) {
    this.variables = variables
    this.score = 0
    this.genes = variables.map(() => Math.random())

    variables.forEach((propertyName) => {
      Object.defineProperty(
        this, propertyName, { get: () => this.genes[this.variables.indexOf(propertyName)] }
      )
    })
  }
}

export default class GA {
  constructor (variables, crossOverRate = 0.5, mutationRate = 0.2) {
    this.variables = variables
    this.population = []
    this.crossOverRate = crossOverRate
    this.mutationRate = mutationRate
  }

  bigBang () {
    this.population.push(new Citizen(this.variables))
    this.population.push(new Citizen(this.variables))
  }

  babyMaking (parentA, parentB) {
    const baby = Citizen.random(this.variables)

    for (const i in baby.genes) {
      // Crossover
      const crossoverFlip = Math.random()
      console.log(crossoverFlip, this.crossOverRate)
      if (crossoverFlip < this.crossOverRate) {
        baby.genes[i] = parentA.genes[i]
        console.log('from selected')
      } else {
        baby.genes[i] = parentB.genes[i]
        console.log('from other')
      }

      // Mutation
      const mutationFlip = Math.random()
      if (mutationFlip < this.mutationRate) {
        baby.genes[i] = Math.random()
      }
    }

    baby.score = (parentA.score * this.crossOverRate) + (parentB.score * (1 - this.crossOverRate))
    console.log('a', parentA.score, 'b', parentB.score, 'baby', baby.score)

    this.population.unshift(baby)
  }
}
