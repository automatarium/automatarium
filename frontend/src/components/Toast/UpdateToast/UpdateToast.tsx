import { StyledUpdateToast } from "./updateToastStyle";

export function UpdateToast() {
  return (
    <StyledUpdateToast onClick={() => window.location.reload()}>
      A new version is available – click to refresh
    </StyledUpdateToast>
  );
}