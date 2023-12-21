import { Firestore, collection, query, where, getDocs, Query, DocumentData, DocumentSnapshot, startAfter, limit, addDoc, getDoc, doc } from "firebase/firestore";
import { QueryType, Word, WordList } from "../../definitions";
import { Console } from "console";
import { Auth } from "@firebase/auth";

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
    case QueryType.Hanzi:
      searchResults = await searchHanzi(db, input);
      break;
    case QueryType.Pinyin:
      searchResults = await searchPinyin(db, input);
      break;
    case QueryType.English:
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

  // Convert input to lowercase before normalizing
  const lowercaseInput = input.toLowerCase();
  const normalizedInput = normalizePinyinInput(lowercaseInput);

  console.log('normalizedInput', normalizedInput);
  
  // Construct query for the normalized input
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
  // Split input into words (syllables with or without tone numbers)
  const syllables = input
    .split(/\s+/) // Split by spaces to handle multiple syllables
    .map(syllable => {
      // Rearrange the syllable to place the tone number at the end
      let rearranged = syllable.replace(/^([bpmfdtnlgkhjqxzcsryw]*)([aeiouü]+)([ngh]?)([1-5]?)$/, '$1$2$3$4');
      // Correct any misplaced tone numbers
      rearranged = rearranged.replace(/([aeiouü])([1-5])([ngh]?)/, '$1$3$2');
      return rearranged;
    })
    .join(' ');

  // Add spaces after each tone number
  return syllables.replace(/([1-5])([bpmfdtnlgkhjqxzcsryw])/g, '$1 $2');
};

const normalizePinyinInput = (input: string): string => {
  // Convert tone marks to numbers if present
  if (input.match(/[āáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜü]/)) {
    input = convertToneMarksToNumbers(input);
  }

  // Rearrange tone numbers to the end of syllables and handle spacing
  input = rearrangeToneNumbersAndAddSpaces(input);

  return input.trim();
};

const determineInputType = (input: string): QueryType => {
  const hanziPattern = /[\u3400-\u9FBF]/;
  const pinyinPatternWithNumbers = /[a-zA-ZüÜ]+[1-5]/; 
  const pinyinPatternWithTones = /(\b[a-zA-ZüÜ]*(?:ā|á|ǎ|à|ē|é|ě|è|ī|í|ǐ|ì|ō|ó|ǒ|ò|ū|ú|ǔ|ù|ǖ|ǘ|ǚ|ǜ|ü)\b)/;

  if (hanziPattern.test(input)) {
    return QueryType.Hanzi;
  }
  if (pinyinPatternWithNumbers.test(input) || pinyinPatternWithTones.test(input)) {
    return QueryType.Pinyin;
  }
  return QueryType.English; // Default to English
};

const calculateMatchScore = (word: Word, input: string, queryType: QueryType): number => {
  switch (queryType) {
    case QueryType.Hanzi:
      return calculateHanziMatchScore(word, input);
    case QueryType.English:
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
      matchCount++; // Increment for each character match
    }
  });
  // Subtract score for extra characters (in combinedHanzi but not in query)
  const extraChars = combinedHanzi.split('').filter(char => !input.includes(char)).length;
  return matchCount - extraChars * 0.5; // Weight for extra characters can be adjusted
};

const calculateEnglishMatchScore = (word: Word, query: string): number => {
  const queryLower = query.toLowerCase();
  const definitionLower = word.definition.toLowerCase();

  // Exact match
  if (definitionLower === queryLower) {
    return 100; // Assign a high score for exact match
  }

  let score = 0;
  let pos = definitionLower.indexOf(queryLower);
  while (pos !== -1) {
    score += 10; // Assign a lower score for containing the word/phrase
    pos = definitionLower.indexOf(queryLower, pos + 1);
  }

  // For partial matches, we can score each matching word separately
  const queryWords = queryLower.split(/\s+/);
  queryWords.forEach(word => {
    pos = definitionLower.indexOf(word);
    while (pos !== -1) {
      score += 1; // Lowest score for partial match
      pos = definitionLower.indexOf(word, pos + 1);
    }
  });

  return score;
};

const sortWordsByClosestMatch = (words: Word[], input: string, inputType: QueryType): Word[] => {
  return words.sort((a, b) => {
    const scoreA = calculateMatchScore(a, input, inputType);
    const scoreB = calculateMatchScore(b, input, inputType);

    if (scoreA === scoreB) {
      return a.definition.localeCompare(b.definition);
    }
    return scoreB - scoreA;
  });
};

const filterAndSortWords = (words: Word[], input: string, inputType: QueryType): Word[] => {
  let filteredWords = words.filter(word => {
    switch(inputType) {
      case QueryType.English:
        return word.definition.toLowerCase().includes(input.toLowerCase());
      case QueryType.Hanzi:
        return word.simplified.includes(input) || word.traditional.includes(input);
      case QueryType.Pinyin:
        // Assuming Pinyin search is already handled; no extra filtering needed
        return true;
      default:
        return false;
    }
  });

  if (inputType === QueryType.Hanzi || inputType === QueryType.English) {
    return sortWordsByClosestMatch(filteredWords, input, inputType);
  }

  // For Pinyin, either return as is or apply a different sorting logic if needed
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
