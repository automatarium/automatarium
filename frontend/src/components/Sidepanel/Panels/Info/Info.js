import { useMemo } from 'react'
import { parseRead, validTransitions } from '@automatarium/simulation'

import { Details } from '/src/components'
import { useProjectStore } from '/src/stores'

import { Wrapper, Symbol, SymbolList, Table } from './infoStyle'
import SectionLabel from '../../../SectionLabel/SectionLabel'

const Info = () => {
  const statePrefix = useProjectStore(s => s.project?.config?.statePrefix) ?? 'q'
  const states = useProjectStore(s => s.project?.states) ?? []
  const transitions = useProjectStore(s => s.project?.transitions) ?? []
  const initialState = useProjectStore(s => s.project?.initialState)
  const graph = { states, transitions, initialState }

  // Determine alphabet
  const alphabet = useMemo(() =>
    Array.from(new Set(transitions
      .map(tr => tr.read ? parseRead(tr.read) : [])
      .reduce((a, b) => [...a, ...b], [])
      .sort()
    ))
  )

  // Resolve graph
  const resolvedGraph = useMemo(() => ({
    ...graph, transitions: graph.transitions.map(tr => ({ ...tr, read: tr.read ? parseRead(tr.read) : []}))
  }))

  const transitionMap = useMemo(() => {
    let map = {} // (ID, Symbol) -> ID[]
    for (let state of states) {
      for (let symbol of alphabet) {
        const transitions = validTransitions(resolvedGraph, state.id, symbol)
        for (let { transition } of transitions) {
          map[[state.id, symbol]] = Array.from(new Set([...map[[state.id, symbol]] ?? [], transition.to]))
        }
      }
    }

    return map
  })

  return <>
    <SectionLabel>Alphabet</SectionLabel>
    <Wrapper>
      <SymbolList>
        {alphabet.map(symbol => <Symbol key={symbol}>{symbol}</Symbol>)}
      </SymbolList>
    </Wrapper>
    
    <SectionLabel>Transition Function</SectionLabel>
    <Wrapper>
      <Table>
        <tbody>
          <tr>
            <th>Q &times; &Sigma;</th>
            <th> &delta;(Q &times; &Sigma;) </th>
          </tr>
          {Object.entries(transitionMap).map(([key, states]) => <tr key={key}>
            <td>({statePrefix}{key.split(',')[0]}, {key.split(',')[1]})</td>
            <td>{`{${states.sort().map(s => `${statePrefix}${s}`).join(',')}}`}</td>
          </tr>)}
        </tbody>
      </Table>
    </Wrapper>

    <SectionLabel>State Transition Table</SectionLabel>
    <Wrapper>
      <Table>
        <tbody>
          <tr>
            <th></th>
            {alphabet.map(symbol => <th key={symbol}>{symbol}</th>)}
          </tr>
          {resolvedGraph.states.map(state => <tr key={state.id}> 
            <th>{statePrefix}{state.id}</th>
            {alphabet.map(symbol => <td key={symbol}>
              {Object.entries(transitionMap)
                .filter(([key]) => key.split(',')[0] == state.id && key.split(',')[1] == symbol)
                .map(([, states]) => states.map(s => `${statePrefix}${s}`).join(', '))[0] ?? '-'}
            </td>)}
          </tr>)}
        </tbody>
      </Table>
    </Wrapper>
  </>
}

export default Info
