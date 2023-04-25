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
export interface BaseAutomataTransition {
    from: number,
    id: number,
    read: string
    to: number,

}

/**
 * Alias to make FSA seem like the rest
 */
export type FSAAutomataTransition = BaseAutomataTransition

/**
 * Transition used by PDA projects
 */
export interface PDAAutomataTransition extends BaseAutomataTransition{
    push: string
    pop: string
}

/**
 * Transition used by TM projects
 */
export interface TMAutomataTransition extends BaseAutomataTransition {
    write: string
    direction: TMDirection
}

export type AutomataTransition = BaseAutomataTransition | PDAAutomataTransition | TMAutomataTransition

/**
 * What the graph used by the frontend looks like.
 * This is the base type, with variants for the other project types defined later
 */
type BaseProjectGraph<PT extends ProjectType, T extends BaseAutomataTransition> = {
    projectType: PT
    states: AutomataState[]
    transitions: T[]
    initialState: number | null
}

/**
 * Graph for FSA project. There isn't any different in types but this is just for completion’s sake
 */
export type FSAProjectGraph = BaseProjectGraph<'FSA', FSAAutomataTransition>

/**
 * Graph for PDA project. The transitions need push/pop properties
 */
export type PDAProjectGraph = BaseProjectGraph<'PDA', PDAAutomataTransition>

/**
 * Graph for TM project. The transitions need read/write properties
 */
export type TMProjectGraph = BaseProjectGraph<'TM', TMAutomataTransition>

/**
 * All the different types a project can be.
 * This allows for the transitions types to be different
 */
export type ProjectGraph = FSAProjectGraph | PDAProjectGraph | TMProjectGraph

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
    transitions: BaseAutomataTransition[],
    comments: ProjectComment[],
    projectSource: string,
    projectType: ProjectType,
    initialStateId: number | null
}

/**
 * Small helper function to change the value of a type at block level.
 * Use this with care since it does override the type system.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-function
export function assertType<T> (value: unknown): asserts value is T {

}
