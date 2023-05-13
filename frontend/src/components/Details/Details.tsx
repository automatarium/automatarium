import { ChevronDown, ChevronUp } from 'lucide-react'

import { SectionLabel } from '/src/components'

import { StyledDetails } from './detailsStyle'
import { ReactNode } from 'react'

const Details = ({ label, children }: {label: string, children: ReactNode}) =>
  <StyledDetails open>
    <SectionLabel as='summary'>
      {label}
      <ChevronDown className='chevron-down' />
      <ChevronUp className='chevron-up' />
    </SectionLabel>
    {children}
  </StyledDetails>

export default Details
