import { ChevronDown, ChevronUp } from 'lucide-react'

import { SectionLabel } from '/src/components'

import { StyledDetails } from './detailsStyle'

const Details = ({ label, children }) =>
  <StyledDetails open>
    <SectionLabel as='summary'>
      {label}
      <ChevronDown className='chevron-down' />
      <ChevronUp className='chevron-up' />
    </SectionLabel>
    {children}
  </StyledDetails>

export default Details
