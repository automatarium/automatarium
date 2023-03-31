export interface ProjectConfig {
    acceptanceCriteria: string,
    // Could be made into enum
    color: string,
    statePrefix: string,
    type: ProjectType
}

export interface ProjectMetaData {
    automatariumVersion: string,
    dateCreated: Date,
    dateEdited: Date,
    name: string,
    version: string
}

export enum ProjectType {
    FSA = 1,
    PDA,
    TM
}

export interface AutomataState {
    isFinal: boolean,
    x: number,
    y: number,
    id: number
}

export interface AutomataTest {
    // Not sure about type of array
    batch: string[],
    // Not sure about type here
    single: string
}

// May be different types for each automata
interface AutomataTransition {
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
    // Not sure about type of array
    comments: string[],
    config: ProjectConfig,
    initialState: number | null,
    meta: ProjectMetaData,
    projectType: ProjectType,
    // Not sure about type of array
    simResult: string[],
    states: AutomataState[],
    tests: AutomataTest,
    transitions: AutomataTransition[],
    _id: string
}