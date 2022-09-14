import { Queue } from "./collection";
import { FSAGraphProblem, GraphNode } from "./graph";

export const breadthFirstSearch = (problem: FSAGraphProblem) => {
    const frontier = new Queue<GraphNode>();
    const reached: Map<string, GraphNode> = new Map();

    let node = new GraphNode(problem.getInitialState());

    frontier.add(node);
    reached.set(node.key(), node);

    while (!frontier.isEmpty()) {
        // Bang is necessary because TS doesn't understand that the frontier is not empty here
        node = frontier.remove()!;
        if (problem.isFinalState(node.state)) {
            return node;
        }
        for (const successor of problem.getSuccessors(node.state)) {
            const successorNode = new GraphNode(
                successor.state,
                successor.transition,
                node,
            );

            if (!reached.has(successorNode.key())) {
                frontier.add(successorNode);
                reached.set(successorNode.key(), successorNode);
            }
        }
    }
    return node;
};
