import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

import { Logo } from '/src/components'

// Extend dayjs
dayjs.extend(relativeTime)

import { CardContainer, CardImage, TypeBadge, CardDetail } from './projectCardStyle'

const ProjectCard = ({ name, type, date, ...props }) =>
  <CardContainer {...props}>
    <CardImage>
      <Logo />
      <TypeBadge>{type}</TypeBadge>
    </CardImage>
    <CardDetail>
      <strong>{name}</strong>
      <span>{dayjs().to(date)}</span>
    </CardDetail>
  </CardContainer>

export default ProjectCard
