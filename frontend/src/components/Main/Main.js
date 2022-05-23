import { MainContainer, HeaderContainer } from './mainStyle'
import { Logo } from '/src/components'

const Main = ({wide, fullWidth, ...props}) =>
  <MainContainer $wide={wide} $fullWidth={fullWidth} {...props}/>


const Header = ({ center }) => <HeaderContainer $center={center}>
  <Logo />
  <h1>Automatarium</h1>
</HeaderContainer>

Main.Header = Header

export default Main
