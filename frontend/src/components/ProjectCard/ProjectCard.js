import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)

import { Logo } from '/src/components'

import { CardContainer, CardImage, TypeBadge, CardDetail } from './projectCardStyle'

const ProjectCard = ({ name, type, date, image, ...props }) => (
  <CardContainer {...props}>
    <CardImage $image={!!image}>
      {image ? <img src={image} alt="" /> : <Logo />}
      <TypeBadge>{type}</TypeBadge>
    </CardImage>
    <CardDetail>
      <strong>{name}</strong>
      {date && <span>{date instanceof dayjs ? dayjs().to(date) : date}</span>}
    </CardDetail>
  </CardContainer>
)

export default ProjectCard
