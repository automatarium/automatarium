export type COLOR_KEY = 'red' | 'orange' | 'green' | 'teal' | 'blue' | 'purple' | 'pink'

export type Color = {h: number, s: number, l: number}

const COLORS: Record<COLOR_KEY, Color> = {
  red: {
    h: 0,
    s: 63,
    l: 48
  },
  orange: {
    h: 38,
    s: 84,
    l: 50
  },
  green: {
    h: 111,
    s: 52,
    l: 45
  },
  teal: {
    h: 173,
    s: 100,
    l: 34
  },
  blue: {
    h: 201,
    s: 98,
    l: 41
  },
  purple: {
    h: 262,
    s: 60,
    l: 48
  },
  pink: {
    h: 316,
    s: 70,
    l: 43
  }
}

export default COLORS
