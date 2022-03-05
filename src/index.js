import ReactDOM from 'react-dom'
import { createElement } from 'react'
import { setup } from 'goober'
import { BrowserRouter } from 'react-router-dom'

// Setup goober to use React
setup(createElement)

ReactDOM.render(
  <BrowserRouter>
    <h1>Automatarium</h1>
  </BrowserRouter>,
  document.getElementById('app')
)