import { Main, Header } from '/src/components'

import { Code, Hint } from './notFoundStyle'

const NotFound = () => <Main>
  <Header center linkTo="/" />
  <h2>404 Not Found</h2>
  <p>As recompense, try out this cool puzzle. Can you figure out what this says?</p>
  <Code>
    Svvrz sprl fvby puwba nva ylqljalk olol
  </Code>
  <Hint>
    Think about salad and backstabbing.
  </Hint>
</Main>

export default NotFound
