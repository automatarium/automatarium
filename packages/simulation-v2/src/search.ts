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
                successor.read,
            );

            if (!reached.has(successorNode.key())) {
                frontier.add(successorNode);
                reached.set(successorNode.key(), successorNode);
            }
        }
    }
    return node;
};

export class StepwiseBFS {
    private m_frontier: Queue<GraphNode>;
    private m_node: GraphNode;
    private m_problem: FSAGraphProblem;

    constructor(problem: FSAGraphProblem) {
        this.m_frontier = new Queue<GraphNode>();
        this.m_problem = problem;
        this.m_node = new GraphNode(problem.getInitialState());
        this.m_frontier.add(this.m_node);
    }

    public forward() {
        const frontierCopy = structuredClone(this.m_frontier);
        this.m_frontier.clear();
        while (!frontierCopy.isEmpty()) {
            this.m_node = this.m_frontier.remove()!;
            for (const successor of this.m_problem.getSuccessors(
                this.m_node.state,
            )) {
                const successorNode = new GraphNode(
                    successor.state,
                    successor.transition,
                    this.m_node,
                    successor.read,
                );
                this.m_frontier.add(successorNode);
            }
        }
        return this.m_frontier;
    }

    public backward() {}
}
