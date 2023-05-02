import { MainContainer } from './mainStyle'
import { HTMLAttributes } from 'react'

interface MainProps extends HTMLAttributes<HTMLElement> {
  wide?: boolean
  fullWidth?: boolean
}

const Main = ({ wide, fullWidth, ...props }: MainProps) =>
  <MainContainer $wide={wide} $fullWidth={fullWidth} {...props}/>

export default Main
