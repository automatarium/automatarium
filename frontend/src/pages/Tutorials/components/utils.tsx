export const isYoutube = (link: string) => {
  const tokens = link.split('/') ?? null
  return tokens.find(tk => tk === 'youtu.be') === undefined ? null : tokens[tokens.length - 1]
}
