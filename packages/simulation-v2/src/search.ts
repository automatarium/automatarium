import { Queue } from "./collection";
import { GraphProblem, GraphNode, State } from "./graph";

export const breadthFirstSearch = (problem: GraphProblem) => {
    const frontier = new Queue<GraphNode>();
    const reached: Map<number, GraphNode> = new Map();

    const firstNode: GraphNode = {
        state: problem.getInitialState(),
        transition: null,
        parent: null,
        depth: 0,
    }

    frontier.add(firstNode);
    reached.set(firstNode.state.id, firstNode);

    while (!frontier.isEmpty()) {
        const currentNode = frontier.remove();
        if (!currentNode) {
            return new Error("Frontier is empty");
        }
        if (problem.isFinalState(currentNode.state)) {
            return currentNode;
        }
        for (const successor of problem.getSuccessors(currentNode.state)) {
            const successorNode: GraphNode = {
                state: successor.state,
                transition: successor.transition,
                parent: currentNode,
                depth: currentNode.depth + 1,
            }

            if (!reached.has(successorNode.state.id)) {
                frontier.add(successorNode);
                reached.set(successorNode.state.id, successorNode);
            }
        }
    }
    return null;
}
