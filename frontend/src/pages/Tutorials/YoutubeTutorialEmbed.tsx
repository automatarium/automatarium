const EmbeddedVideo = ({ id }) => <iframe
    width={560}
    height={315}
    src={`https://www.youtube.com/embed/${id}`}
    allow="accelerometer; clipboard-write; encrypted-media"
    allowFullScreen
    title="Tutorial Video"
  />

export default EmbeddedVideo
