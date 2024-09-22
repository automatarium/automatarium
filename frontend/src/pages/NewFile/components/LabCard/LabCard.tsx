import dayjs, { Dayjs } from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

import { Logo } from '/src/components'

import { MoreVertical, Trash } from 'lucide-react'
import { ButtonHTMLAttributes, Ref } from 'react'
import { CardContainer, CardDetail, CardImage, SelectedTemplateOverlay, TitleWithAction, TypeBadge } from './labCardStyle'
import { ProjectType } from '/src/types/ProjectTypes'
dayjs.extend(relativeTime)

type labCardProps = {
    id?: number
    name: string
    // type?: ProjectType | '???' // '???' is used has a default type
    image?: string
    isSelectedTemplate?: boolean,
    width: number,
    $istemplate: boolean,
    // Typescript currently doesn't supprt the spread operator with generics.
    // So we need to workaround that and add the extra props ourself
    onClick?: ButtonHTMLAttributes<HTMLButtonElement>['onClick']
    $kebabClick?: ButtonHTMLAttributes<HTMLAnchorElement>['onClick'],
    $kebabRef?: Ref<HTMLAnchorElement>
    $deleteLabTemplate?: ButtonHTMLAttributes<HTMLAnchorElement>['onClick']
    disabled?: boolean,
}

const LabCard = ({ id, name, image, isSelectedTemplate = false, ...props }: labCardProps) => {
  const { ...rest } = props
  return <CardContainer {...rest}>
    <CardImage $image={!!image}>
      {image ? <img src={image} alt="" /> : <Logo />}
      {/* {type && <TypeBadge>{type}</TypeBadge>} */}
      {/* Highlight a template if it is selected */}
      {isSelectedTemplate && <SelectedTemplateOverlay/>}
    </CardImage>
    <CardDetail>
      <TitleWithAction>
          <strong>{name}</strong>
        {props.$istemplate
          ? <div>
            <a onClick={props.$deleteLabTemplate}>
              <Trash />
            </a>
          </div>
          : <div>
            <a onClick={props.$kebabClick} ref={props.$kebabRef}>
              <MoreVertical />
            </a>
          </div>}
      </TitleWithAction>
    </CardDetail>
  </CardContainer>
}

export default LabCard
