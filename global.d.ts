// global.d.ts
interface Window {
  HanziLookup: {
    init: (
      name: string,
      url: string,
      callback: (success: boolean) => void
    ) => void;
    Matcher: typeof HanziLookupMatcher;
    AnalyzedCharacter: typeof HanziLookupAnalyzedCharacter;
    CharacterMatch: typeof HanziLookupCharacterMatch;
    CubicCurve2D: typeof HanziLookupCubicCurve2D;
  };
}

declare class HanziLookupMatcher {
  constructor(dataSet: string);
  match(
    character: HanziLookupAnalyzedCharacter,
    count: number,
    callback: (matches: HanziLookupCharacterMatch[]) => void
  ): void;
}

declare class HanziLookupAnalyzedCharacter {
  constructor(strokes: number[][][]);
  top: number;
  bottom: number;
  left: number;
  right: number;
  analyzedStrokes: HanziLookupAnalyzedStroke[];
  subStrokeCount: number;
}

declare class HanziLookupAnalyzedStroke {
  points: number[][];
  pivotIndexes: number[];
  subStrokes: HanziLookupSubStroke[];
}

declare class HanziLookupCharacterMatch {
  character: string;
  score: number;
}

declare class HanziLookupCubicCurve2D {
  constructor(
    x1: number,
    y1: number,
    cx1: number,
    cy1: number,
    cx2: number,
    cy2: number,
    x2: number,
    y2: number
  );
  getYOnCurve(t: number): number;
  solveForX(t: number): number[];
  getFirstSolutionForX(t: number): number;
}

declare class HanziLookupSubStroke {
  direction: number;
  length: number;
  centerX: number;
  centerY: number;
}
