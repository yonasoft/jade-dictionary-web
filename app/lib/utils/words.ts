import { Firestore, arrayUnion, doc, serverTimestamp, updateDoc } from "firebase/firestore";

import { searchWords } from "../firebase/storage/words";
import { Word, WordAspect } from "../types/word";

export const textifyHanzi = (word: Word) => {
    return `${word.simplified}${
            (word.traditional !== word.simplified) ? ` (${word.traditional})` : ""
        }`
}

export const extractWordAspect = (word: Word, QAType: WordAspect | null) => {
    if (!QAType) return null;
    switch (QAType) {
      case WordAspect.Hanzi:
        return textifyHanzi(word);
      case WordAspect.Pinyin:
        return word.pinyin;
      case WordAspect.Definition:
        return word.definition;
      default:
        break;
    }
};
  
