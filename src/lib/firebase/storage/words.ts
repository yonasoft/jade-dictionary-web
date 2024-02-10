import { Firestore, collection, query, where, getDocs, Query, DocumentData, DocumentSnapshot, startAfter, limit, addDoc, getDoc, doc } from "firebase/firestore";
import { Console } from "console";
import { Auth } from "@firebase/auth";
import { Word, WordAspect } from "../../types/word";

const PAGE_SIZE = 30;

const toneMarksToNumbers:{ [key: string]: string } = {
    'ā': 'a1', 'á': 'a2', 'ǎ': 'a3', 'à': 'a4',
    'ē': 'e1', 'é': 'e2', 'ě': 'e3', 'è': 'e4',
    'ī': 'i1', 'í': 'i2', 'ǐ': 'i3', 'ì': 'i4',
    'ō': 'o1', 'ó': 'o2', 'ǒ': 'o3', 'ò': 'o4',
    'ū': 'u1', 'ú': 'u2', 'ǔ': 'u3', 'ù': 'u4',
    'ǖ': 'v1', 'ǘ': 'v2', 'ǚ': 'v3', 'ǜ': 'v4', 'ü': 'v5'
};

export const searchWords = async (db: Firestore, input: string): Promise<Word[]> => {
  const inputType = determineInputType(input);
  console.log('input', input);
  console.log('inputType', inputType);
  let searchResults: Word[] = [];

  switch (inputType) {
    case WordAspect.Hanzi:
      searchResults = await searchHanzi(db, input);
      break;
    case WordAspect.Pinyin:
      searchResults = await searchPinyin(db, input);
      break;
    case WordAspect.Definition:
      searchResults = await searchEnglish(db, input);
      break;
  }

  console.log('searchResults', searchResults);
  return filterAndSortWords(searchResults, input, inputType);
};

   
const searchHanzi = async (db: Firestore, input: string): Promise<Word[]> => {
  const wordsRef = collection(db, "words");
  const qSimplified = query(wordsRef, where("simplified", ">=", input), where("simplified", "<=", input + '\uf8ff'), limit(PAGE_SIZE));
  const qTraditional = query(wordsRef, where("traditional", ">=", input), where("traditional", "<=", input + '\uf8ff'), limit(PAGE_SIZE));

  const simplifiedResults = await getDocs(qSimplified);
  const traditionalResults = await getDocs(qTraditional);

  const results = new Map();
  [simplifiedResults, traditionalResults].forEach(snapshot => {
    snapshot.forEach(doc => {
      results.set(doc.id, doc.data() as Word);
    });
  });

  return Array.from(results.values());
};

const searchEnglish = async (db: Firestore, input: string): Promise<Word[]> => {
  const wordsRef = collection(db, "words");
  const lowercaseDefinition = input.toLowerCase();
  const q = query(
    wordsRef, 
    where("definition", ">=", lowercaseDefinition), 
    limit(PAGE_SIZE)
  );
  const querySnapshot = await getDocs(q);
  const allResults = querySnapshot.docs.map(doc => doc.data() as Word);

  return allResults;
};

const searchPinyin = async (db: Firestore, input: string): Promise<Word[]> => {
  const wordsRef = collection(db, "words");

  const lowercaseInput = input.toLowerCase();
  const normalizedInput = normalizePinyinInput(lowercaseInput);

  console.log('normalizedInput', normalizedInput);
  const q = query(wordsRef, where("pinyin", ">=", normalizedInput), limit(PAGE_SIZE));

  const querySnapshot = await getDocs(q);
  const allResults = querySnapshot.docs.map(doc => doc.data() as Word);

  console.log('allResults', allResults);
  return allResults;
};


const convertToneMarksToNumbers = (input:string) => {

  return input.replace(/[āáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜü]/g, match => toneMarksToNumbers[match] || match);
};

const rearrangeToneNumbersAndAddSpaces = (input: string): string => {
  const syllables = input
    .split(/\s+/) 
    .map(syllable => {

      let rearranged = syllable.replace(/^([bpmfdtnlgkhjqxzcsryw]*)([aeiouü]+)([ngh]?)([1-5]?)$/, '$1$2$3$4');

      rearranged = rearranged.replace(/([aeiouü])([1-5])([ngh]?)/, '$1$3$2');
      return rearranged;
    })
    .join(' ');

  return syllables.replace(/([1-5])([bpmfdtnlgkhjqxzcsryw])/g, '$1 $2');
};

const normalizePinyinInput = (input: string): string => {

  if (input.match(/[āáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜü]/)) {
    input = convertToneMarksToNumbers(input);
  }

  input = rearrangeToneNumbersAndAddSpaces(input);

  return input.trim();
};

const determineInputType = (input: string): WordAspect => {
  const hanziPattern = /[\u3400-\u9FBF]/;
  const pinyinPatternWithNumbers = /[a-zA-ZüÜ]+[1-5]/; 
  const pinyinPatternWithTones = /(\b[a-zA-ZüÜ]*(?:ā|á|ǎ|à|ē|é|ě|è|ī|í|ǐ|ì|ō|ó|ǒ|ò|ū|ú|ǔ|ù|ǖ|ǘ|ǚ|ǜ|ü)\b)/;

  if (hanziPattern.test(input)) {
    return WordAspect.Hanzi;
  }
  if (pinyinPatternWithNumbers.test(input) || pinyinPatternWithTones.test(input)) {
    return WordAspect.Pinyin;
  }
  return WordAspect.Definition; 
};

const calculateMatchScore = (word: Word, input: string, queryType: WordAspect): number => {
  switch (queryType) {
    case WordAspect.Hanzi:
      return calculateHanziMatchScore(word, input);
    case WordAspect.Definition:
      return calculateEnglishMatchScore(word, input);
    default:
      return 0;
  }
};

const calculateHanziMatchScore = (word: Word, input: string): number => {
  let matchCount = 0;
  const combinedHanzi = word.simplified + word.traditional;

  input.split('').forEach(char => {
    if (combinedHanzi.includes(char)) {
      matchCount++; 
    }
  });

  const extraChars = combinedHanzi.split('').filter(char => !input.includes(char)).length;
  return matchCount - extraChars * 0.5; 
};

const calculateEnglishMatchScore = (word: Word, query: string): number => {
  const queryLower = query.toLowerCase();
  const definitionLower = word.definition.toLowerCase();

  if (definitionLower === queryLower) {
    return 100; 
  }

  let score = 0;
  let pos = definitionLower.indexOf(queryLower);
  while (pos !== -1) {
    score += 10; 
    pos = definitionLower.indexOf(queryLower, pos + 1);
  }

  const queryWords = queryLower.split(/\s+/);
  queryWords.forEach(word => {
    pos = definitionLower.indexOf(word);
    while (pos !== -1) {
      score += 1; 
      pos = definitionLower.indexOf(word, pos + 1);
    }
  });

  return score;
};

const sortWordsByClosestMatch = (words: Word[], input: string, inputType: WordAspect): Word[] => {
  return words.sort((a, b) => {
    const scoreA = calculateMatchScore(a, input, inputType);
    const scoreB = calculateMatchScore(b, input, inputType);

    if (scoreA === scoreB) {
      return a.definition.localeCompare(b.definition);
    }
    return scoreB - scoreA;
  });
};

const filterAndSortWords = (words: Word[], input: string, inputType: WordAspect): Word[] => {
  let filteredWords = words.filter(word => {
    switch(inputType) {
      case WordAspect.Definition:
        return word.definition.toLowerCase().includes(input.toLowerCase());
      case WordAspect.Hanzi:
        return word.simplified.includes(input) || word.traditional.includes(input);
      case WordAspect.Pinyin:
        return true;
      default:
        return false;
    }
  });

  if (inputType === WordAspect.Hanzi || inputType === WordAspect.Definition) {
    return sortWordsByClosestMatch(filteredWords, input, inputType);
  }
  
  return filteredWords;
};

export const getWordById = async (db: Firestore, _id: number): Promise<Word | null> => {
  const wordRef = doc(db, 'words', _id.toString());
  const wordSnap = await getDoc(wordRef);

  if (wordSnap.exists()) {
    return wordSnap.data() as Word;
  } else {
    console.log('No such document!');
    return null;
  }
};

export const getWordsByIds = async (db: Firestore, ids: number[]): Promise<Word[]> => {
  const wordsRef = collection(db, 'words');
  const q = query(wordsRef, where('_id', 'in', ids));
  const querySnapshot = await getDocs(q);
  const words = querySnapshot.docs.map(doc => doc.data() as Word);
  
  return words;
};
