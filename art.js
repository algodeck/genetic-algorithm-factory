const populationListElClassName = '.population__list'
const currentElClassName = '.generation__current__canvas'

export default class Artboard extends EventTarget {
  constructor (ga, render) {
    super()
    this.ga = ga
    this.render = render
    this.init = this.init.bind(this)
    this.update = this.update.bind(this)
    this.exportImage = this.exportImage.bind(this)
  }

  init () {
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

    const exportButton = document.querySelector('.export-button')
    exportButton.addEventListener('click', this.exportImage)
  }

  update () {
    const mainEl = document.querySelector(currentElClassName)
    const listEl = document.querySelector(populationListElClassName)
    this.render(mainEl, this.ga.population[0])
    listEl.innerHTML = ''
    this.ga.population.forEach((citizen, index) => {
      const citizenEl = document.createElement('div')
      citizenEl.setAttribute('data-generation', index)
      citizenEl.setAttribute('data-score', citizen.score.toFixed(2))
      citizenEl.classList.add('population__citizen')
      listEl.appendChild(citizenEl)
      this.render(citizenEl, citizen)
    })
  }

  exportImage () {
    const svgElement = document.querySelector(`${currentElClassName} svg`)
    const width = Number(svgElement.getAttribute('width'))
    const height = Number(svgElement.getAttribute('height'))
    const clonedSvgElement = svgElement.cloneNode(true)
    const outerHTML = clonedSvgElement.outerHTML
    const blob = new Blob([outerHTML], { type: 'image/svg+xml;charset=utf-8' })
    const blobURL = URL.createObjectURL(blob)
    const image = new Image()
    image.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = 2 * width
      canvas.height = 2 * height
      const context = canvas.getContext('2d')
      context.drawImage(image, 0, 0, 2 * width, 2 * height)
      const dataURL = canvas.toDataURL()
      const link = document.createElement('a')
      link.download = 'picture'
      link.style.display = 'none'
      document.body.append(link)
      link.href = dataURL
      link.click()
      link.remove()
    }
    image.src = blobURL
  }
}
