import { Link } from 'react-router-dom'
import { Github } from 'lucide-react'

import { Sections, ColumnsSection, BannerSection } from './landingStyle'
import { Main, Button, Header } from '/src/components'

import automataSVG from './svgs/automata.svg'
import testingSVG from './svgs/testing.svg'
import matrixSVG from './svgs/matrix.svg'

const Landing = () => {

  return <Main fullWidth>
    <Header center />
    <Sections>
      <ColumnsSection>
        <img src={automataSVG} />
        <div>
          <p>
            Automatarium is a student-built platform for automata and formal language theory.<br/><br/>
            Create a Finite Automaton, Push Down Automaton or Turing Machine with a simple and intuitive design.
          </p>
          <Link to='/new'><Button>Start building!</Button></Link>
        </div>
      </ColumnsSection>
      <BannerSection>
        <h3>Automatarium is open-source and free</h3>
        <p>Licensed under MIT, and hosted by RMIT University for everyone to use</p>
        <a href='https://github.com/automatarium/automatarium'><Button icon={<Github/>}>Visit Github</Button></a>
      </BannerSection>
      <ColumnsSection $reverse>
        <img src={testingSVG}/>
        <div>
          <h3>Fully-featured testing lab</h3>
          <p>
            Automatarium provides a simple but powerful testing lab. Step through inputs and see a live trace of what is happening. Run many tests at once and see which succeed and fail.
          </p>
        </div>
      </ColumnsSection>
      <ColumnsSection>
        <img src={matrixSVG}/>
        <div>
          <h3>Explore your automata</h3>
          <p>
            Stuff about automata.
          </p>
        </div>
      </ColumnsSection>
      <BannerSection>
        <h3>What are you waiting for?</h3>
        <p>Start building and testing your automata now!</p>
        <Link to='/new'><Button>Start building!</Button></Link>
      </BannerSection>
    </Sections>
  </Main>
}

export default Landing
