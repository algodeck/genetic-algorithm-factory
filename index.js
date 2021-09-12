import SVG from 'svg.js'
import GA from './ga.js'
import Artboard from './art.js'

const draw = (contextEl, citizen) => {
  contextEl.innerHTML = ''
  const size = 512
  const draw = SVG(contextEl)
    .size(size, size)
    .viewbox(`0 0 ${size} ${size}`)
    .group()

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
    citizen.bodyWidth * 512,
    citizen.bodyHeight * 512,
    citizen.eyeLeftX * 256,
    citizen.eyeRightX * 256 + 256,
    citizen.eyeY * 512,
    citizen.eyeRadius * 80,
    citizen.mouthX * 512,
    citizen.mouthY * 512,
    citizen.mouthHeight * 60,
    citizen.mouthWidth * 100
  ]

  draw.rect(512, 512)
    .fill('white')
    .move(0, 0)

  draw.ellipse(bodyWidth, bodyHeight)
    .fill('#fdae61')
    .move((512 - bodyWidth) / 2, (512 - bodyHeight) / 2)

  draw.circle(eyeRadius)
    .fill('#2b83ba')
    .move(eyeLeftX, eyeY)

  draw.circle(eyeRadius)
    .fill('#2b83ba')
    .move(eyeRightX, eyeY)

  draw.ellipse(mouthWidth, mouthHeight)
    .fill('#d7191c')
    .move(mouthX, mouthY)
}

const variables = [
  'bodyWidth',
  'bodyHeight',
  'eyeLeftX',
  'eyeRightX',
  'eyeY',
  'mouthX',
  'mouthY',
  'mouthWidth',
  'mouthHeight',
  'eyeRadius'
]

const ga = new GA(variables)
ga.bigBang()

const artboard = new Artboard(ga, draw)

artboard.addEventListener('vote', (event) => {
  const citizen = event.detail
  const sorted = ga.population.slice()
  sorted.sort((a, b) => a.score < b.score)
  const parentB = sorted[0]
  ga.babyMaking(citizen, parentB, 0.5, 0.2)
  artboard.update()
})

window.addEventListener('load', artboard.init)
