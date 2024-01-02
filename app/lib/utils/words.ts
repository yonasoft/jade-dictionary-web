import { Firestore, arrayUnion, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { WordList, Word, WordAspect } from "../definitions";
import { searchWords } from "../firebase/storage/words";

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
  
