import GA from '../ga.js'
import { SVG } from '@svgdotjs/svg.js'
import { html, css, LitElement } from 'lit';

const remap = (n, start1, stop1, start2, stop2) => (
  (((n - start1) / (stop1 - start1)) * (stop2 - start2)) + start2
)

const draw = (contextEl, citizen) => {
  const size = 600
  const canvas = SVG().addTo(contextEl)
    .size(size, size)
    .viewbox(0, 0, size, size)
    .group()

  canvas.rect(size, size)
    .fill('rgb(231, 228, 211)')
    .move(0, 0)

  for (let x = 0; x <= size; x += 100) {
    canvas.line(x, 0, x, size)
      .stroke({ width: 1, color: 'black', opacity: 0.5 })
    canvas.line(0, x, size, x)
      .stroke({ width: 1, color: 'black', opacity: 0.5 })
  }

  const [
    eyeRadius,
    eyeDistance,
    eyebrowDistance,
    eyebrowHeight,
    noseHeight,
    mouthRadius
  ] = [
    remap(citizen.eyeRadius, 0, 1, 10, 50),
    remap(citizen.eyeDistance, 0, 1, 100, 600),
    remap(citizen.eyebrowDistance, 0, 1, 0, 100),
    remap(citizen.eyebrowHeight, 0, 1, 10, 40),
    remap(citizen.noseHeight, 0, 1, 100, 400),
    remap(citizen.mouthRadius, 0, 1, 10, 200)
  ]

  const canvasMiddle = size / 2
  const blue = 'rgb(0, 18, 51)'
  const red = 'rgb(233, 41, 22)'
  const eyeLeft = canvasMiddle - eyeRadius - (eyeDistance / 2)
  const eyeRight = canvasMiddle - eyeRadius + (eyeDistance / 2)

  // Draw the left eye
  canvas.ellipse(2 * eyeRadius, 2 * eyeRadius)
    .fill(blue)
    .move(eyeLeft, 100)

  // Draw the left eyebrow
  canvas.line([
    [eyeLeft, eyebrowDistance], [eyeLeft + 2 * eyeRadius, eyebrowDistance]
  ]).fill('none').stroke({ width: eyebrowHeight, color: blue })

  // Draw the right eyebrow
  canvas.line([
    [eyeRight, eyebrowDistance], [eyeRight + 2 * eyeRadius, eyebrowDistance]
  ]).fill('none').stroke({ width: eyebrowHeight, color: blue })

  // Draw the right eye
  canvas.ellipse(2 * eyeRadius, 2 * eyeRadius)
    .fill(blue)
    .move(eyeRight, 100)

  // Draw the mouth
  canvas.ellipse(2 * mouthRadius, 2 * mouthRadius)
    .fill(red)
    .move(canvasMiddle - mouthRadius, 500 - mouthRadius)
    .css({ 'mix-blend-mode': 'multiply' })

  // Draw the nose
  canvas.polyline([
    // start at the corner of the left eye
    [canvasMiddle + eyeRadius - eyeDistance / 2, 100],
    // go to the left corner of the mouth
    [canvasMiddle - eyeDistance / 2, 100 + noseHeight],
    // end on the right corner of the mouth
    [canvasMiddle - eyeRadius + eyeDistance / 2, 100 + noseHeight]
  ]).fill('none').stroke({ width: 12, color: blue })
}

const variables = [
  'eyeRadius',
  'eyeDistance',
  'eyebrowDistance',
  'eyebrowHeight',
  'noseHeight',
  'mouthRadius'
]

const populationListElClassName = '.population__list'
const currentElClassName = '.generation__current__canvas'

export class GaArtboard extends LitElement {
  static styles = css`
    .bench {
      display: flex;
      height: 100vh;
      width: 100%;
    }

    .population {
      background: rgb(239 239 239);
      flex-basis: 40%;
      overflow: scroll;
      padding: 0 16px;
    }

    .population p {
      padding: 0 8px;
      text-align: center;
    }

    .population__list {
      display: grid;
      gap: 1rem;
      grid-auto-rows: min-content;
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .population__list svg {
      height: auto;
      pointer-events: none;
      user-select: none;
      width: 100%;
    }

    .generation__current {
      align-items: center;
      background-color: #fafafabb;
      display: flex;
      flex-basis: 100%;
      flex-direction: column;
      justify-content: center;
    }

    .generation__current svg {
      height: auto;
      width: 100%;
    }

    .population__citizen {
      cursor: pointer;
      position: relative;
    }

    .population__citizen:hover {
      border: 1px solid black;
      box-shadow: rgb(244, 201, 62) 8px 8px 0px 0px;
    }

    .population__citizen::before {
      color: rgba(9, 38, 149, 0.9);
      content: attr(data-score);
      font-size: 22px;
      font-weight: 900;
      height: 40px;
      line-height: 40px;
      overflow: hidden;
      text-align: center;
      text-overflow: clip;
      white-space: nowrap;
      width: 40px;
      position: relative;
      right: 0;
    }

    .export-button {
      cursor: pointer;
      display: inline-block;
      font-weight: 800;
      margin: 16px;
      padding: 8px;
    }

    @media (max-width: 768px) {
      .bench {
        flex-direction: column-reverse;
        height: auto;
      }

      .population {
        padding-right: 0;
      }
    }`;

  constructor() {
    super();

    const variables = [
      'eyeRadius',
      'eyeDistance',
      'eyebrowDistance',
      'eyebrowHeight',
      'noseHeight',
      'mouthRadius'
    ]
    this.ga = new GA(variables);
    this.ga.bigBang();
  }

  firstUpdated() {
    super.connectedCallback()
    this.paint()
  }

  get _populationListEl() {
    return this.renderRoot.querySelector('.population__list');
  }

  evolve = (parentA) => {
    const sorted = this.ga.population.slice()
    sorted.sort((a, b) => a.score < b.score)
    const parentB = sorted[0]
    this.ga.babyMaking(parentA, parentB, 0.8, 0.2)
  }

  render() {
    return html`
      <div class="bench">
        <div class="population">
          <p>Vote for your favourite by clicking on it. Scroll for more.</p>
          <div class="population__list" @click="${this._clickHandler}"></div>
        </div>
        <div class="generation__current">
          <div class="generation__current__canvas"></div>
          <div>
            <button class="export-button" @click="${this._exportImageHandler}">Save 📸</button>
          </div>
        </div>
      </div>`;
  }

  _clickHandler(event) {
    if (event.target.dataset.generation) {
      const citizenId = window.parseInt(event.target.dataset.generation)
      const citizen = this.ga.population[citizenId]
      citizen.score += 1
      this.evolve(citizen)
      this.paint()
    }
  }

  _exportImageHandler () {
    const svgElement = this.renderRoot.querySelector(`${currentElClassName} svg`)
    const outerHTML = svgElement.outerHTML
    const width = Number(svgElement.getAttribute('width'))
    const height = Number(svgElement.getAttribute('height'))
    const blobURL = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(outerHTML);
    const image = new Image()

    image.addEventListener('load', () => {
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
    })

    image.src = blobURL
  }

  paint () {
    const mainEl = this.renderRoot.querySelector(currentElClassName)
    const listEl = this.renderRoot.querySelector(populationListElClassName)
    mainEl.innerHTML = ''
    draw(mainEl, this.ga.population[0])
    listEl.innerHTML = ''
    this.ga.population.forEach((citizen, index) => {
      const citizenEl = document.createElement('div')
      citizenEl.setAttribute('data-generation', index)
      citizenEl.setAttribute('data-score', citizen.score.toFixed(2))
      citizenEl.classList.add('population__citizen')
      listEl.appendChild(citizenEl)
      draw(citizenEl, citizen)
    })
  }
}

customElements.define('ga-artboard', GaArtboard);
