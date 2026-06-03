import { useState } from 'react'
import { GrammarProjectGraph, Project } from '../../types/ProjectTypes'
import {
  testString,
  showFailedDerivation,
  showMultipleDerivations,
  detectType,
  convertToAutomata
} from '../../util/grammar'
import type { DerivationStep, DerivationPathResult } from '../../util/grammar'
import { useEvent } from '/src/hooks'
import { convertAutomatariumToJFLAP } from '@automatarium/jflap-translator'
import { showWarning } from '/src/components/Warning/Warning'
import useProjectStore from '/src/stores/useProjectStore'

export default function GrammarEditor() {
  const { startSymbol, productions, setStartSymbol, setProductions } = useProjectStore(
    state => {
      const { project } = state
      if (project.projectType !== 'GRAMMAR') {
        return {
          startSymbol: '',
          productions: [],
          setStartSymbol: state.setStartSymbol,
          setProductions: state.setProductions
        }
      }
      return {
        startSymbol: project.startSymbol,
        productions: project.productions,
        setStartSymbol: state.setStartSymbol,
        setProductions: state.setProductions
      }
    }
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
        <span className="grammar-derivation-highlight">{changed || 'ε'}</span>
        {afterChanged}
      </>
    )
  }

  const renderDerivationSteps = (steps: DerivationStep[]) => (
    <>
      <div className="grammar-derivation-step">{startSymbol || '—'}</div>
      {steps.map((step, i) => (
        <div key={i} className="grammar-derivation-step">
          ⇒ {renderDerivedString(step)}
          <span className="grammar-rule-used">
            (used {step.ruleLeft} → {step.ruleRight || 'ε'})
          </span>
        </div>
      ))}
    </>
  )

  const showMultiPathPanel = derivationPaths.length > 1
  const showSingleDerivationPanel =
    !showMultiPathPanel &&
    (derivationSteps.length > 0 || derivationFailed || derivationMessage)

  const isAccepted = result?.includes('Accepted')

  useEvent('exportFSAJFLAP', () => handleExportFSAJFLAP(), [startSymbol, productions])

  return (
    <div className="grammar-editor-page h-full w-full text-gray-100">
      <div className="grammar-editor-layout">
        <section className="grammar-panel">
          <h2 className="grammar-header">Grammar</h2>

          <label className="grammar-section-label" htmlFor="grammar-start-symbol">
            Start symbol
          </label>
          <input
            id="grammar-start-symbol"
            className="input-box grammar-start-input"
            type="text"
            value={startSymbol}
            onChange={e => setStartSymbol(e.target.value)}
            maxLength={4}
          />

          <h3 className="grammar-section-label grammar-section-label--spaced">
            Productions
          </h3>

          <div className="grammar-productions-list">
            {productions.map((p, i) => (
              <div key={i} className="grammar-production-row">
                <input
                  className="input-box"
                  type="text"
                  value={p.left}
                  onChange={e => updateLeft(i, e.target.value)}
                  placeholder="S"
                  aria-label={`Production ${i + 1} left`}
                />
                <span className="grammar-production-arrow" aria-hidden>
                  →
                </span>
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
                  placeholder="ε or aB | c"
                  aria-label={`Production ${i + 1} right`}
                />
                <button
                  type="button"
                  className="grammar-production-delete"
                  onClick={() => deleteProduction(i)}
                  aria-label={`Delete production ${i + 1}`}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <div className="grammar-actions">
            <button type="button" className="grammar-button" onClick={addProduction}>
              + Add production
            </button>
            <button type="button" className="grammar-button" onClick={handleDetectType}>
              Detect type
            </button>
          </div>

          {grammarType && (
            <div className="grammar-type">
              <span className="grammar-type-badge">{grammarType}</span>
              {(grammarType === 'regular (left-linear)' ||
                grammarType === 'regular (right-linear)') ? (
                <button type="button" className="convert-button" onClick={handleExportToFSA}>
                  Export as FSA
                </button>
              ) : grammarType === 'context-free' ? (
                <button type="button" className="convert-button" onClick={handleExportToPDA}>
                  Export as PDA
                </button>
              ) : null}
            </div>
          )}
        </section>

        <section className="grammar-panel">
          <h2 className="grammar-panel-title">Test &amp; derivation</h2>

          <label className="grammar-section-label" htmlFor="grammar-test-input">
            Test string
          </label>
          <div className="grammar-test-row">
            <input
              id="grammar-test-input"
              className="input-box"
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="e.g. aabc"
              onKeyDown={e => {
                if (e.key === 'Enter') handleTest()
              }}
            />
            <button type="button" className="grammar-button" onClick={handleTest}>
              Test
            </button>
          </div>

          {result && (
            <div
              className={`grammar-status ${
                isAccepted ? 'grammar-status--accepted' : 'grammar-status--rejected'
              }`}
              role="status"
            >
              {isAccepted ? '✓ Accepted' : '✗ Rejected'}
            </div>
          )}

          <button
            type="button"
            className="grammar-button-primary"
            onClick={handleShowDerivation}
            disabled={!input.trim() && !startSymbol}
          >
            Show derivation
          </button>

          {showSingleDerivationPanel && (
            <div className="grammar-derivation-block">
              {renderDerivationSteps(derivationSteps)}

              {derivationFailed && (
                <div className="grammar-derivation-failed">✗ Failed here</div>
              )}

              {derivationFailed && derivationFailureReason && (
                <div className="grammar-derivation-reason">
                  <strong>Why not accepted:</strong> {derivationFailureReason}
                </div>
              )}

              {derivationMessage && (
                <div
                  className={`grammar-derivation-message ${
                    !derivationFailed ? 'grammar-derivation-message--success' : ''
                  }`}
                >
                  {derivationMessage}
                </div>
              )}
            </div>
          )}

          {showMultiPathPanel && (
            <>
              {derivationMessage && (
                <div
                  className={`grammar-derivation-message ${
                    !derivationFailed ? 'grammar-derivation-message--success' : ''
                  }`}
                  style={{ marginTop: '1rem' }}
                >
                  {derivationMessage}
                </div>
              )}

              <div className="grammar-paths-header">
                {derivationPaths.length} derivation paths
              </div>

              {derivationPaths.map((path, pathIndex) => (
                <div
                  key={pathIndex}
                  className={`grammar-path-card ${
                    path.accepted
                      ? 'grammar-path-card--accepted'
                      : 'grammar-path-card--failed'
                  }`}
                >
                  <div className="grammar-path-card-title">
                    <span>Path {pathIndex + 1}</span>
                    <span
                      className={`grammar-path-badge ${
                        path.accepted
                          ? 'grammar-path-badge--accepted'
                          : 'grammar-path-badge--failed'
                      }`}
                    >
                      {path.accepted ? 'Accepted' : 'Failed'}
                    </span>
                  </div>

                  <div className="grammar-derivation-block" style={{ marginTop: 0, maxHeight: 220 }}>
                    {renderDerivationSteps(path.steps)}
                  </div>

                  {!path.accepted && path.failureReason && (
                    <div className="grammar-derivation-reason" style={{ marginTop: '0.5rem' }}>
                      {path.failureReason}
                    </div>
                  )}
                </div>
              ))}
            </>
          )}
        </section>
      </div>
    </div>
  )
}