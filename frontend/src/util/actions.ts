export const haveInputFocused = (e: Event) =>
  ['input', 'textarea', 'select'].includes((e.target as HTMLElement).tagName.toLowerCase())
