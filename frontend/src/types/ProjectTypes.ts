/**
 * Possible types of a project
 * - FSA: Finite state automata
 * - PDA: Push down automata
 * - TM: Turing machine
 */
export type ProjectType = 'FSA' | 'PDA' | 'TM'

export interface ProjectConfig {
    acceptanceCriteria: string,
    // Could be made into enum
    color: string,
    statePrefix: string,
    type: ProjectType
}

export interface ProjectMetaData {
    automatariumVersion: string,
    dateCreated: number,
    dateEdited: number,
    name: string,
    version: string
}

export interface ProjectComment {
    x: number,
    y: number,
    text: string,
    id?: number
}

export interface AutomataState {
    isFinal: boolean,
    x: number,
    y: number,
    id: number,
    name?: string,
    label?: string
}

export interface AutomataTests {
    batch: string[],
    single: string
}

/**
 * Possible directions that a TM transitions can move
 * - Left
 * - Right
 * - Stay
 */
export type TMDirection = 'L' | 'R' | 'S'

/**
 * Basic transition type shared across every transition
 */
export interface AutomataTransition {
    from: number,
    id: number,
    read: string | string[], // Expanded FSA has multiple read symbols. The access is still the same so shouldn't be a problem
    to: number,

}

/**
 * Transition used by PDA projects
 */
export interface PDAAutomataTransition extends AutomataTransition{
    push: string
    pop: string
}

/**
 * Transition used by TM projects
 */
export interface TMAutomataTransition extends AutomataTransition {
    write: string
}

/**
 * What the graph used by the frontend looks like.
 * This is the base type, with variants for the other project types defined later
 */
type BaseProjectGraph = {
    projectType: ProjectType
    states: AutomataState[]
    transitions: AutomataTransition[]
    initialState: number | null
}

/**
 * Graph for FSA project. There isn't any different in types but this is just for completion’s sake
 */
type FSAProjectGraph = BaseProjectGraph & {
    projectType: 'FSA'
}

/**
 * Graph for PDA project. The transitions need push/pop properties
 */
type PDAProjectGraph = BaseProjectGraph & {
    projectType: 'PDA'
    transitions: PDAAutomataTransition
}

/**
 * Graph for TM project. The transitions need read/write properties
 */
type TMProjectGraph = BaseProjectGraph & {
    projectType: 'TM'
    transitions: TMAutomataTransition
}

/**
 * All the different types a project can be.
 * This allows for the transitions types to be different
 */
type ProjectGraph = FSAProjectGraph | PDAProjectGraph | TMProjectGraph

/**
 * What a project for the frontend looks like.
 * This contains everything that is needed to display a graph
 */
export type Project = ProjectGraph & {
    comments: ProjectComment[],
    config: ProjectConfig,
    meta: ProjectMetaData,
    projectType: string,
    simResult: string[],
    tests: AutomataTests,
}

// This is for copy/paste function which isn't TS converted yet
// Leaving it here so its ready for when its converted, so as not to clutter useActions
export type CopyData = {
    states: AutomataState[],
    transitions: AutomataTransition[],
    comments: ProjectComment[],
    projectSource: string,
    projectType: ProjectType,
    initialStateId: number | null
}
