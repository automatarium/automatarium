import { MouseEvent } from 'react'
import { handleStyle } from './changeTransitionHandleStyle'
import { BOX_HANDLE_SIZE } from '/src/config/rendering'
import { CustomEvents } from '/src/hooks/useEvent'
import { dispatchCustomEvent } from '/src/util/events'

type TransitionChangeHandle = {
  cx: number
  cy: number
  transitionId: number
  fromId: number
  toId: number
  isStart: boolean
}

const ChangeTransitionHandle = ({ cx, cy, transitionId, fromId, toId, isStart, ...props }: TransitionChangeHandle) => {
  // console.log(`${transitionId} ${fromId} ${toId} ${isStart}`)

  // Middle-ise co-ordinates
  const x = cx - BOX_HANDLE_SIZE / 2
  const y = cy - BOX_HANDLE_SIZE / 2

  return <g transform={`translate(${x}, ${y})`}
            {...props}>
    <rect width={BOX_HANDLE_SIZE} height={BOX_HANDLE_SIZE} style={handleStyle} z={99999} />
  </g>
}

export default ChangeTransitionHandle
