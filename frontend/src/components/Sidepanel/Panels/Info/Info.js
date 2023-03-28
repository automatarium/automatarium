import { useMemo, useCallback } from 'react'
import { validTransitions, resolveGraph, closureWithPredicate } from '@automatarium/simulation'

import { useProjectStore } from '/src/stores'
import { Table, SectionLabel } from '/src/components'

import { Wrapper, Symbol, SymbolList } from './infoStyle'

const Info = () => {
  const statePrefix = useProjectStore(s => s.project?.config?.statePrefix)
  const states = useProjectStore(s => s.project?.states)
  const transitions = useProjectStore(s => s.project?.transitions)
  const initialState = useProjectStore(s => s.project?.initialState)
  const graph = { states, transitions: transitions ?? [], initialState }

  // Function to get name of state from an id
  const getStateName = useCallback(id =>
    graph.states.find(s => s.id === id)?.name || `${statePrefix ?? 'q'}${id}`,
  [graph.states, statePrefix]
  )

  // Resolve graph
  const resolvedGraph = useMemo(() => resolveGraph(graph), [graph])

  // Determine alphabet
  const alphabet = useMemo(() =>
    Array.from(new Set(resolvedGraph.transitions
      .map(tr => tr.read)
      .reduce((a, b) => [...a, ...b], [])
      .sort()
    ))
  , [transitions])

  const transitionMap = useMemo(() => {
    const map = {} // (ID, Symbol) -> ID[]
    for (const state of states ?? []) {
      for (const symbol of alphabet) {
        const transitions = validTransitions(resolvedGraph, state.id, symbol)
        for (const { transition } of transitions) {
          // Record accessibility after transition
          map[[state.id, symbol]] = Array.from(new Set([...map[[state.id, symbol]] ?? [], transition.to]))

          // Record accessibility of states indirectly accessible after transition via lambdas
          if (transition.read.length > 0) {
            const lambdaClosure = closureWithPredicate(resolvedGraph, transition.to, tr => tr.read.length === 0)
            for (const [stateID] of lambdaClosure) {
              map[[state.id, symbol]] = Array.from(new Set([...map[[state.id, symbol]] ?? [], stateID]))
            }
          }
        }
      }
    }

    return map
  }, [states, alphabet, resolvedGraph])

  return <>
    <SectionLabel>Alphabet</SectionLabel>
    <Wrapper>
      <SymbolList>
        {alphabet.map(symbol => <Symbol key={symbol}>{symbol}</Symbol>)}
      </SymbolList>
    </Wrapper>

    <SectionLabel>State Transition Table</SectionLabel>
    <Wrapper>
      <Table>
        <tbody>
          <tr>
            <th>&delta;</th>
            {alphabet.map(symbol => <th key={symbol}>{symbol}</th>)}
          </tr>
          {resolvedGraph.states?.map(state => <tr key={state.id}>
            <th>{getStateName(state.id)}</th>
            {alphabet.map(symbol => <td key={symbol}>
              {Object.entries(transitionMap)
                .filter(([key]) => key.split(',')[0] === state.id.toString() && key.split(',')[1] === symbol)
                .map(([, states]) => states.map(id => getStateName(id)).join(', '))[0] ?? '-'}
            </td>)}
          </tr>)}
        </tbody>
      </Table>
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
            <td>({getStateName(Number(key.split(',')[0]))}, {key.split(',')[1]})</td>
            <td>{`{${states.sort().map(id => getStateName(id)).join(',')}}`}</td>
          </tr>)}
        </tbody>
      </Table>
    </Wrapper>
  </>
}

export default Info
