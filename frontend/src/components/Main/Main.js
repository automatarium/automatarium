import { MainContainer } from './mainStyle'

const Main = ({ wide, fullWidth, ...props }) =>
  <MainContainer $wide={wide} $fullWidth={fullWidth} {...props}/>

export default Main
