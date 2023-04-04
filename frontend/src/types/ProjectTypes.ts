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

// May be different types for each automata
export interface AutomataTransition {
    from: number,
    id: number,
    read: string,
    to: number,
    direction?: TMDirection,
    write?: string,
    push?: string,
    pop?: string,
}

export interface Project {
    comments: ProjectComment[],
    config: ProjectConfig,
    initialState: number | null,
    meta: ProjectMetaData,
    projectType: string,
    // Not sure about type of array
    simResult: string[],
    states: AutomataState[],
    tests: AutomataTests,
    transitions: AutomataTransition[],
    _id: string
}
