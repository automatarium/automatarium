import { Label } from './sectionLabelStyle'

const SectionLabel = ({ children, ...props }) =>
  <Label {...props}>
    {children}
  </Label>

export default SectionLabel
