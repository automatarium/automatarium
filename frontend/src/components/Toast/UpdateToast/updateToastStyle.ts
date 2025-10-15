import { styled } from 'goober'

export const StyledUpdateToast = styled("div")`
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  background: var(--toolbar);
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
  z-index: 9999;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  transition: opacity 0.3s ease;
`;