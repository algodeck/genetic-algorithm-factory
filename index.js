import { SVG } from '@svgdotjs/svg.js'
import GA from './ga.js'
import Artboard from './art.js'
import './index.css'

const remap = (n, start1, stop1, start2, stop2) => (
  (((n - start1) / (stop1 - start1)) * (stop2 - start2)) + start2
)

const draw = (contextEl, citizen) => {
  contextEl.innerHTML = ''
  const size = 600
  const draw = SVG().addTo(contextEl)
    .size(size, size)
    .viewbox(`0 0 ${size} ${size}`)
    .group()

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

  draw.rect(size, size)
    .fill('white')
    .move(0, 0)

  for (let x = 0; x <= size; x += 100) {
    draw.line(x, 0, x, size)
      .stroke({ width: 1, color: 'black' })
    draw.line(0, x, size, x)
      .stroke({ width: 1, color: 'black' })
  }

  const canvasMiddle = size / 2

  const blue = 'rgb(0, 18, 51)'
  const eyeLeft = canvasMiddle - eyeRadius - (eyeDistance / 2)
  const eyeRight = canvasMiddle - eyeRadius + (eyeDistance / 2)

  draw.ellipse(2 * eyeRadius, 2 * eyeRadius)
    .fill(blue)
    .move(eyeLeft, 100)

  draw.ellipse(2 * eyeRadius, 2 * eyeRadius)
    .fill(blue)
    .move(eyeRight, 100)

  draw.ellipse(2 * mouthRadius, 2 * mouthRadius)
    .fill('rgb(233, 41, 22)')
    .move(canvasMiddle - mouthRadius, 500 - mouthRadius)
    .css({ 'mix-blend-mode': 'multiply' })

  draw.polyline(`${canvasMiddle + eyeRadius - eyeDistance / 2},100 ${canvasMiddle - eyeDistance / 2},${100 + noseHeight} ${canvasMiddle - eyeRadius + eyeDistance / 2},${100 + noseHeight}`)
    .fill('none').stroke({ width: 12, color: blue })

  draw.line(`${eyeLeft}`, `${eyebrowDistance}`, `${eyeLeft + 2 * eyeRadius}`, `${eyebrowDistance}`)
    .fill('none').stroke({ width: eyebrowHeight, color: blue })

  draw.line(`${eyeRight}`, `${eyebrowDistance}`, `${eyeRight + 2 * eyeRadius}`, `${eyebrowDistance}`)
    .fill('none').stroke({ width: eyebrowHeight, color: blue })
}

const variables = [
  'eyeRadius',
  'eyeDistance',
  'eyebrowDistance',
  'eyebrowHeight',
  'noseHeight',
  'mouthRadius'
]

const ga = new GA(variables)
ga.bigBang()

const artboard = new Artboard(ga, draw)

artboard.addEventListener('vote', (event) => {
  const citizen = event.detail
  const sorted = ga.population.slice()
  sorted.sort((a, b) => a.score < b.score)
  const parentB = sorted[0]
  ga.babyMaking(citizen, parentB, 0.8, 0.2)
  artboard.update()
})

window.addEventListener('load', artboard.init)
