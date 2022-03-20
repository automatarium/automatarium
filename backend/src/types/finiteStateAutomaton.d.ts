import { bezierControlPoint } from './main'

export type finiteStateAutomatonState = {
  id: number
  name: string
  label: string
  x: number
  y: number
  isFinal: boolean
}

export type finiteStateAutomatonTransition = {
  from: number
  to: number
  read: string
  bezierControlPoint: bezierControlPoint
} 