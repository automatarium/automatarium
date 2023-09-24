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
}

export const DirectionRadioButtons = ({
  direction,
  setDirection,
  handleSave
}: DirectionProps) => {
  return (
    <DirectionRadioGroup>
      <DirectionLabel htmlFor="direction-R">
        <DirectionRadioInput
          id="direction-R"
          type="radio"
          name="direction"
          value="R"
          checked={direction === 'R'}
          onChange={(e) => setDirection(e.target.value as TMDirection)}
          onKeyUp={handleSave}
          tabIndex={0}
        />
        R
      </DirectionLabel>
      <DirectionLabel htmlFor="direction-L">
        <DirectionRadioInput
          id="direction-L"
          type="radio"
          name="direction"
          value="L"
          checked={direction === 'L'}
          onChange={(e) => setDirection(e.target.value as TMDirection)}
          onKeyUp={handleSave}
          tabIndex={1}
        />
        L
      </DirectionLabel>
      <DirectionLabel htmlFor="direction-S">
        <DirectionRadioInput
          id="direction-S"
          type="radio"
          name="direction"
          value="S"
          checked={direction === 'S'}
          onChange={(e) => setDirection(e.target.value as TMDirection)}
          onKeyUp={handleSave}
          tabIndex={2}
        />
        S
      </DirectionLabel>
    </DirectionRadioGroup>
  )
}
