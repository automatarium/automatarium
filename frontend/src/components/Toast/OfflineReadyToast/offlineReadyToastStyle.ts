import { styled } from 'goober'

export const StyledOfflineReadyToast = styled("div")`
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%) translateY(10px);
  background: var(--toolbar);
  color: var(--white);
  padding: 12px 20px;
  border-radius: 8px;
  font-size: 14px;
  opacity: 0;
  z-index: 9999;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  transition: opacity 0.4s ease, transform 0.4s ease;
`;