import { Queue } from "./collection";
import { IGraphNode, IProblem } from "./interfaces/graph";

export const breadthFirstSearch = <T extends IGraphNode>(
    problem: IProblem<T>,
) => {
    const frontier = new Queue<T>();
    const reached: Map<string, T> = new Map();

    let node = problem.getInitialState();

    if (!node) {
        return node;
    }

    frontier.add(node);
    reached.set(node.key(), node);

    while (!frontier.isEmpty()) {
        // Bang is necessary because TS doesn't understand that the frontier is not empty here
        node = frontier.remove()!;
        if (problem.isFinalState(node)) {
            return node;
        }
        for (const successor of problem.getSuccessors(node)) {
            if (!reached.has(successor.key())) {
                frontier.add(successor);
                reached.set(successor.key(), successor);
            }
        }
    }
    return node;
};
