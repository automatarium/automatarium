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