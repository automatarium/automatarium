import { Queue } from "./collection";
import { State, Transition } from "./graph";
import { Graph, Node } from "./interfaces/graph";

export const breadthFirstSearch = <S extends State, T extends Transition, N extends Node<S>>(
    graph: Graph<S, T, N>,
) => {
    const frontier = new Queue<N>();
    const reached: Map<string, N> = new Map();

    let node = graph.initial;

    frontier.add(node);
    reached.set(node.key(), node);

    while (!frontier.isEmpty()) {
        // Bang is necessary because TS doesn't understand that the frontier is not empty here
        node = frontier.remove()!;
        if (graph.isFinalState(node)) {
            return node;
        }
        for (const successor of graph.getSuccessors(node)) {
            if (!reached.has(successor.key())) {
                frontier.add(successor);
                reached.set(successor.key(), successor);
            }
        }
    }
    return node;
};
