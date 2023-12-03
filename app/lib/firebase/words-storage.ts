import { Firestore, collection, query, where, getDocs, Query, DocumentData, DocumentSnapshot, startAfter, limit } from "firebase/firestore";
import { QueryType, Word } from "../definitions";

const PAGE_SIZE = 30;

export const searchWords = async (db: Firestore, input: string, page: number = 1): Promise<Word[]> => {
  const inputTypes = determineInputType(input);
console.log('inputTypes', inputTypes);
  let searchResults: Word[] = [];

  if (inputTypes.includes(QueryType.Hanzi)) {
    searchResults = await searchHanzi(db, input);
  } else {
    let combinedResults = [];
    if (inputTypes.includes(QueryType.English)) {
      combinedResults.push(...await searchEnglish(db, input));
    }
    if (inputTypes.includes(QueryType.Pinyin)) {
      combinedResults.push(...await searchPinyin(db, input));
    }
    searchResults = combinedResults;
    console.log('searchResults', searchResults);
  }
  console.log('searchResults', searchResults);
  return filterAndSortWords(searchResults, input, inputTypes);
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
  const normalizedInputs = normalizePinyinInput(input);

  console.log('Normalized Pinyin Inputs:', normalizedInputs);

  let queries: Query<DocumentData>[] = [];
  normalizedInputs.forEach((normalizedInput: string) => {
    console.log('Querying for Pinyin:', normalizedInput);
    // Handle case for pinyin with no tones
    if (!/\d/.test(normalizedInput)) {
      for (let tone = 1; tone <= 5; tone++) {
        queries.push(query(wordsRef, where("pinyin", ">=", `${normalizedInput}${tone}`), limit(PAGE_SIZE)));
      }
    } else {
      // For pinyin with tones, query as is
      queries.push(query(wordsRef, where("pinyin", ">=", normalizedInput), limit(PAGE_SIZE)));
    }
  });

  let results = new Map<string, Word>();
  for (let q of queries) {
    const snapshot = await getDocs(q);
    snapshot.forEach(doc => results.set(doc.id, doc.data() as Word));
  }

  console.log('Pinyin search results:', Array.from(results.values()));
  return Array.from(results.values());
};

const normalizePinyinInput = (input:string):string[] => {
  const toneMarksToNumbers:{[key:string]:string} = {
    'ā': 'a1', 'á': 'a2', 'ǎ': 'a3', 'à': 'a4',
    'ē': 'e1', 'é': 'e2', 'ě': 'e3', 'è': 'e4',
    'ī': 'i1', 'í': 'i2', 'ǐ': 'i3', 'ì': 'i4',
    'ō': 'o1', 'ó': 'o2', 'ǒ': 'o3', 'ò': 'o4',
    'ū': 'u1', 'ú': 'u2', 'ǔ': 'u3', 'ù': 'u4',
    'ǖ': 'v1', 'ǘ': 'v2', 'ǚ': 'v3', 'ǜ': 'v4', 'ü': 'v5'
  };

  let normalized = input.split('').map(char => toneMarksToNumbers[char] || char).join('');
  normalized = normalized.replace(/(\d)([a-zA-ZüÜ])/g, '$1 $2'); // Add space after numeric tone

  // Handle compounds: split the string into syllables and then handle each syllable
  const syllables = normalized.split(/\s+/).filter(s => s); // Split and filter out empty strings
  return syllables.map(syllable => {
    if (!/\d/.test(syllable)) {
      // If the syllable doesn't have a tone, consider all tones
      return Array.from({ length: 5 }, (_, i) => syllable + (i + 1));
    }
    return [syllable]; // Syllable with tone number remains as is
  }).flat(); // Flatten the array of arrays
};

const determineInputType = (input: string): QueryType[] => {
  const hanziPattern = /[\u3400-\u9FBF]/;
  const pinyinPatternWithTones = /(\b[a-zA-ZüÜ]*(?:ā|á|ǎ|à|ē|é|ě|è|ī|í|ǐ|ì|ō|ó|ǒ|ò|ū|ú|ǔ|ù|ǖ|ǘ|ǚ|ǜ|ü)\b)/;
  const pinyinPatternWithNumbers = /\b[a-zA-ZüÜ]+[1-5]\b/;
  const englishPattern = /[a-zA-Z]+/;

  let types: QueryType[] = [];

  if (hanziPattern.test(input)) {
    types.push(QueryType.Hanzi);
  }
  if (pinyinPatternWithTones.test(input) || pinyinPatternWithNumbers.test(input)) {
    types.push(QueryType.Pinyin);
  } 
  if (englishPattern.test(input) && !pinyinPatternWithTones.test(input) && !pinyinPatternWithNumbers.test(input)) {
    types.push(QueryType.English);
  }

  if (types.length === 0) {
    types.push(QueryType.English);
  }

  return types;
};

const calculateMatchScore = (word: Word, input: string, queryType: QueryType): number => {
  switch (queryType) {
    case QueryType.Hanzi:
      return calculateHanziMatchScore(word, input);
    case QueryType.English:
      return calculateEnglishMatchScore(word, input);
    case QueryType.Pinyin:
      return calculatePinyinMatchScore(word, input);
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

const calculatePinyinMatchScore = (word: Word, input: string): number => {
  const normalizedInputArray = normalizePinyinInput(input);
  const wordPinyinArray = Array.isArray(word.pinyin) ? word.pinyin : word.pinyin.split(' ');

  let score = 0;
  const maxScore = normalizedInputArray.length * 2; // Max score when all syllables match

  normalizedInputArray.forEach((inputSyllable) => {
    if (wordPinyinArray.some(wordSyllable => wordSyllable.startsWith(inputSyllable.slice(0, -1)))) {
      score += 2; // Score for each syllable match
    }
  });

  // Adjust the score to be a fraction of the maximum possible score
  score = (score / maxScore) * 100;

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

const filterAndSortWords = (words: Word[], input: string, inputTypes: QueryType[]): Word[] => {
  let filteredWords = words.filter(word => {
    return inputTypes.some(inputType => {
      switch(inputType) {
        case QueryType.English:
          return word.definition.toLowerCase().includes(input.toLowerCase());
        case QueryType.Hanzi:
          return word.simplified.includes(input) || word.traditional.includes(input);
        case QueryType.Pinyin:
          const normalizedInput = normalizePinyinInput(input);
          const wordPinyinArray = Array.isArray(word.pinyin) ? word.pinyin : word.pinyin.split(' '); // Ensure it's an array
          return normalizedInput.every(inputSyl => 
            wordPinyinArray.some(wordSyl => wordSyl.startsWith(inputSyl.slice(0, -1)))
          );
        default:
          return false;
      }
    });
  });

  const primaryType = inputTypes[0];
  const sortedWords = sortWordsByClosestMatch(filteredWords, input, primaryType);
  console.log('sortedPinYinWords', sortedWords);
  return sortedWords;
};

const paginateResults = (results: Word[], page: number, pageSize: number): Word[] => {
  const startIndex = (page - 1) * pageSize;
  return results.slice(startIndex, startIndex + pageSize);
};
