import { styled } from 'goober'

export const Container = styled('footer')`
  display: flex;
  align-items: center;
  gap: 1em;
  padding-inline: 1em;
  margin-top: auto;
  bottom: 0;
  left: 0;
  width: 100%;
  min-height: 3em;
  box-sizing: border-box;

  background: var(--toolbar);
`

export const FooterItem = styled('span')`
  color: var(--white);
  font-size: .9em;

  > a {
    text-decoration: underline;
    color: inherit;
    &:hover {
      color: var(--primary);
    }
  }
`
