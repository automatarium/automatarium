import dayjs, { Dayjs } from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

import { Logo } from '/src/components'

import { MoreVertical } from 'lucide-react'
import { ButtonHTMLAttributes } from 'react'
import kebabContextItems from '../ContextMenus/kebabContextItems'
import KebabMenu from '../KebabMenu/KebabMenu'
import { CardContainer, CardDetail, CardImage, SelectedTemplateOverlay, TitleAndKebab, TypeBadge } from './projectCardStyle'
import { ProjectType } from '/src/types/ProjectTypes'
dayjs.extend(relativeTime)

type ProjectCardProps = {
  name: string
  type?: ProjectType | '???' // '???' is used has a default type
  date: string | Dayjs
  image?: string
  isSelectedTemplate?: boolean,
  showKebab?: boolean,
  width: number,
  $istemplate: boolean,
  // Typescript currently doesn't supprt the spread operator with generics.
  // So we need to workaround that and add the extra props ourself
  onClick?: ButtonHTMLAttributes<HTMLButtonElement>['onClick']
  onKebabClick?: ButtonHTMLAttributes<HTMLButtonElement>['onClick'],
  disabled?: boolean,
}

const ProjectCard = ({ name, type, date, image, isSelectedTemplate = false, showKebab = true, ...props }: ProjectCardProps) => {
  return <CardContainer {...props}>
    <CardImage $image={!!image}>
      {image ? <img src={image} alt="" /> : <Logo />}
      {type && <TypeBadge>{type}</TypeBadge>}
      {/* Highlight a template if it is selected */}
      {isSelectedTemplate && <SelectedTemplateOverlay/>}
    </CardImage>
    <CardDetail>
      <TitleAndKebab>
      <strong>{name}</strong>
      {showKebab && <KebabMenu icon={<MoreVertical/>} kebabItems={kebabContextItems}>
        </KebabMenu>}
      </TitleAndKebab>

      {/* {showKebab && <MoreVertical/>} */}
      {date && <span>{date instanceof dayjs ? dayjs().to(date) : date as string}</span>}
    </CardDetail>
  </CardContainer>
}

export default ProjectCard
