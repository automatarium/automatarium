export const haveInputFocused = e =>
  ['input', 'textarea', 'select'].includes(e.target.tagName.toLowerCase())
