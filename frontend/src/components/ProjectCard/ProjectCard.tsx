import dayjs, { Dayjs } from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

import { Logo } from '/src/components'

import { CardContainer, CardImage, TypeBadge, CardDetail, SelectedTemplateOverlay } from './projectCardStyle'
import { MoreVertical } from 'lucide-react'
import { ProjectType } from '/src/types/ProjectTypes'
import { ButtonHTMLAttributes } from 'react'
dayjs.extend(relativeTime)

type ProjectCardProps = {
  name: string
  type?: ProjectType | '???' // '???' is used has a default type
  date: string | Dayjs
  image?: string
  projectId?: string,
  isSelectedTemplate?: boolean,
  showKebab?: boolean,
  width: number,
  $istemplate: boolean,
  // Typescript currently doesn't supprt the spread operator with generics.
  // So we need to workaround that and add the extra props ourself
  onClick?: ButtonHTMLAttributes<HTMLButtonElement>['onClick']
  disabled?: boolean,
}

// TODO: Remove this when projectId is actually used
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ProjectCard = ({ name, type, date, image, projectId, isSelectedTemplate = false, showKebab = true, ...props }: ProjectCardProps) => {
  return <CardContainer {...props}>
    <CardImage $image={!!image}>
      {image ? <img src={image} alt="" /> : <Logo />}
      {type && <TypeBadge>{type}</TypeBadge>}
      {/* Highlight a template if it is selected */}
      {isSelectedTemplate && <SelectedTemplateOverlay/>}
    </CardImage>
    <CardDetail>
      <strong>{name}</strong>
      {showKebab && <MoreVertical/>}
      {date && <span>{date instanceof dayjs ? dayjs().to(date) : date as string}</span>}
    </CardDetail>
  </CardContainer>
}

export default ProjectCard
