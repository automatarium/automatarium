const EmbeddedVideo = ({ link }) => {
  const parseId = (link: string) => {
    const tokens = link.split('/') ?? null
    return tokens.find(tk => tk === 'youtu.be') === undefined ? null : tokens[tokens.length - 1]
  }

  const vidId = parseId(link)

  return vidId && <iframe
      width={560}
      height={315}
      src={`https://www.youtube.com/embed/${vidId}`}
      allow="accelerometer; clipboard-write; encrypted-media"
      allowFullScreen
      title="Tutorial Video"
    />
}

export default EmbeddedVideo
