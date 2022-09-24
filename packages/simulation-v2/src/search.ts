import { Queue } from "./collection";
import { IProblem, GraphNode } from "./graph";

export const breadthFirstSearch = <T extends GraphNode>(
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

// TODO: Freeze, thaw, trace, and remove
// export class GraphStepper {
//     private m_frontier: Array<GraphNode>;
//     private m_initialNode: GraphNode;
//     private m_problem: FSAGraphProblem;

//     constructor(problem: FSAGraphProblem) {
//         this.m_frontier = new Array<GraphNode>();
//         this.m_problem = problem;
//         this.m_initialNode = new GraphNode(problem.getInitialState());
//         this.m_frontier.push(this.m_initialNode);
//     }

//     public forward() {
//         const frontierCopy = this.m_frontier.slice();
//         this.m_frontier = [];
//         while (frontierCopy.length > 0) {
//             const node = frontierCopy.shift()!;
//             for (const successor of this.m_problem.getSuccessors(node.state)) {
//                 const successorNode = new GraphNode(
//                     successor.state,
//                     successor.transition,
//                     node,
//                     successor.read,
//                 );
//                 this.m_frontier.push(successorNode);
//             }
//         }
//         return this.m_frontier;
//     }

//     public backward() {
//         if (
//             this.m_frontier.length === 1 &&
//             this.m_frontier[0].key() === this.m_initialNode.key()
//         ) {
//             // This is the root node!
//             return this.m_frontier;
//         }
//         const previousFrontier = new Array<GraphNode>();
//         this.m_frontier.forEach((node) => {
//             if (
//                 node.parent &&
//                 !this.checkForDuplicate(node.parent, previousFrontier)
//             ) {
//                 previousFrontier.push(node.parent);
//             }
//         });
//         this.m_frontier = previousFrontier;
//         return this.m_frontier;
//     }

//     private checkForDuplicate(node: GraphNode, frontier: Array<GraphNode>) {
//         return frontier.some((n) => n.key() === node.key());
//     }

//     public reset() {
//         this.m_frontier = new Array<GraphNode>();
//         this.m_frontier.push(this.m_initialNode);
//         return this.m_frontier;
//     }
// }
