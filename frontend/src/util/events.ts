export const dispatchCustomEvent = (name: string, detail: any) => {
  document.dispatchEvent(new CustomEvent(name, { detail }))
}
