import { Main, Header } from '/src/components'

const About = () => (
  <Main>
    <Header center linkTo="/" />
    <h2>About</h2>

    <p>Automatarium is a student-led project to provide a modern, intuitive interface for creating and testing automata.</p>
    <p>Inspired by <a href="https://www.jflap.org/" target="_blank" rel="nofollow noreferrer">JFLAP</a>, Automatarium allows you to draw a graph, define transitions, and use the Testing Lab to test inputs. There are plans to implement other types of automata such as Push-Down Automata and Turing Machines in the future.</p>
    <p>Automatarium is open-source, licensed under MIT, and <a href="https://github.com/automatarium/automatarium" target="_blank" rel="nofollow noreferrer">hosted on Github</a>. If you spot any bugs or have a feature request, you are welcome to <a href="https://github.com/automatarium/automatarium/issues/new/choose" target="_blank" rel="nofollow noreferrer">create an issue</a>.</p>
  </Main>
)

export default About
