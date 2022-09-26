// import { FSAGraphNode, FSAGraphProblem } from "./FSASearch";
// import { IGraphNode, IProblem } from "./interfaces/graph";

// export interface IGraphStep<T extends IGraphNode> {
//     node: T;
//     successors: T[];
//     reached: Map<string, T>;
// }

// export abstract class GraphStep<T extends IGraphNode> {
//     protected frontier: T[];
//     protected initial: T;
//     protected problem: IProblem<T>;

//     constructor(problem: IProblem<T>) {
//         this.problem = problem;
//         this.initial = problem.getInitialState();
//         this.frontier = [this.initial];
//     }

//     public abstract forward(): T[];
//     public abstract backward(): T[];
//     public abstract reset(): T[];
// }

// // TODO: Freeze, thaw, trace, and remove
// export class FSAStepper extends GraphStep<FSAGraphNode> {
//     constructor(problem: FSAGraphProblem) {
//         super(problem);
//     }

//     public forward() {
//         const frontierCopy = this.frontier.slice();
//         this.frontier = [];
//         while (frontierCopy.length > 0) {
//             const node = frontierCopy.shift()!;
//             for (const successor of this.problem.getSuccessors(node.state)) {
//                 const successorNode = new GraphNode(
//                     successor.state,
//                     successor.transition,
//                     node,
//                     successor.read,
//                 );
//                 this.frontier.push(successorNode);
//             }
//         }
//         return this.frontier;
//     }

//     public backward() {
//         if (
//             this.frontier.length === 1 &&
//             this.frontier[0].key() === this.initial.key()
//         ) {
//             // This is the root node!
//             return this.frontier;
//         }
//         const previousFrontier = new Array<GraphNode>();
//         this.frontier.forEach((node) => {
//             if (
//                 node.parent &&
//                 !this.checkForDuplicate(node.parent, previousFrontier)
//             ) {
//                 previousFrontier.push(node.parent);
//             }
//         });
//         this.frontier = previousFrontier;
//         return this.frontier;
//     }

//     private checkForDuplicate(node: GraphNode, frontier: Array<GraphNode>) {
//         return frontier.some((n) => n.key() === node.key());
//     }

//     public reset() {
//         this.frontier = new Array<GraphNode>();
//         this.frontier.push(this.initial);
//         return this.frontier;
//     }
// }