const populationListElClassName = '.population__list'
const currentElClassName = '#current'

export default class Artboard extends EventTarget {
  constructor (ga, render) {
    super()
    this.ga = ga
    this.render = render
  }

  init = () => {
    const populationListEl = document.querySelector(populationListElClassName)
    populationListEl.addEventListener('click', event => {
      if (event.target.dataset.generation) {
        const citizenId = window.parseInt(event.target.dataset.generation)
        const citizen = this.ga.population[citizenId]
        citizen.score += 1
        const updateEvent = new CustomEvent('vote', { detail: citizen })
        this.dispatchEvent(updateEvent)
      }
    })
    this.update()
  }

  update = () => {
    const mainEl = document.querySelector(currentElClassName)
    const listEl = document.querySelector(populationListElClassName)
    this.render(mainEl, this.ga.population[0])
    listEl.innerHTML = ''
    this.ga.population.forEach((citizen, index) => {
      const citizenEl = document.createElement('div')
      citizenEl.setAttribute('data-generation', index)
      citizenEl.setAttribute('data-score', citizen.score)
      citizenEl.classList.add('population__citizen')
      listEl.appendChild(citizenEl)
      this.render(citizenEl, citizen)
    })
  }
}
