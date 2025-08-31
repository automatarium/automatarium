import React, { useState } from 'react'
import { GrammarProjectGraph } from '../../types/ProjectTypes'
import { testString } from '../../util/grammar'

type Props = {
  project: GrammarProjectGraph
}

export default function GrammarEditor({ project }: Props) {
  const [input, setInput] = useState("")
  const [result, setResult] = useState<string | null>(null)

  const handleTest = () => {
    const ok = testString(project, input)
    setResult(ok ? "✅ Accepted" : "❌ Rejected")
  }

  return (
    <div className="p-4">
      <h2 className="text-xl mb-2">Grammar Editor</h2>

      <div>
        <p><strong>Start Symbol:</strong> {project.startSymbol}</p>
        <ul>
          {project.productions.map((p, i) => (
            <li key={i}>{p.left} → {p.right.join(" | ")}</li>
          ))}
        </ul>
      </div>

      <div className="mt-4">
        <input
          className="border p-1"
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Enter string to test"
        />
        <button className="ml-2 px-3 py-1 border rounded" onClick={handleTest}>
          Test
        </button>
      </div>

      {result && <div className="mt-2">{result}</div>}
    </div>
  )
}
