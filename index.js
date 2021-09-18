import { SVG } from '@svgdotjs/svg.js'
import GA from './ga.js'
import Artboard from './artboard.js'
import './index.css'

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

const ga = new GA(variables)
ga.bigBang()

const evolve = (parentA) => {
  const sorted = ga.population.slice()
  sorted.sort((a, b) => a.score < b.score)
  const parentB = sorted[0]
  ga.babyMaking(parentA, parentB, 0.8, 0.2)
}

const artboard = new Artboard(ga, draw, evolve)
window.addEventListener('load', artboard.init)
