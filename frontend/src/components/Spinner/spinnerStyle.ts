import { styled } from 'goober'

export const SpinnerContainer = styled('div')`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 15em;
  height: 15em;

  svg {
    position: absolute;
    width: 15em;
    height: 15em;
  }

  svg:nth-child(2) {
    transform-origin: 47% 47%;
    animation: spin 5s linear infinite;
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`
