import {
  DirectionRadioGroup,
  DirectionLabel,
  DirectionRadioInput
} from './directionRadioButtonsStyle'

import { TMDirection } from '/src/types/ProjectTypes'

interface DirectionProps {
  direction: TMDirection;
  setDirection: (value: TMDirection) => void;
  handleSave: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  name: string;
}

export const DirectionRadioButtons = ({
  direction,
  setDirection,
  handleSave,
  name
}: DirectionProps) => {
  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key.toUpperCase()) {
      case 'R':
        setDirection('R')
        break
      case 'L':
        setDirection('L')
        break
      case 'S':
        setDirection('S')
        break
      default:
        handleSave(e)
        break
    }
  }

  return (
    <DirectionRadioGroup>
      <DirectionLabel htmlFor={`${name}-direction-R`}>
        <DirectionRadioInput
          id={`${name}-direction-R`}
          type="radio"
          name={name}
          value="R"
          checked={direction === 'R'}
          onChange={(e) => setDirection(e.target.value as TMDirection)}
          onKeyUp={handleKeyUp}
        />
        R
      </DirectionLabel>
      <DirectionLabel htmlFor={`${name}-direction-L`}>
        <DirectionRadioInput
          id={`${name}-direction-L`}
          type="radio"
          name={name}
          value="L"
          checked={direction === 'L'}
          onChange={(e) => setDirection(e.target.value as TMDirection)}
          onKeyUp={handleKeyUp}
        />
        L
      </DirectionLabel>
      <DirectionLabel htmlFor={`${name}-direction-S`}>
        <DirectionRadioInput
          id={`${name}-direction-S`}
          type="radio"
          name={name}
          value="S"
          checked={direction === 'S'}
          onChange={(e) => setDirection(e.target.value as TMDirection)}
          onKeyUp={handleKeyUp}
        />
        S
      </DirectionLabel>
    </DirectionRadioGroup>
  )
}
