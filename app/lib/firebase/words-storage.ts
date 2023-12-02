import { Firestore, collection, query, where, getDocs, Query, DocumentData, DocumentSnapshot, startAfter, limit } from "firebase/firestore";
import { QueryType, Word } from "../definitions";

const PAGE_SIZE = 30;

const toneMap:{[key:string]:string} = {
  'ā': 'a1', 'á': 'a2', 'ǎ': 'a3', 'à': 'a4',
  'ē': 'e1', 'é': 'e2', 'ě': 'e3', 'è': 'e4',
  'ī': 'i1', 'í': 'i2', 'ǐ': 'i3', 'ì': 'i4',
  'ō': 'o1', 'ó': 'o2', 'ǒ': 'o3', 'ò': 'o4',
  'ū': 'u1', 'ú': 'u2', 'ǔ': 'u3', 'ù': 'u4',
  'ǖ': 'v1', 'ǘ': 'v2', 'ǚ': 'v3', 'ǜ': 'v4', 'ü': 'v5'
};

export const searchWords = async (db: Firestore, searchQuery: string): Promise<Word[]> => {
  const inputType = determineInputType(searchQuery);
  let searchResults: Word[] = [];

  if (inputType === QueryType.Hanzi) {
    searchResults = await searchHanzi(db, searchQuery);
    return filterAndSortWords(searchResults, searchQuery, inputType);
  } else {
    const englishResults = await searchEnglish(db, searchQuery);

    searchResults = englishResults;
    return searchResults;
  }
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


const searchPinyin = async (db: Firestore, pinyinInput: string, page: number): Promise<Word[]> => {
  // const wordsRef = collection(db, "words");
  // let searchQueries = generatePinyinQueries(db, pinyinInput);

  // let results = new Map();
  // for (let q of searchQueries) {
  //   const limitedQuery = query(q, limit(PAGE_SIZE));
  //   const snapshot = await getDocs(limitedQuery);
  //   snapshot.forEach(doc => results.set(doc.id, doc.data() as Word));
  // }

  // return Array.from(results.values());
  return [];
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

const calculateMatchScore = (word: Word, query: string, queryType: QueryType): number => {
  switch (queryType) {
    case QueryType.Hanzi:
      return calculateHanziMatchScore(word, query);
    case QueryType.English:
      return calculateEnglishMatchScore(word, query);
    case QueryType.Pinyin:
      return calculatePinyinMatchScore(word, query);
    default:
      return 0;
  }
};

const calculateHanziMatchScore = (word: Word, query: string): number => {
  let matchCount = 0;
  const combinedHanzi = word.simplified + word.traditional;

  query.split('').forEach(char => {
    if (combinedHanzi.includes(char)) {
      matchCount++; // Increment for each character match
    }
  });

  // Subtract score for extra characters (in combinedHanzi but not in query)
  const extraChars = combinedHanzi.split('').filter(char => !query.includes(char)).length;
  return matchCount - extraChars * 0.5; // Weight for extra characters can be adjusted
};


const calculateEnglishMatchScore = (word: Word, query: string): number => {
  const queryLower = query.toLowerCase();
  const definitionLower = word.definition.toLowerCase();
  
  let score = 0;
  let pos = definitionLower.indexOf(queryLower);
  while (pos !== -1) {
    score++;
    pos = definitionLower.indexOf(queryLower, pos + 1);
  }

  // Additional scoring logic can be added here
  return score;
};

const calculatePinyinMatchScore = (word: Word, query: string): number => {
  // Placeholder for Pinyin match score calculation
  return 0; // Placeholder return value
};


const sortWordsByClosestMatch = (words: Word[], query: string, queryType: QueryType): Word[] => {
  return words.sort((a, b) => {
    const scoreA = calculateMatchScore(a, query, queryType);
    const scoreB = calculateMatchScore(b, query, queryType);

    if (scoreA === scoreB) {
      return a.definition.localeCompare(b.definition);
    }
    return scoreB - scoreA;
  });
};

const filterAndSortWords = (words: Word[], query: string, queryType: QueryType): Word[] => {
  let filteredWords = words.filter(word => {
    switch(queryType) {
      case QueryType.English:
        return word.definition.toLowerCase().includes(query.toLowerCase());
      case QueryType.Hanzi:
        return word.simplified.includes(query) || word.traditional.includes(query);
      case QueryType.Pinyin:
        return word.pinyin.includes(query);
      default:
        return false;
    }
  });

  const sortedWords = sortWordsByClosestMatch(filteredWords, query, queryType);
  return sortedWords;
};

