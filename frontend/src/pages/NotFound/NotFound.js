import { styled } from 'goober'

import { Main } from '/src/components'

const NotFound = () => <Main>
  <Main.Header center />
  <h2>404 Not Found</h2>
  <p>As recompense, try out this cool puzzle. Can you figure out what this says?</p>
  <Code>
    Svvrz sprl fvby puwba nva ylqljalk olol
  </Code>
  <Hint>
    Think about salad and backstabbing.
  </Hint>
</Main>

const Code = styled('div')`
  padding: 1em;
  background: var(--toolbar);
  font-family: monospace;
  border-radius: .5rem;
`

const Hint = styled('p')`
  margin-top: 100vh;
  color: grey;
  opacity: .2;
  border-radius: .5rem;
`

export default NotFound
