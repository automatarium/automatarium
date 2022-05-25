export const dispatchEvent = (name, detail) => {
  document.dispatchEvent(new CustomEvent(name, { detail }))
}
