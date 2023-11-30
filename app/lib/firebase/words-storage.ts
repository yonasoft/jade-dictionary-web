import { Firestore, collection, query, where, getDocs } from "firebase/firestore";
import { QueryType, Word } from "../definitions";

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
      return [];
  }

  return filterAndSortWords(searchResults, searchQuery, inputType);
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

const normalizePinyin = (pinyin: string): string => {
  const toneMap:{ [key: string]: string } = {
    'ā': 'a1', 'á': 'a2', 'ǎ': 'a3', 'à': 'a4',
    'ē': 'e1', 'é': 'e2', 'ě': 'e3', 'è': 'e4',
    'ī': 'i1', 'í': 'i2', 'ǐ': 'i3', 'ì': 'i4',
    'ō': 'o1', 'ó': 'o2', 'ǒ': 'o3', 'ò': 'o4',
    'ū': 'u1', 'ú': 'u2', 'ǔ': 'u3', 'ù': 'u4',
    'ǖ': 'v1', 'ǘ': 'v2', 'ǚ': 'v3', 'ǜ': 'v4', 'ü': 'v5'
  };

  let normalized = pinyin.split('').map(char => toneMap[char] || char).join('');
  normalized = normalized.replace(/([a-zA-ZüÜ]+)(?![1-5])/g, '$15');
  return normalized;
};

const calculateMatchScore = (word: Word, query: string, queryType: QueryType): number => {
  let wordField = word.definition;
  if (queryType === QueryType.Hanzi) {
    wordField = word.simplified + word.traditional; // Combine both fields for comparison
  } else if (queryType === QueryType.Pinyin) {
    wordField = word.pinyin;
  }

  if (wordField.toLowerCase() === query.toLowerCase()) {
    // Exact match
    return Infinity;
  } else {
    let matchCount = 0;
    for (let i = 0; i < query.length; i++) {
      if (wordField.toLowerCase().includes(query[i].toLowerCase())) {
        matchCount++;
      }
    }
    return matchCount;
  }
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
        return word.pinyin.includes(normalizePinyin(query));
      default:
        return false;
    }
  });

  return sortWordsByClosestMatch(filteredWords, query, queryType);
};

// ... other functions ...

       
const searchHanzi = async (db: Firestore, word: string): Promise<Word[]> => {
  const wordsRef = collection(db, "words");
  const qSimplified = query(wordsRef, where("simplified", ">=", word), where("simplified", "<=", word + '\uf8ff'));
  const qTraditional = query(wordsRef, where("traditional", ">=", word), where("traditional", "<=", word + '\uf8ff'));

  const simplifiedResults = await getDocs(qSimplified);
  const traditionalResults = await getDocs(qTraditional);

  // Combine and filter unique results
  const results = new Map();
  [simplifiedResults, traditionalResults].forEach(snapshot => {
    snapshot.forEach(doc => {
      results.set(doc.id, doc.data() as Word);
    });
  });

  return Array.from(results.values());
};

const searchEnglish = async (db: Firestore, definition: string): Promise<Word[]> => {
  const wordsRef = collection(db, "words");
  const q = query(wordsRef, where("definition", "==", definition));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => doc.data() as Word);
};

const searchPinyin = async (db: Firestore, pinyin: string): Promise<Word[]> => {
  const normalizedPinyin = normalizePinyin(pinyin);
  const wordsRef = collection(db, "words");
  const q = query(wordsRef, where("pinyin", "==", normalizedPinyin));
  const querySnapshot = await getDocs(q);
  
  if (!querySnapshot.empty) {
    return querySnapshot.docs.map(doc => doc.data() as Word);
  } else {
    // Handle the case where no documents are found
    return [];
  }
};
