import { Github } from 'lucide-react'

import { Sections, Section, Banner } from './landingStyle'
import { Main, Button, Header, Table, ProjectCard } from '/src/components'

import ExampleAutomaton from './components/ExampleAutomaton'
import TestingLab from './components/TestingLab'

import { PROJECT_THUMBNAIL_WIDTH } from '/src/config/rendering'

const Landing = () => (
  <Main fullWidth style={{ paddingBottom: 0 }}>
    <Header center />
    <Sections>
      <Section>
        <ExampleAutomaton />
        <div className="text">
          <p>Automatarium is a student-built platform for automata and formal language theory.</p>
          <p>Work easily with a simple and intuitive design built for ease of use and accessibility.</p>
          <p>It's free to use, and syncs your projects and preferences across all your devices.</p>
          <Button to="/new">Start building!</Button>
        </div>
      </Section>

      <Banner>
        <h3>Automatarium is open-source and free</h3>
        <p>Licensed under MIT, and hosted by RMIT University for everyone to use</p>
        <Button
          icon={<Github />}
          href="https://github.com/automatarium/automatarium"
          target="_blank"
          rel="nofollow noreferrer"
        >Visit Github</Button>
      </Banner>

      <Section $reverse>
        <TestingLab />
        <div className="text">
          <h3>Fully-featured testing lab</h3>
          <p>Automatarium provides a simple but powerful testing lab. Step through inputs and see a live trace of what is happening. Try changing the input in the example and see what happens.</p>
          <p>There is also a multi-run feature, run many tests at once and see which succeed and fail.</p>
        </div>
      </Section>

      <Section>
        <Table>
          <tbody>
            <tr><th>&delta;</th><th>a</th><th>b</th></tr>
            <tr><th>q0</th><td>q1</td><td>-</td></tr>
            <tr><th>q1</th><td>-</td><td>q2</td></tr>
            <tr><th>q2</th><td>-</td><td>-</td></tr>
          </tbody>
        </Table>
        <div className="text">
          <h3>Explore your automata</h3>
          <p>Automatarium provides tools to inspect your automaton and learn about how it reacts to different inputs.</p>
        </div>
      </Section>

      <Section $reverse>
        <ProjectCard name="My Project" type="FSA" date="2 days ago" disabled width={PROJECT_THUMBNAIL_WIDTH} $istemplate={false}/>
        <div className="text">
          <h3>Share with colleagues</h3>
          <p>Easily share your projects with your peers via a link that lets anyone make a copy of your project and continue working.</p>
        </div>
      </Section>

      <Banner>
        <h3>What are you waiting for?</h3>
        <p>Start building and testing your automata now!</p>
        <Button to="/new">Start building!</Button>
      </Banner>
    </Sections>
  </Main>
)

export default Landing
