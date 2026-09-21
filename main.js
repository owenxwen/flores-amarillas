// Positions follow the reference's 1489 × 704 composition. The whole garden
// scales together so that petals, foliage and stem endpoints stay aligned.
const flowers = [
  { x: 727, y: 105, size: 1, angle: -7, base: 746 },
  { x: 624, y: 150, size: .93, angle: -24, base: 751 },
  { x: 856, y: 137, size: .94, angle: 22, base: 760 },
  { x: 531, y: 224, size: .96, angle: -35, base: 742 },
  { x: 663, y: 228, size: .94, angle: -8, base: 750 },
  { x: 754, y: 192, size: 1.03, angle: 0, base: 753 },
  { x: 886, y: 210, size: .78, angle: 24, base: 762 },
  { x: 966, y: 220, size: 1, angle: 37, base: 762 },
  { x: 574, y: 284, size: .77, angle: -30, base: 737 },
  { x: 501, y: 321, size: .75, angle: -65, base: 739 },
  { x: 943, y: 348, size: .85, angle: 31, base: 763 },
  { x: 1000, y: 309, size: .83, angle: 40, base: 765 },
  { x: 864, y: 274, size: 1.02, angle: 14, base: 757 },
  { x: 634, y: 307, size: 1.05, angle: -14, base: 736 },
  { x: 498, y: 369, size: 1, angle: -76, base: 740 },
  { x: 540, y: 437, size: .78, angle: -88, base: 742 },
  { x: 994, y: 398, size: .98, angle: 84, base: 765 },
  { x: 878, y: 397, size: .86, angle: -37, base: 757 },
  { x: 803, y: 283, size: .45, angle: -8, base: 752, small: true },
  { x: 745, y: 336, size: .82, angle: -8, base: 752, small: true },
  { x: 709, y: 399, size: .48, angle: -20, base: 747, small: true },
  { x: 919, y: 429, size: .45, angle: 48, base: 762, small: true },
];

const ns = 'http://www.w3.org/2000/svg';
const garden = document.querySelector('.flowers');
const stemGrowthDuration = 2.2;
const stemDelay = (index) => .2 + index * .09;
function svgElement(name, attributes = {}) {
  const element = document.createElementNS(ns, name);
  for (const [key, value] of Object.entries(attributes)) element.setAttribute(key, value);
  return element;
}

function makeBouquet() {
  const bouquet = document.createElement('div');
  bouquet.className = 'bouquet';
  const corollas = document.createElement('div');
  corollas.className = 'bouquet corollas';
  const stems = svgElement('svg', {
    viewBox: '0 0 1489 704', class: 'bouquet-stems', 'aria-hidden': 'true',
  });
  stems.innerHTML = `<defs>
    <linearGradient id="stem-color" x1="0" y1="1" x2=".3" y2="0">
      <stop offset="0" stop-color="#073336" stop-opacity=".2"/>
      <stop offset=".42" stop-color="#24777a"/>
      <stop offset="1" stop-color="#7db7a1"/>
    </linearGradient>
    <linearGradient id="leaf-color" x1="0" y1="1" x2="1" y2="0">
      <stop stop-color="#124644"/><stop offset=".5" stop-color="#3c8e42"/>
      <stop offset="1" stop-color="#82b937"/>
    </linearGradient>
  </defs>`;
  flowers.forEach((flower, index) => {
    const { x, y, base, size } = flower;
    const controlX = base + (x - base) * .17;
    const controlY = y > 350 ? y - 22 : y + 145;
    const endControlX = x + (base - x) * .2;
    const curvedFrontStem = index === 19
      ? 'M 758 715 C 701 527 852 455 745 332'
      : `M ${base} 720 C ${controlX} ${controlY}, ${endControlX} ${y + 15}, ${x} ${y - 4}`;
    stems.append(svgElement('path', {
      d: curvedFrontStem,
      class: 'growing-stem', pathLength: '1',
      style: `--stem-delay:${stemDelay(index)}s;--stem-duration:${stemGrowthDuration}s`,
      fill: 'none', stroke: 'url(#stem-color)',
      'stroke-width': flower.small ? 5 : 8 * size,
      'stroke-linecap': 'round', opacity: index < 12 ? '.78' : '.94',
    }));
  });
  const leaves = [
    [727, 158, -24, .58], [743, 241, -31, .62], [755, 242, 68, .53],
    [737, 306, -34, .93], [822, 250, -22, .8], [823, 373, -28, .98],
    [664, 406, -63, 1.04], [696, 500, -61, 1.02], [781, 462, 25, .85],
    [837, 494, 65, .85], [733, 526, -18, .83], [665, 346, -65, .58],
  ];
  for (const [x, y, rotation, scale] of leaves) {
    // Keep placement on a parent so the growth transform cannot overwrite it.
    const leafBranch = svgElement('g', {
      transform: `translate(${x} ${y}) rotate(${rotation}) scale(${scale})`,
    });
    leafBranch.append(svgElement('path', {
      d: 'M0 0 C-34 -8 -38 -42 -23 -65 C5 -45 18 -20 0 0Z',
      class: 'sprouting-leaf', style: `--leaf-delay:${1.2 + (704 - y) / 550}s`,
      fill: 'url(#leaf-color)', opacity: '.88',
    }));
    stems.append(leafBranch);
  }
  bouquet.append(stems);
  flowers.forEach((flower, index) => {
    const head = document.createElement('div');
    head.className = `blossom${flower.small ? ' blossom--small' : ''}`;
    head.style.cssText = `left:${flower.x}px;top:${flower.y}px;--size:${flower.size * .88};--angle:${flower.angle}deg;--delay:${index * -.37}s`;
    head.style.setProperty('--bloom-delay', `${stemDelay(index) + stemGrowthDuration - .1}s`);
    const growth = document.createElement('div');
    growth.className = 'blossom-growth';
    const petals = document.createElement('div');
    petals.className = 'flower__leafs';
    for (let petalIndex = 1; petalIndex <= 4; petalIndex++) {
      const petal = document.createElement('div');
      petal.className = `flower__leaf flower__leaf--${petalIndex}`;
      petals.append(petal);
    }
    const center = document.createElement('div');
    center.className = 'flower__white-circle';
    petals.append(center);
    if (flower.small) {
      for (let stamenIndex = 0; stamenIndex < 7; stamenIndex++) {
        const stamen = document.createElement('i');
        stamen.className = 'stamen';
        stamen.style.setProperty('--stamen-angle', `${(stamenIndex - 3) * 19}deg`);
        stamen.style.setProperty('--stamen-length', `${26 + (stamenIndex % 3) * 9}px`);
        petals.append(stamen);
      }
    }
    growth.append(petals);
    head.append(growth);
    corollas.append(head);
  });
  garden.prepend(bouquet);
  garden.append(corollas);
}

// Fixed seed: droplets keep their positions when the page is reloaded.
let seed = 219;
function random() {
  seed = (seed * 1664525 + 1013904223) >>> 0;
  return seed / 4294967296;
}
function makeDew() {
  const dew = svgElement('svg', {
    class: 'dew', viewBox: '0 0 1489 704',
    preserveAspectRatio: 'xMidYMid slice', 'aria-hidden': 'true',
  });
  dew.innerHTML = `<defs>
  <filter id="night-grain" x="0" y="0" width="100%" height="100%">
    <feTurbulence type="fractalNoise" baseFrequency=".65" numOctaves="3" seed="12" stitchTiles="stitch"/>
    <feColorMatrix type="saturate" values="0"/>
  </filter>
  <radialGradient id="droplet" cx=".35" cy=".2" r=".8">
    <stop stop-color="#97bdb3" stop-opacity=".42"/>
    <stop offset=".28" stop-color="#3d6464" stop-opacity=".14"/>
    <stop offset=".65" stop-color="#020b0e" stop-opacity=".85"/>
    <stop offset="1" stop-color="#3d6665" stop-opacity=".1"/>
  </radialGradient></defs>
  <rect width="1489" height="704" filter="url(#night-grain)" opacity=".025"/>`;
  for (let index = 0; index < 470; index++) {
    const x = random() * 1489;
    const y = random() * 690;
    const radius = 1.1 + random() * 2.6;
    dew.append(svgElement('ellipse', {
      cx: x, cy: y, rx: radius, ry: radius * (1 + random() * .4),
      fill: 'url(#droplet)', opacity: .2 + (1 - y / 704) * .65,
    }));
  }
  document.querySelector('.night').append(dew);
}
function fitGarden() {
  const width = document.documentElement.clientWidth;
  const height = window.innerHeight;
  const scale = Math.min(height / 704, width / 820);
  garden.style.setProperty('--scene-scale', scale);
  garden.style.setProperty('--scene-bottom', `${Math.max(0, (height - 704 * scale) * .45)}px`);
}

function makeFallingPetals() {
  const layer = document.createElement('div');
  layer.className = 'falling-petals';
  layer.setAttribute('aria-hidden', 'true');
  // Fixed particle count, animated by CSS: no timers or accumulating elements.
  for (let index = 0; index < 28; index++) {
    const fall = document.createElement('span');
    fall.className = 'petal-fall';
    const duration = 11 + random() * 9;
    fall.style.cssText = `left:${random() * 100}%;--fall-duration:${duration}s;--fall-delay:${-random() * duration}s;--drift:${(random() - .5) * 150}px;--petal-size:${9 + random() * 12}px;--flutter-duration:${2.5 + random() * 3}s`;
    const petal = document.createElement('i');
    petal.className = 'falling-petal';
    fall.append(petal);
    layer.append(fall);
  }
  document.body.append(layer);
}

function setupMusic() {
  const audio = document.querySelector('#garden-music');
  const button = document.querySelector('#music-toggle');
  audio.volume = .55;
  let starting = false;

  function removeGestureListeners() {
    document.removeEventListener('pointerdown', startOnGesture);
    document.removeEventListener('keydown', startOnGesture);
  }
  async function playMusic() {
    if (starting) return;
    starting = true;
    try {
      await audio.play();
    } catch (error) {
      // Browsers may require a real user gesture before allowing audible audio.
      button.textContent = error.name === 'NotAllowedError'
        ? '♫ Activar música' : '♫ Reintentar música';
    } finally {
      starting = false;
    }
  }
  function startOnGesture(event) {
    if (button.contains(event.target)) return;
    if (event.type === 'keydown' && !['Enter', ' '].includes(event.key)) return;
    void playMusic();
  }
  audio.addEventListener('playing', () => {
    button.textContent = '♫ Pausar música';
    button.classList.add('is-playing');
    removeGestureListeners();
  });
  const showPaused = () => {
    button.textContent = '♫ Reproducir música';
    button.classList.remove('is-playing');
  };
  audio.addEventListener('pause', showPaused);
  audio.addEventListener('ended', showPaused);
  audio.addEventListener('error', () => {
    button.textContent = '♫ Audio no disponible';
    button.classList.remove('is-playing');
    removeGestureListeners();
  });
  button.addEventListener('click', () => {
    if (audio.paused) void playMusic();
    else audio.pause();
  });
  document.addEventListener('pointerdown', startOnGesture);
  document.addEventListener('keydown', startOnGesture);
  void playMusic();
}
makeBouquet();
makeDew();
makeFallingPetals();
fitGarden();
window.addEventListener('resize', fitGarden, { passive: true });
document.body.classList.remove('container');
setupMusic();
