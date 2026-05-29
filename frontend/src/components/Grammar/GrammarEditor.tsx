import React, { useState } from 'react'
import { GrammarProjectGraph, Project } from '../../types/ProjectTypes'
import {
  testString,
  showDerivations,
  showFailedDerivation,
  showMultipleDerivations,
  detectType,
  convertToAutomata
} from '../../util/grammar'
import type { DerivationStep, DerivationPathResult } from '../../util/grammar'
import { useNavigate } from 'react-router-dom'
import { useEvent } from '/src/hooks'
import { convertAutomatariumToJFLAP } from '@automatarium/jflap-translator'
import { showWarning } from '/src/components/Warning/Warning'
import useProjectStore from '/src/stores/useProjectStore'

type Props = {
  project: GrammarProjectGraph
}

export default function GrammarEditor({ project }: Props) {
  const { startSymbol, productions, setStartSymbol, setProductions } = useProjectStore(
    state => ({
      startSymbol: (state.project as any).startSymbol,
      productions: (state.project as any).productions,
      setStartSymbol: state.setStartSymbol,
      setProductions: state.setProductions
    })
  )

  const [input, setInput] = useState('')
  const [result, setResult] = useState<string | null>(null)
  const [grammarType, setGrammarType] = useState<string | null>(null)
  const [editingRight, setEditingRight] = useState<Record<number, string>>({})
  const [derivationSteps, setDerivationSteps] = useState<DerivationStep[]>([])
  const [derivationPaths, setDerivationPaths] = useState<DerivationPathResult[]>([])
  const [derivationMessage, setDerivationMessage] = useState<string | null>(null)
  const [derivationFailed, setDerivationFailed] = useState(false)
  const [derivationFailureReason, setDerivationFailureReason] = useState<string | null>(null)

  const navigate = useNavigate()

  const formatRightValue = (right: string[]) =>
    right.map(rule => (rule === '' ? 'ε' : rule)).join(' | ')

  const parseRightValue = (value: string) =>
    value.split('|').map(s => {
      const trimmed = s.trim()
      return trimmed === '' || trimmed === 'ε' ? '' : trimmed
    })

  const addProduction = () => {
    setProductions([...productions, { left: '', right: [''] }])
  }

  const updateLeft = (index: number, value: string) => {
    setProductions(productions.map((production, i) =>
      i === index ? { ...production, left: value } : production
    ))
  }

  const updateRight = (index: number, value: string) => {
    setEditingRight({ ...editingRight, [index]: value })
  }

  const commitRight = (index: number, value: string) => {
    const right = parseRightValue(value)

    setProductions(productions.map((production, i) =>
      i === index ? { ...production, right } : production
    ))

    const nextEditing = { ...editingRight }
    delete nextEditing[index]
    setEditingRight(nextEditing)
  }

  const deleteProduction = (index: number) => {
    setProductions(productions.filter((_, i) => i !== index))
  }

  const handleTest = () => {
    const currentGrammar: GrammarProjectGraph = {
      projectType: 'GRAMMAR',
      startSymbol,
      productions
    }

    const ok = testString(currentGrammar, input)
    setResult(ok ? '✅ Accepted' : '❌ Rejected')
  }

  const handleDetectType = () => {
    const currentGrammar: GrammarProjectGraph = {
      projectType: 'GRAMMAR',
      startSymbol,
      productions
    }

    setGrammarType(detectType(currentGrammar))
  }

  const handleExportToFSA = () => {
    const currentGrammar: GrammarProjectGraph = {
      projectType: 'GRAMMAR',
      startSymbol,
      productions
    }

    const fsaGraph = convertToAutomata(currentGrammar, 'regular')

    const fsaData = {
      ...fsaGraph,
      _id: crypto.randomUUID(),
      comments: [],
      simResult: [],
      tests: { single: '', batch: [''] },
      meta: {
        name: 'Converted Grammar',
        dateCreated: Date.now(),
        dateEdited: Date.now(),
        version: '1.0.0',
        automatariumVersion: '1.0.0'
      },
      config: {
        type: 'FSA',
        statePrefix: 'q',
        orOperator: '|',
        acceptanceCriteria: 'both',
        color: 'orange'
      }
    }

    const blob = new Blob([JSON.stringify(fsaData, null, 2)], {
      type: 'application/json'
    })

    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = 'converted_fsa.json'
    link.click()
    URL.revokeObjectURL(link.href)
  }

  const handleExportFSAJFLAP = () => {
    const currentGrammar: GrammarProjectGraph = {
      projectType: 'GRAMMAR',
      startSymbol,
      productions
    }

    const fsaGraph = convertToAutomata(currentGrammar, 'regular')

    if (!fsaGraph) {
      showWarning('Grammar can only be exported to JFLAP when it is regular.')
      return
    }

    const jflapProject: Project = {
      ...fsaGraph,
      projectType: 'FSA',
      _id: crypto.randomUUID(),
      comments: [],
      simResult: [],
      tests: { single: '', batch: [''] },
      meta: {
        name: startSymbol ? `${startSymbol}-fsa` : 'converted-fsa',
        dateCreated: Date.now(),
        dateEdited: Date.now(),
        version: '1.0.0',
        automatariumVersion: '1.0.0'
      },
      config: {
        type: 'FSA',
        statePrefix: 'q',
        orOperator: '|',
        acceptanceCriteria: 'both',
        color: 'orange'
      }
    }

    const jflapXml = convertAutomatariumToJFLAP(jflapProject)
    const blob = new Blob([jflapXml], { type: 'application/xml' })

    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `${jflapProject.meta.name.replace(/[#%&{}\\<>*?/$!'":@+`|=]/g, '')}.jff`
    link.click()
    URL.revokeObjectURL(link.href)
  }

  const handleExportToPDA = () => {
    const currentGrammar: GrammarProjectGraph = {
      projectType: 'GRAMMAR',
      startSymbol,
      productions
    }

    const pdaGraph = convertToAutomata(currentGrammar, 'context-free')

    const pdaData = {
      ...pdaGraph,
      _id: crypto.randomUUID(),
      comments: [],
      simResult: [],
      tests: { single: '', batch: [''] },
      meta: {
        name: 'Converted Grammar',
        dateCreated: Date.now(),
        dateEdited: Date.now(),
        version: '1.0.0',
        automatariumVersion: '1.0.0'
      },
      config: {
        type: 'PDA',
        statePrefix: 'q',
        orOperator: '|',
        acceptanceCriteria: 'both',
        color: 'orange'
      }
    }

    const blob = new Blob([JSON.stringify(pdaData, null, 2)], {
      type: 'application/json'
    })

    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = 'converted_pda.json'
    link.click()
    URL.revokeObjectURL(link.href)
  }

  const handleShowDerivation = () => {
    const currentGrammar: GrammarProjectGraph = {
      projectType: 'GRAMMAR',
      startSymbol,
      productions
    }

    const paths = showMultipleDerivations(currentGrammar, startSymbol, input, 5)
    const acceptedPaths = paths.filter(path => path.accepted)

    setDerivationPaths(paths)

    if (acceptedPaths.length > 0) {
      setDerivationSteps(acceptedPaths[0].steps)
      setDerivationFailed(false)
      setDerivationFailureReason(null)
      setDerivationMessage(
        acceptedPaths.length > 1
          ? `✓ Successfully derived. Found ${acceptedPaths.length} accepted derivation paths.`
          : '✓ Successfully derived. Found 1 accepted derivation path.'
      )
      return
    }

    const failed = showFailedDerivation(currentGrammar, startSymbol, input)

    setDerivationSteps(failed.steps)
    setDerivationFailed(true)
    setDerivationFailureReason(failed.failureReason)
    setDerivationMessage(
      paths.length > 1
        ? `Found ${paths.length} possible derivation paths, but none accepted the string.`
        : 'Found 1 possible derivation path, but it did not accept the string.'
    )
  }

  const renderDerivedString = (step: DerivationStep) => {
    const changedEnd = step.replacementIndex + step.insertedLength
    const beforeChanged = step.to.slice(0, step.replacementIndex)
    const changed = step.to.slice(step.replacementIndex, changedEnd)
    const afterChanged = step.to.slice(changedEnd)

    return (
      <>
        {beforeChanged}
        <span style={{ color: '#86efac', fontWeight: 700 }}>
          {changed || 'ε'}
        </span>
        {afterChanged}
      </>
    )
  }

  useEvent('exportFSAJFLAP', () => handleExportFSAJFLAP(), [startSymbol, productions])

  return (
    <div className="grammar-editor-page h-full w-full flex bg-gray-800 text-gray-100">
      <div className="h-full w-full flex bg-gray-800 text-gray-100">
        <div className="w-14 bg-gray-900 border-r border-gray-700" />

        <div className="flex-1 pt-1 px-6 pb-6 grid grid-cols-2 gap-6">
          <div className="bg-gray-900 rounded-lg p-2 shadow">
            <h2 className="grammar-header">Grammar Editor</h2>

            <label className="font-semibold">Start Symbol</label>
            <input
              className="input-box"
              type="text"
              value={startSymbol}
              onChange={e => setStartSymbol(e.target.value)}
            />

            <h3 className="mt-4 mb-2 font-semibold">Productions</h3>

            <div className="space-y-2">
              {productions.map((p, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    className="input-box"
                    type="text"
                    value={p.left}
                    onChange={e => updateLeft(i, e.target.value)}
                    placeholder="LHS"
                  />
                  →
                  <input
                    className="input-box-right"
                    type="text"
                    value={editingRight[i] ?? formatRightValue(p.right)}
                    onChange={e => updateRight(i, e.target.value)}
                    onFocus={() => {
                      if (formatRightValue(p.right) === 'ε') {
                        setEditingRight({ ...editingRight, [i]: '' })
                      }
                    }}
                    onBlur={e => commitRight(i, e.target.value)}
                    placeholder="ε"
                  />
                  <button
                    className="text-red-400 hover:text-red-600"
                    onClick={() => deleteProduction(i)}
                  >
                    ✖
                  </button>
                </div>
              ))}
            </div>

            <button className="grammar-button" onClick={addProduction}>
              + Add Production
            </button>

            <button className="grammar-button" onClick={handleDetectType}>
              Detect Grammar Type
            </button>

            {grammarType && (
              <div className="grammar-type">
                Type: {grammarType}

                {(grammarType === 'regular (left-linear)' ||
                  grammarType === 'regular (right-linear)') ? (
                  <button className="convert-button" onClick={handleExportToFSA}>
                    Export as FSA
                  </button>
                ) : grammarType === 'context-free' ? (
                  <button className="convert-button" onClick={handleExportToPDA}>
                    Export as PDA
                  </button>
                ) : null}
              </div>
            )}
          </div>

          <div className="bg-gray-900 rounded-lg p-4 shadow">
            <h2 className="text-xl font-bold mb-4">Test String</h2>

            <div className="flex items-center">
              <input
                className="input-box"
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Enter string"
              />

              <button className="grammar-button" onClick={handleTest}>
                Test
              </button>
            </div>

            {result && (
              <div
                className={`mt-4 px-3 py-2 rounded font-semibold ${
                  result.includes('Accepted') ? 'bg-green-700' : 'bg-red-700'
                }`}
              >
                {result}
              </div>
            )}

            <div>
              <button
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded"
                onClick={handleShowDerivation}
              >
                Show Derivation
              </button>

              {(derivationSteps.length > 0 || derivationFailed || derivationMessage) && (
                <div className="mt-2 p-2 bg-gray-800 rounded text-sm">
                  <div>{startSymbol}</div>

                  {derivationSteps.map((step, i) => (
                    <div key={i}>
                      ⇒ {renderDerivedString(step)}
                      <span style={{ color: '#a3a3a3', marginLeft: '0.5rem' }}>
                        (used {step.ruleLeft} → {step.ruleRight || 'ε'})
                      </span>
                    </div>
                  ))}

                  {derivationFailed && (
                    <div style={{ color: '#fca5a5', fontWeight: 700, marginTop: '0.25rem' }}>
                      ✗ Failed here
                    </div>
                  )}

                  {derivationFailed && derivationFailureReason && (
                    <div style={{ marginTop: '0.25rem' }}>
                      Why not accepted: {derivationFailureReason}
                    </div>
                  )}

                  {derivationMessage && <div>{derivationMessage}</div>}
                </div>
              )}

              {derivationPaths.length > 1 && (
                <div className="mt-3 p-2 bg-gray-800 rounded text-sm">
                  <strong>Possible derivations: {derivationPaths.length}</strong>

                  {derivationPaths.map((path, pathIndex) => (
                    <div
                      key={pathIndex}
                      style={{
                        marginTop: '0.5rem',
                        padding: '0.5rem',
                        background: '#111827',
                        borderRadius: '0.375rem'
                      }}
                    >
                      <div style={{ fontWeight: 700 }}>
                        Derivation {pathIndex + 1}: {path.accepted ? 'Accepted' : 'Failed'}
                      </div>

                      <div>{startSymbol}</div>

                      {path.steps.map((step, stepIndex) => (
                        <div key={stepIndex}>
                          ⇒ {step.to}
                          <span style={{ color: '#a3a3a3', marginLeft: '0.5rem' }}>
                            (used {step.ruleLeft} → {step.ruleRight || 'ε'})
                          </span>
                        </div>
                      ))}

                      {!path.accepted && path.failureReason && (
                        <div style={{ color: '#fca5a5', marginTop: '0.25rem' }}>
                          ✗ {path.failureReason}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}