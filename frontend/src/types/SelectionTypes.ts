import { AutomataState, AutomataTransition, ProjectComment } from 'src/types/ProjectTypes'

export type CopyData = {
    states: AutomataState[],
    transitions: AutomataTransition[],
    comments: ProjectComment[],
    projectSource: string,
    initialStateId: number | null
}
