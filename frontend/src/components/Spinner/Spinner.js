import { Logo } from '/src/components'

import { SpinnerContainer } from './spinnerStyle'

const Spinner = () => <SpinnerContainer>
  <Logo hideTriangle />
  <Logo hidePlanet />
</SpinnerContainer>

export default Spinner
