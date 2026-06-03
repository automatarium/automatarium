import { useMemo, useCallback } from 'react'
import { validTransitions, closureWithPredicate } from '@automatarium/simulation'

import { useProjectStore } from '/src/stores'
import { Table, SectionLabel } from '/src/components'

import { Wrapper, Symbol, SymbolList } from './infoStyle'
import { StateID } from '@automatarium/simulation/src/graph'
import { AutomataProjectGraph, PDAProjectGraph } from '/src/types/ProjectTypes'
import { useTranslation } from 'react-i18next'

const Info = () => {
  const statePrefix = useProjectStore(s => s.project?.config?.statePrefix)
  const states = useProjectStore(s => s.project?.states)
  const graph = useProjectStore(s => s.getGraph())
  const projectType = useProjectStore(s => s.project.config.type)
  const { t } = useTranslation('common')

  const automataGraph = graph.projectType === 'GRAMMAR' ? null : graph as AutomataProjectGraph

  // Function to get name of state from an id
  const getStateName = useCallback((id: number) =>
    graph.states?.find(s => s.id === id)?.name || `${statePrefix ?? 'q'}${id}`,
  [graph.states, statePrefix]
  )

  // Determine alphabet
  const alphabet = useMemo(() => {
    if (!automataGraph) { return [] }

    const symbolSet = new Set<string>()
    for (const transition of automataGraph.transitions) {
      if (transition.read.startsWith('!')) {
        symbolSet.add(transition.read)
      } else {
        for (const symbol of transition.read.split('')) {
          symbolSet.add(symbol)
        }
      }
    }

    return Array.from(symbolSet).sort()
  }, [automataGraph])

  // Determine stack alphabet
  const stackAlphabet = useMemo(() => {
    if (projectType !== 'PDA' || !automataGraph) return []

    const pdaGraph = automataGraph as PDAProjectGraph
    const stackAlphabetSet = new Set<string>()

    pdaGraph.transitions.forEach((transition) => {
      if (transition.pop) stackAlphabetSet.add(transition.pop)
      if (transition.push) stackAlphabetSet.add(transition.push)
    })
    return Array.from(stackAlphabetSet).sort()
  }, [automataGraph, projectType])

  const transitionMap = useMemo(() => {
    const map = new Map<[StateID, string], StateID[]>() // (ID, Symbol) -> ID[]
    if (!automataGraph) { return map }
    for (const state of states ?? []) {
      for (const symbol of alphabet) {
        const key: [number, string] = [state.id, symbol]
        const transitions = validTransitions(automataGraph, state.id, symbol)
        for (const { transition } of transitions) {
          map.set(key, Array.from(new Set([...map.get(key) ?? [], transition.to])))
          if (transition.read.length > 0) {
            const lambdaClosure = closureWithPredicate(automataGraph, transition.to, tr => tr.read.length === 0)
            for (const { state } of lambdaClosure) {
              map.set(key, Array.from(new Set([...map.get(key) ?? [], state])))
            }
          }
        }
      }
    }
    return map
  }, [states, alphabet, automataGraph])

  return <>
    <SectionLabel>{t('info.alphabet')}</SectionLabel>
    <Wrapper>
      <SymbolList>
        {alphabet.map(symbol => <Symbol key={symbol}>{symbol}</Symbol>)}
      </SymbolList>
    </Wrapper>

   {projectType === 'PDA' && (
      <>
        <SectionLabel>{t('info.stack_alphabet')}</SectionLabel>
        <Wrapper>
          <SymbolList>
            {stackAlphabet.map(symbol => <Symbol key={symbol}>{symbol}</Symbol>)}
          </SymbolList>
        </Wrapper>
      </>
   )}

    <SectionLabel>{t('info.state_transition_table')}</SectionLabel>
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

    <SectionLabel>{t('info.transition_function')}</SectionLabel>
    <Wrapper>
      <Table>
        <tbody>
          <tr>
            <th>Q &times; &Sigma;</th>
            <th> &delta;(Q &times; &Sigma;) </th>
          </tr>
          {[...transitionMap.entries()].map(([[state, read], states]) => <tr key={`${state},${read}`}>
            <td>({getStateName(state)}, {read})</td>
            <td>{`{${states.sort().map(id => getStateName(id)).join(',')}}`}</td>
          </tr>)}
        </tbody>
      </Table>
    </Wrapper>
  </>
}

export default Info
