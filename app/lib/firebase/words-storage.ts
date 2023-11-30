
import { QueryType, Word } from "../definitions";
import { Firestore, collection, getDocs, query, where  } from "firebase/firestore";

export const searchWords = async (db: Firestore, searchQuery: string): Promise<Word[]> => {
  const inputType = determineInputType(searchQuery);
  let searchResults: Word[] = [];

  switch (inputType) {
    case QueryType.English:
      searchResults = await searchEnglish(db, searchQuery);
      break;
    case QueryType.Hanzi:
      searchResults = await searchHanzi(db, searchQuery);
      break;
    case QueryType.Pinyin:
      searchResults = await searchPinyin(db, searchQuery);
      break;
    default:
      // Handle any other cases or default behavior
      break;
  }

  return sortWordsByClosestMatch(searchResults, searchQuery);
};

const determineInputType = (input: string): QueryType => {
  const hanziPattern = /[\u3400-\u9FBF]/;
  const pinyinPattern = /[a-zA-Z]+[1-5]?/;

  if (hanziPattern.test(input)) {
    return QueryType.Hanzi;
  } else if (pinyinPattern.test(input)) {
    return QueryType.Pinyin;
  } else {
    return QueryType.English;
  }
};

const searchHanzi = async (db: Firestore, word: string): Promise<Word[]> => {
  const wordsRef = collection(db, "words");
  const q = query(wordsRef, where("simplified", "==", word), where("traditional", "==", word));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => doc.data() as Word);
};

const normalizePinyin = (pinyin: string): string => {
const toneMap: { [key: string]: string } = {
  'ā': 'a1', 'á': 'a2', 'ǎ': 'a3', 'à': 'a4',
  'ē': 'e1', 'é': 'e2', 'ě': 'e3', 'è': 'e4',
  'ī': 'i1', 'í': 'i2', 'ǐ': 'i3', 'ì': 'i4',
  'ō': 'o1', 'ó': 'o2', 'ǒ': 'o3', 'ò': 'o4',
  'ū': 'u1', 'ú': 'u2', 'ǔ': 'u3', 'ù': 'u4',
  'ǖ': 'v1', 'ǘ': 'v2', 'ǚ': 'v3', 'ǜ': 'v4', 'ü': 'v5'
  // Add more mappings for ü and other vowels as needed
};

  let normalized = pinyin.split('').map(char => toneMap[char] || char).join('');
  
  // Add tone numbers for Pinyin without tones (default to 5 for no tone)
  normalized = normalized.replace(/([a-zA-ZüÜ]+)(?![1-5])/g, '$15');

  return normalized;
};

const searchPinyin = async (db: Firestore, pinyin: string): Promise<Word[]> => {
  const normalizedPinyin = normalizePinyin(pinyin);
  const wordsRef = collection(db, "words");
  const q = query(wordsRef, where("pinyin", "==", normalizedPinyin));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => doc.data() as Word);
};

const searchEnglish = async (db: Firestore, definition: string): Promise<Word[]> => {
  const wordsRef = collection(db, "words");
  const q = query(wordsRef, where("definition", "==", definition));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => doc.data() as Word);
};

const calculateMatchScore = (word: string, query: string): number => {
  if (word === query) {
    // Exact match
    return Infinity;
  } else {
    // Calculate the number of characters in the word that match the query
    let matchCount = 0;
    for (let i = 0; i < query.length; i++) {
      if (word.includes(query[i])) {
        matchCount++;
      }
    }

    // Return the match count, higher is better
    // You might want to experiment with different scoring strategies
    return matchCount;
  }
};

const sortWordsByClosestMatch = (words: Word[], query: string): Word[] => {
  return words.sort((a, b) => {
    const scoreA = calculateMatchScore(a.definition, query);
    const scoreB = calculateMatchScore(b.definition, query);

    if (scoreA === scoreB) {
      // If scores are equal, sort alphabetically as a fallback
      return a.definition.localeCompare(b.definition);
    }
    // Higher score comes first
    return scoreB - scoreA;
  });
};


        
  