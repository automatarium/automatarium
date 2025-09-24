
interface TourContentProps {
  isBannerStep: boolean
  tourStep: number
}

interface Step {
  target: string
  content: string
  gifUrl: string | null
}