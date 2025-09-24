import React, { useState } from 'react'
import { GrammarProjectGraph } from '../../types/ProjectTypes'
import { testString } from '../../util/grammar'

type Props = {
  project: GrammarProjectGraph
}

export default function GrammarEditor({ project }: Props) {
  // local state for grammar
  const [startSymbol, setStartSymbol] = useState(project.startSymbol || "")
  const [productions, setProductions] = useState(project.productions || [])
  const [input, setInput] = useState("")
  const [result, setResult] = useState<string | null>(null)

  // add a new production rule
  const addProduction = () => {
    setProductions([...productions, { left: "", right: [""] }])
  }

  // update LHS of a production
  const updateLeft = (index: number, value: string) => {
    const updated = [...productions]
    updated[index].left = value
    setProductions(updated)
  }

  // update RHS (pipe-separated, e.g. "aB | b")
  const updateRight = (index: number, value: string) => {
    const updated = [...productions]
    updated[index].right = value.split("|").map(s => s.trim())
    setProductions(updated)
  }

  // delete a production
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
    setResult(ok ? "✅ Accepted" : "❌ Rejected")
  }

  return (
    <div className="p-4">
      <h2 className="text-xl mb-2">Grammar Editor</h2>

      {/* Grammar input panel */}
      <div className="mb-4">
        <label className="block font-semibold">Start Symbol:</label>
        <input
          className="border p-1 w-32"
          type="text"
          value={startSymbol}
          onChange={e => setStartSymbol(e.target.value)}
        />

        <h3 className="mt-2 font-semibold">Productions:</h3>
        {productions.map((p, i) => (
          <div key={i} className="flex items-center gap-2 mb-1">
            <input
              className="border p-1 w-16"
              type="text"
              value={p.left}
              onChange={e => updateLeft(i, e.target.value)}
              placeholder="LHS"
            />
            →
            <input
              className="border p-1 flex-1"
              type="text"
              value={p.right.join(" | ")}
              onChange={e => updateRight(i, e.target.value)}
              placeholder="rhs1 | rhs2 | ..."
            />
            <button
              className="text-red-500 ml-2"
              onClick={() => deleteProduction(i)}
            >
              ✖
            </button>
          </div>
        ))}
        <button
          className="mt-2 px-3 py-1 border rounded"
          onClick={addProduction}
        >
          + Add Production
        </button>
      </div>

      {/* String tester */}
      <div className="mt-4">
        <input
          className="border p-1"
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Enter string to test"
        />
        <button
          className="ml-2 px-3 py-1 border rounded"
          onClick={handleTest}
        >
          Test
        </button>
      </div>

      {result && <div className="mt-2">{result}</div>}
    </div>
  )
}
