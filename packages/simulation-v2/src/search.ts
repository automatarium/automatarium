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

// TODO: Freeze, thaw, trace, and remove
export class GraphStepper {
    private m_frontier: Array<GraphNode>;
    private m_initialNode: GraphNode;
    private m_problem: FSAGraphProblem;

    constructor(problem: FSAGraphProblem) {
        this.m_frontier = new Array<GraphNode>();
        this.m_problem = problem;
        this.m_initialNode = new GraphNode(problem.getInitialState());
        this.m_frontier.push(this.m_initialNode);
    }

    public forward() {
        const frontierCopy = structuredClone(this.m_frontier);
        this.m_frontier = [];
        while (frontierCopy.length > 0) {
            const node = this.m_frontier.shift()!;
            for (const successor of this.m_problem.getSuccessors(node.state)) {
                const successorNode = new GraphNode(
                    successor.state,
                    successor.transition,
                    node,
                    successor.read,
                );
                this.m_frontier.push(successorNode);
            }
        }
        return this.m_frontier;
    }

    public backward() {
        const previousFrontier = new Array<GraphNode>();
        this.m_frontier.forEach((node) => {
            if (node.parent && !this.checkForDuplicate(node.parent)) {
                previousFrontier.push(node.parent);
            }
        });
        this.m_frontier = previousFrontier;
        return this.m_frontier;
    }

    private checkForDuplicate(node: GraphNode) {
        return this.m_frontier.some((n) => n.key() === node.key());
    }

    public reset() {
        this.m_frontier = new Array<GraphNode>();
        this.m_frontier.push(this.m_initialNode);
        return this.m_frontier;
    }
}
