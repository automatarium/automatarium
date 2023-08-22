import dayjs, { Dayjs } from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

import { Logo } from '/src/components'

import { MoreVertical } from 'lucide-react'
import { ButtonHTMLAttributes, Ref } from 'react'
import { CardContainer, CardDetail, CardImage, SelectedTemplateOverlay, TitleAndKebab, TypeBadge } from './projectCardStyle'
import { ProjectType } from '/src/types/ProjectTypes'
dayjs.extend(relativeTime)

type ProjectCardProps = {
  name: string
  type?: ProjectType | '???' // '???' is used has a default type
  date: string | Dayjs
  image?: string
  isSelectedTemplate?: boolean,
  width: number,
  $istemplate: boolean,
  // Typescript currently doesn't supprt the spread operator with generics.
  // So we need to workaround that and add the extra props ourself
  onClick?: ButtonHTMLAttributes<HTMLButtonElement>['onClick']
  $kebabClick?: ButtonHTMLAttributes<HTMLAnchorElement>['onClick'],
  $kebabRef?: Ref<HTMLAnchorElement>
  disabled?: boolean,
}

const ProjectCard = ({ name, type, date, image, isSelectedTemplate = false, ...props }: ProjectCardProps) => {
  const { ...rest } = props
  return <CardContainer {...rest}>
    <CardImage $image={!!image}>
      {image ? <img src={image} alt="" /> : <Logo />}
      {type && <TypeBadge>{type}</TypeBadge>}
      {/* Highlight a template if it is selected */}
      {isSelectedTemplate && <SelectedTemplateOverlay/>}
    </CardImage>
    <CardDetail>
      <TitleAndKebab>
        <strong>{name}</strong>
        <div>
          <a onClick={props.$kebabClick} ref={props.$kebabRef}>
            <MoreVertical/>
          </a>
        </div>
      </TitleAndKebab>
      {date && <span>{date instanceof dayjs ? dayjs().to(date) : date as string}</span>}
    </CardDetail>
  </CardContainer>
}

export default ProjectCard
