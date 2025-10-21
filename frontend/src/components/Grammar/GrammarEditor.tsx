import React, { useState, useEffect } from 'react'
import { GrammarProjectGraph } from '../../types/ProjectTypes'
import { testString, detectType, convertToAutomata } from '../../util/grammar'
import { useNavigate } from 'react-router-dom'


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
  const [fsaRedirect, setFsaRedirect] = useState(false)
  const navigate = useNavigate()


  // TODO: Remove this when grammar menu is implemented
  useEffect(() => {
    // Hide File, Edit, View, Tools, Help buttons
    const menuButtons = document.querySelectorAll('.go4171875633 button');
    menuButtons.forEach((button) => {
      (button as HTMLElement).style.display = 'none';
    });

    return () => {
      // Restore when leaving page
      const menuButtons = document.querySelectorAll('.go4171875633 button');
      menuButtons.forEach((button) => {
        (button as HTMLElement).style.display = '';
      });
    };
  }, []);

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
      tests: { single: "", batch: [""] },
      meta: {
        name: "Converted Grammar",
        dateCreated: Date.now(),
        dateEdited: Date.now(),
        version: "1.0.0",
        automatariumVersion: "1.0.0"
      },
      config: {
        type: "FSA",
        statePrefix: "q",
        orOperator: "|",
        acceptanceCriteria: "both",
        color: "orange"
      }
    }

    
    const blob = new Blob([JSON.stringify(fsaData, null, 2)], {
      type: "application/json"
    })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = "converted_fsa.json"
    link.click()
    URL.revokeObjectURL(link.href)
  }

  return (
    <div className="grammar-editor-page h-full w-full flex bg-gray-800 text-gray-100">
      <div className="h-full w-full flex bg-gray-800 text-gray-100">
        {/* Left Toolbar (reuse existing) */}
        <div className="w-14 bg-gray-900 border-r border-gray-700">
          {/* toolbar buttons can go here */}
        </div>

        {/* Main Content */}
        <div className="flex-1 pt-1 px-6 pb-6 grid grid-cols-2 gap-6">
          
          {/* Grammar Rules Panel */}
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

            <button className="grammar-button" onClick={addProduction}>
              + Add Production
            </button>
            <button className="grammar-button" onClick={handleDetectType}>
              Detect Grammar Type
            </button>

            {grammarType && (
              <div className="grammar-type">
                Type: {grammarType}
                {(grammarType === "regular (left-linear)" || grammarType === "regular (right-linear)") && (
                  <button className="convert-button" onClick={handleExportToFSA}>
                    Export as FSA
                  </button>
                )}
              </div>
            )}
          </div>

          {/* String Tester Panel */}
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
                  result.includes("Accepted") ? "bg-green-700" : "bg-red-700"
                }`}
              >
                {result}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}