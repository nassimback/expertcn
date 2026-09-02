const suggestionStopWords = new Set(['avec', 'dans', 'des', 'les', 'pour', 'sur', 'une', 'un', 'et', 'de', 'du', 'la', 'le'])

export function normalizeSearchText(value) {
  return String(value ?? '')
    .replace(/<[^>]*>/g, ' ')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/œ/g, 'oe')
    .replace(/æ/g, 'ae')
    .toLocaleLowerCase('fr')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ')
}

function damerauLevenshtein(left, right) {
  const matrix = Array.from({ length: left.length + 1 }, (_, row) => {
    const values = Array(right.length + 1).fill(0)
    values[0] = row
    return values
  })
  for (let column = 0; column <= right.length; column += 1) matrix[0][column] = column
  for (let row = 1; row <= left.length; row += 1) {
    for (let column = 1; column <= right.length; column += 1) {
      const substitutionCost = left[row - 1] === right[column - 1] ? 0 : 1
      matrix[row][column] = Math.min(matrix[row - 1][column] + 1, matrix[row][column - 1] + 1, matrix[row - 1][column - 1] + substitutionCost)
      if (row > 1 && column > 1 && left[row - 1] === right[column - 2] && left[row - 2] === right[column - 1]) {
        matrix[row][column] = Math.min(matrix[row][column], matrix[row - 2][column - 2] + 1)
      }
    }
  }
  return matrix[left.length][right.length]
}

function wordScore(queryWord, candidateWord) {
  if (queryWord === candidateWord) return 0
  if (candidateWord.includes(queryWord) || queryWord.includes(candidateWord)) {
    return Math.abs(candidateWord.length - queryWord.length) / Math.max(candidateWord.length, queryWord.length) * .45
  }
  return damerauLevenshtein(queryWord, candidateWord) / Math.max(queryWord.length, candidateWord.length)
}

export function searchScore(query, text) {
  const normalizedQuery = normalizeSearchText(query)
  const normalizedText = normalizeSearchText(text)
  if (!normalizedQuery) return 0
  if (!normalizedText) return Number.POSITIVE_INFINITY
  if (normalizedText.includes(normalizedQuery)) return 0
  if (normalizedQuery.length < 3) return Number.POSITIVE_INFINITY
  const candidateWords = normalizedText.split(' ')
  return Math.max(...normalizedQuery.split(' ').map((queryWord) => Math.min(...candidateWords.map((candidateWord) => wordScore(queryWord, candidateWord)))))
}

export function isExactSearchMatch(query, text) {
  const normalizedQuery = normalizeSearchText(query)
  return !normalizedQuery || normalizeSearchText(text).includes(normalizedQuery)
}

export function isFuzzySearchMatch(query, text) {
  const normalizedQuery = normalizeSearchText(query)
  const threshold = normalizedQuery.length <= 4 ? .26 : .31
  return searchScore(query, text) <= threshold
}

export function rankSearchResults(items, query, getSearchText, limit = items.length) {
  const normalizedQuery = normalizeSearchText(query)
  const threshold = normalizedQuery.length <= 4 ? .26 : .31
  return items
    .map((item, index) => ({ item, index, score: searchScore(query, getSearchText(item)) }))
    .filter(({ score }) => Number.isFinite(score) && score <= threshold)
    .sort((left, right) => left.score - right.score || left.index - right.index)
    .slice(0, limit)
    .map(({ item }) => item)
}

export function getSpellingSuggestions(query, terms, limit = 3) {
  const normalizedQuery = normalizeSearchText(query)
  if (normalizedQuery.length < 3) return []
  const candidates = terms.flatMap((term) => {
    const cleanTerm = String(term ?? '').replace(/<[^>]*>/g, ' ').trim()
    return [cleanTerm, ...cleanTerm.split(/[\s/&,()–—-]+/).filter(Boolean)]
  })
  const uniqueCandidates = [...new Map(candidates
    .filter((candidate) => {
      const normalized = normalizeSearchText(candidate)
      return normalized.length >= 3 && !suggestionStopWords.has(normalized)
    })
    .map((candidate) => [normalizeSearchText(candidate), candidate])).values()]
  return uniqueCandidates
    .map((candidate) => ({ candidate, score: searchScore(query, candidate) }))
    .filter(({ candidate, score }) => normalizeSearchText(candidate) !== normalizedQuery && Number.isFinite(score) && score <= .34)
    .sort((left, right) => left.score - right.score || left.candidate.length - right.candidate.length)
    .slice(0, limit)
    .map(({ candidate }) => candidate)
}
