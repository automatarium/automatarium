import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

import { Logo } from '/src/components'
import { deleteProject } from '/src/services'
import { useProjectsStore } from '/src/stores'

import { CardContainer, CardImage, TypeBadge, CardDetail, SelectedTemplateOverlay } from './projectCardStyle'
import { MoreVertical } from 'lucide-react'
dayjs.extend(relativeTime)

const ProjectCard = ({ name, type, date, image, projectId, isSelectedTemplate, showKebab = true, ...props }) => {
  const deleteProjectFromStore = useProjectsStore(s => s.deleteProject)
  return <CardContainer {...props}>
    <CardImage $image={!!image}>
      {image ? <img src={image} alt="" /> : <Logo />}
      {type && <TypeBadge>{type}</TypeBadge>}
      {/* Highlight a template if it is selected */}
      {isSelectedTemplate && <SelectedTemplateOverlay/>}
    </CardImage>
    <CardDetail>
      <strong>{name}</strong>
      {showKebab &&
        <MoreVertical onClick={(e) => {
          e.stopPropagation()
          blah(projectId)
          deleteProject(projectId).then((res) => {
            console.log(res)
            deleteProjectFromStore(projectId)
          }).catch((err) => {
            console.error(err)
          })
        }}/>
      }
      {date && <span>{date instanceof dayjs ? dayjs().to(date) : date}</span>}
    </CardDetail>
  </CardContainer>
}

export default ProjectCard
