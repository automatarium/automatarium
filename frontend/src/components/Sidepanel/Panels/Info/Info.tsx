import { useMemo, useCallback } from 'react'
import { validTransitions, closureWithPredicate } from '@automatarium/simulation'

import { useProjectStore } from '/src/stores'
import { Table, SectionLabel } from '/src/components'

import { Wrapper, Symbol, SymbolList } from './infoStyle'
import { StateID } from '@automatarium/simulation/src/graph'

const Info = () => {
  const statePrefix = useProjectStore(s => s.project?.config?.statePrefix)
  const states = useProjectStore(s => s.project?.states)
  const transitions = useProjectStore(s => s.project?.transitions)
  const graph = useProjectStore(s => s.getGraph())

  // Function to get name of state from an id
  const getStateName = useCallback(id =>
    graph.states.find(s => s.id === id)?.name || `${statePrefix ?? 'q'}${id}`,
  [graph.states, statePrefix]
  )

  // Determine alphabet
  const alphabet = useMemo(() =>
    Array.from(new Set(graph.transitions
      .map(tr => tr.read)
      .reduce((a, b) => [...a, ...b], [] as string[])
      .sort() as string[]
    ))
  , [transitions])

  const transitionMap = useMemo(() => {
    const map = new Map<[StateID, string], StateID[]>() // (ID, Symbol) -> ID[]
    for (const state of states ?? []) {
      for (const symbol of alphabet) {
        const transitions = validTransitions(graph, state.id, symbol)
        for (const { transition } of transitions) {
          // Record accessibility after transition
          map.set([state.id, symbol], Array.from(new Set([...map.get([state.id, symbol]) ?? [], transition.to])))
          // Record accessibility of states indirectly accessible after transition via lambdas
          if (transition.read.length > 0) {
            const lambdaClosure = closureWithPredicate(graph, transition.to, tr => tr.read.length === 0)
            for (const { state } of lambdaClosure) {
              map.set([state, symbol], Array.from(new Set([...map.get([state, symbol]) ?? [], state])))
            }
          }
        }
      }
    }
    return map
  }, [states, alphabet, graph])

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
          {graph.states?.map(state => <tr key={state.id}>
            <th>{getStateName(state.id)}</th>
            {alphabet.map(symbol => <td key={symbol}>
              {[...transitionMap.entries()]
                .filter(([[stateID, read]]) => stateID === state.id && read === symbol)
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