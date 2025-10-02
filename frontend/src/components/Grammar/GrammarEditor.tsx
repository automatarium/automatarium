import React, { useState } from 'react'
import { GrammarProjectGraph } from '../../types/ProjectTypes'
import { testString, detectType } from '../../util/grammar'


type Props = {
  project: GrammarProjectGraph
}

export default function GrammarEditor({ project }: Props) {
  // local state for grammar
  const [startSymbol, setStartSymbol] = useState(project.startSymbol || "")
  const [productions, setProductions] = useState(project.productions || [])
  const [input, setInput] = useState("")
  const [result, setResult] = useState<string | null>(null)
  const [grammarType, setGrammarType] = useState<string | null>(null)


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

  const handleDetectType = () => {
    const currentGrammar: GrammarProjectGraph = {
      projectType: 'GRAMMAR',
      startSymbol,
      productions
    }
    setGrammarType(detectType(currentGrammar))
  }

  return (
    <div className="h-full w-full flex bg-gray-800 text-gray-100">
      {/* Left Toolbar (reuse existing) */}
      <div className="w-14 bg-gray-900 border-r border-gray-700">
        {/* toolbar buttons can go here */}
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 grid grid-cols-2 gap-6">
        
        {/* Grammar Rules Panel */}
        <div className="bg-gray-900 rounded-lg p-4 shadow">
          <h2 className="text-xl font-bold mb-4">Grammar</h2>
          
          <label className="block font-semibold mb-2">Start Symbol</label>
          <input
            className="border border-gray-700 rounded px-2 py-1 bg-gray-800 w-32"
            type="text"
            value={startSymbol}
            onChange={e => setStartSymbol(e.target.value)}
          />

          <h3 className="mt-4 mb-2 font-semibold">Productions</h3>
          <div className="space-y-2">
            {productions.map((p, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  className="border border-gray-700 rounded px-2 py-1 w-16 bg-gray-800"
                  type="text"
                  value={p.left}
                  onChange={e => updateLeft(i, e.target.value)}
                  placeholder="LHS"
                />
                →
                <input
                  className="border border-gray-700 rounded px-2 py-1 flex-1 bg-gray-800"
                  type="text"
                  value={p.right.join(" | ")}
                  onChange={e => updateRight(i, e.target.value)}
                  placeholder="rhs1 | rhs2"
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
          
          <button
            className="mt-3 px-3 py-1 bg-green-600 hover:bg-green-500 rounded text-white"
            onClick={addProduction}
          >
            + Add Production
          </button>
          <button
              className="mt-3 ml-2 px-3 py-1 bg-purple-600 hover:bg-purple-500 rounded text-white"
              onClick={handleDetectType}
            >
              Detect Grammar Type
            </button>
                      
            {grammarType && (
              <div className="mt-3 px-3 py-2 rounded bg-gray-700 font-semibold">
                Type: {grammarType}
              </div>
            )}

        </div>

        {/* String Tester Panel */}
        <div className="bg-gray-900 rounded-lg p-4 shadow">
          <h2 className="text-xl font-bold mb-4">Test String</h2>
          <div className="flex items-center">
            <input
              className="border border-gray-700 rounded px-2 py-1 flex-1 bg-gray-800"
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Enter string"
            />
            <button
              className="ml-2 px-3 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white"
              onClick={handleTest}
            >
              Test
            </button>
          </div>
          {result && (
            <div
              className={`mt-4 px-3 py-2 rounded font-semibold ${
                result.includes("Accepted") ? "bg-green-700" : "bg-red-700"
              }`}
            >
              {result}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
