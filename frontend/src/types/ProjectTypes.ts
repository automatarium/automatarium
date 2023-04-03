export interface ProjectConfig {
    acceptanceCriteria: string,
    // Could be made into enum
    color: string,
    statePrefix: string,
    // Make enum later
    type: string
}

export interface ProjectMetaData {
    automatariumVersion: string,
    dateCreated: number,
    dateEdited: number,
    name: string,
    version: string
}

// Add this in later, breaks too many things rn
// export enum ProjectType {
//     FSA = 'FSA',
//     PDA = 'PDA',
//     TM = 'TM'
// }

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

// May be different types for each automata
export interface AutomataTransition {
    // Not sure about types of direction, need to see possible vals could be enum
    from: number,
    id: number,
    read: string,
    to: number,
    direction?: string,
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
