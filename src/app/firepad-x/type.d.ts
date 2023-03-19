
declare module 'monaco-editor/esm/vs/editor/common/core/range' {
export class Position {
    /**
     * line number (starts at 1)
     */
    readonly lineNumber: number;
    /**
     * column (the first character in a line is between column 1 and column 2)
     */
    readonly column: number;
    constructor(lineNumber: number, column: number);
    /**
     * Create a new position from this position.
     *
     * @param newLineNumber new line number
     * @param newColumn new column
     */
    with(newLineNumber?: number, newColumn?: number): Position;
    /**
     * Derive a new position from this position.
     *
     * @param deltaLineNumber line number delta
     * @param deltaColumn column delta
     */
    delta(deltaLineNumber?: number, deltaColumn?: number): Position;
    /**
     * Test if this position equals other position
     */
    equals(other: IPosition): boolean;
    /**
     * Test if position `a` equals position `b`
     */
    static equals(a: IPosition | null, b: IPosition | null): boolean;
    /**
     * Test if this position is before other position.
     * If the two positions are equal, the result will be false.
     */
    isBefore(other: IPosition): boolean;
    /**
     * Test if position `a` is before position `b`.
     * If the two positions are equal, the result will be false.
     */
    static isBefore(a: IPosition, b: IPosition): boolean;
    /**
     * Test if this position is before other position.
     * If the two positions are equal, the result will be true.
     */
    isBeforeOrEqual(other: IPosition): boolean;
    /**
     * Test if position `a` is before position `b`.
     * If the two positions are equal, the result will be true.
     */
    static isBeforeOrEqual(a: IPosition, b: IPosition): boolean;
    /**
     * A function that compares positions, useful for sorting
     */
    static compare(a: IPosition, b: IPosition): number;
    /**
     * Clone this position.
     */
    clone(): Position;
    /**
     * Convert to a human-readable representation.
     */
    toString(): string;
    /**
     * Create a `Position` from an `IPosition`.
     */
    static lift(pos: IPosition): Position;
    /**
     * Test if `obj` is an `IPosition`.
     */
    static isIPosition(obj: any): obj is IPosition;
}

    /**
     * A position in the editor. This interface is suitable for serialization.
     */
    export interface IPosition {
        /**
         * line number (starts at 1)
         */
        readonly lineNumber: number;
        /**
         * column (the first character in a line is between column 1 and column 2)
         */
        readonly column: number;
    }

    /**
     * A range in the editor. This interface is suitable for serialization.
     */
    export interface IRange {
        /**
         * Line number on which the range starts (starts at 1).
         */
        readonly startLineNumber: number;
        /**
         * Column on which the range starts in line `startLineNumber` (starts at 1).
         */
        readonly startColumn: number;
        /**
         * Line number on which the range ends.
         */
        readonly endLineNumber: number;
        /**
         * Column on which the range ends in line `endLineNumber`.
         */
        readonly endColumn: number;
    }
    export function isEmpty(): boolean;
    export class Range {
        /**
         * Line number on which the range starts (starts at 1).
         */
        readonly startLineNumber: number;
        /**
         * Column on which the range starts in line `startLineNumber` (starts at 1).
         */
        readonly startColumn: number;
        /**
         * Line number on which the range ends.
         */
        readonly endLineNumber: number;
        /**
         * Column on which the range ends in line `endLineNumber`.
         */
        readonly endColumn: number;
        constructor(startLineNumber: number, startColumn: number, endLineNumber: number, endColumn: number);
        /**
         * Test if this range is empty.
         */
        isEmpty(): boolean;
        /**
         * Test if `range` is empty.
         */
        static isEmpty(range: IRange): boolean;
        /**
         * Test if position is in this range. If the position is at the edges, will return true.
         */
        containsPosition(position: IPosition): boolean;
        /**
         * Test if `position` is in `range`. If the position is at the edges, will return true.
         */
        static containsPosition(range: IRange, position: IPosition): boolean;
        /**
         * Test if range is in this range. If the range is equal to this range, will return true.
         */
        containsRange(range: IRange): boolean;
        /**
         * Test if `otherRange` is in `range`. If the ranges are equal, will return true.
         */
        static containsRange(range: IRange, otherRange: IRange): boolean;
        /**
         * Test if `range` is strictly in this range. `range` must start after and end before this range for the result to be true.
         */
        strictContainsRange(range: IRange): boolean;
        /**
         * Test if `otherRange` is strictly in `range` (must start after, and end before). If the ranges are equal, will return false.
         */
        static strictContainsRange(range: IRange, otherRange: IRange): boolean;
        /**
         * A reunion of the two ranges.
         * The smallest position will be used as the start point, and the largest one as the end point.
         */
        plusRange(range: IRange): Range;
        /**
         * A reunion of the two ranges.
         * The smallest position will be used as the start point, and the largest one as the end point.
         */
        static plusRange(a: IRange, b: IRange): Range;
        /**
         * A intersection of the two ranges.
         */
        intersectRanges(range: IRange): Range | null;
        /**
         * A intersection of the two ranges.
         */
        static intersectRanges(a: IRange, b: IRange): Range | null;
        /**
         * Test if this range equals other.
         */
        equalsRange(other: IRange | null): boolean;
        /**
         * Test if range `a` equals `b`.
         */
        static equalsRange(a: IRange | null, b: IRange | null): boolean;
        /**
         * Return the end position (which will be after or equal to the start position)
         */
        getEndPosition(): Position;
        /**
         * Return the end position (which will be after or equal to the start position)
         */
        static getEndPosition(range: IRange): Position;
        /**
         * Return the start position (which will be before or equal to the end position)
         */
        getStartPosition(): Position;
        /**
         * Return the start position (which will be before or equal to the end position)
         */
        static getStartPosition(range: IRange): Position;
        /**
         * Transform to a user presentable string representation.
         */
        toString(): string;
        /**
         * Create a new range using this range's start position, and using endLineNumber and endColumn as the end position.
         */
        setEndPosition(endLineNumber: number, endColumn: number): Range;
        /**
         * Create a new range using this range's end position, and using startLineNumber and startColumn as the start position.
         */
        setStartPosition(startLineNumber: number, startColumn: number): Range;
        /**
         * Create a new empty range using this range's start position.
         */
        collapseToStart(): Range;
        /**
         * Create a new empty range using this range's start position.
         */
        static collapseToStart(range: IRange): Range;
        static fromPositions(start: IPosition, end?: IPosition): Range;
        /**
         * Create a `Range` from an `IRange`.
         */
        static lift(range: undefined | null): null;
        static lift(range: IRange): Range;
        static lift(range: IRange | undefined | null): Range | null;
        /**
         * Test if `obj` is an `IRange`.
         */
        static isIRange(obj: any): obj is IRange;
        /**
         * Test if the two ranges are touching in any way.
         */
        static areIntersectingOrTouching(a: IRange, b: IRange): boolean;
        /**
         * Test if the two ranges are intersecting. If the ranges are touching it returns true.
         */
        static areIntersecting(a: IRange, b: IRange): boolean;
        /**
         * A function that compares ranges, useful for sorting ranges
         * It will first compare ranges on the startPosition and then on the endPosition
         */
        static compareRangesUsingStarts(a: IRange | null | undefined, b: IRange | null | undefined): number;
        /**
         * A function that compares ranges, useful for sorting ranges
         * It will first compare ranges on the endPosition and then on the startPosition
         */
        static compareRangesUsingEnds(a: IRange, b: IRange): number;
        /**
         * Test if the range spans multiple lines.
         */
        static spansMultipleLines(range: IRange): boolean;
        toJSON(): IRange;
    }
    
}