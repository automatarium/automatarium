export const dispatchCustomEvent = (name, detail) => {
  document.dispatchEvent(new CustomEvent(name, { detail }))
}
