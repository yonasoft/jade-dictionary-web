// Represents a point in a stroke, where the point is an array of two numbers: [x, y].
export type HanziPoint = [number, number];

// Represents a stroke, which is an array of HanziPoints.
export type HanziStroke = HanziPoint[];

// Represents a character, which is an array of HanziStrokes.
export type HanziCharacter = HanziStroke[];
