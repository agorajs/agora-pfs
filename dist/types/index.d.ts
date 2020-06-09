/**
 * Implementation of the Push Force Scan (PFS) algorithm
 *
 * Kazuo Misue, Peter Eades, Wei Lai, Kozo Sugiyama,
 * Layout Adjustment and the Mental Map,
 * Journal of Visual Languages & Computing,
 * Volume 6, Issue 2,
 * 1995,
 * Pages 183-210,
 * ISSN 1045-926X,
 * https://doi.org/10.1006/jvlc.1995.1010.
 * (http://www.sciencedirect.com/science/article/pii/S1045926X85710105)
 */
import type { Algorithm } from 'agora-graph';
/**
 * Executes the Push Force Scan (PFS) algorithm for this graph
 *
 * @param {Graph} graph the graph to update
 * @param {object} [options] options to pass to the algorith
 * @param {number} options.padding padding to add between nodes
 *
 * @returns {Result} the updated graph
 */
export declare const pfs: import("agora-graph").Function<{
    padding: number;
}>;
export declare const PFSAlgorithm: Algorithm<{
    padding: number;
}>;
export default PFSAlgorithm;
//# sourceMappingURL=index.d.ts.map