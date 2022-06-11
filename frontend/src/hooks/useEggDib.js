const smoothHue = () => {
  const r = document.querySelector(':root')
  const currHue = Number(getComputedStyle(r).getPropertyValue('--primary-h'))
  r.style.setProperty('--primary-h', (currHue+1)%360)
}

const rainbowRoadHue = (r) => {
  const currHue = getComputedStyle(r).getPropertyValue('--primary-h')
  r.style.setProperty('--primary-h', (currHue+1)%360)
}

const useEggDib = (input, accepted) => {
  if (input === 'dib' && accepted) {
    setInterval(smoothHue, 200)
  } else if (input === 'DIB' && accepted) {
    clearInterval(activated)
  } else if (input == 'rainbowroad' && accepted) {
    const r = document.querySelector(':root')
    setInterval(() => rainbowRoadHue(r), 250)
  }
}

export default useEggDib