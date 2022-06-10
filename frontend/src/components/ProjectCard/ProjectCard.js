import { useState } from 'react'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

import { Logo } from '/src/components'
import { deleteProject } from '/src/services'
import { useProjectsStore } from '/src/stores'

// Extend dayjs
dayjs.extend(relativeTime)

import { CardContainer, CardImage, TypeBadge, CardDetail } from './projectCardStyle'
import { MoreVertical } from 'lucide-react'

const ProjectCard = ({ name, type, date, pid, ...props }) => {
  const deleteProjectFromStore = useProjectsStore(s => s.deleteProject)
  return <CardContainer {...props}>
    <CardImage>
      <Logo />
      <TypeBadge>{type}</TypeBadge>
    </CardImage>
    <CardDetail>
      <div>
        <strong>{name}</strong>
        <MoreVertical onClick={(e) => {
          e.stopPropagation()
          deleteProject(pid).then((res) => {
            console.log(res)
            deleteProjectFromStore(pid)
          }).catch((err) => {
            console.error(err)
          })

        }}/>
      </div>
      <span>{dayjs().to(date)}</span>
    </CardDetail>
  </CardContainer>
}

export default ProjectCard
