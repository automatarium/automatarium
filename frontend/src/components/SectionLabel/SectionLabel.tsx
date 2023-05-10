import { Label } from './sectionLabelStyle'
import { HTMLAttributes, ReactNode } from 'react'

interface SectionLabelProps extends HTMLAttributes<HTMLLabelElement> {
  children: ReactNode
  as?: string
}

const SectionLabel = ({ children, ...props }: SectionLabelProps) =>
  <Label {...props}>
    {children}
  </Label>

export default SectionLabel
