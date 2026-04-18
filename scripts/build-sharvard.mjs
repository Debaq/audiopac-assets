#!/usr/bin/env node
// Genera catalogs/sharvard-es-v1.json desde sources/sharvard/lists-phonemic-SAMPA.txt
// Formato fuente: code|ortho_uppercase_keys|SAMPA
import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'

const SRC = path.resolve('sources/sharvard/lists-phonemic-SAMPA.txt')
const OUT = path.resolve('catalogs/sharvard-es-v1.json')

const raw = fs.readFileSync(SRC, 'utf8')
const lines = raw.split(/\r?\n/).filter(l => l.trim() && !l.startsWith('sent|'))

function isAllUpper(token) {
  const letters = token.match(/\p{L}/gu) ?? []
  if (letters.length < 2) return false
  return letters.every(c => c === c.toUpperCase() && c !== c.toLowerCase())
}
const stripEdgePunct = w => w.replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, '')
const normalizeKey = w => w.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '').replace(/[^\p{L}\p{N}]+/gu, '')

const entries = []
for (const line of lines) {
  const [code, ortho] = line.split('|')
  if (!code || !ortho) continue
  const words = ortho.trim().split(/\s+/)
  const keywords = []
  const cleanWords = words.map(w => {
    const core = stripEdgePunct(w)
    if (isAllUpper(core)) {
      keywords.push(normalizeKey(core))
      return w.replace(core, core.toLowerCase())
    }
    return w
  })
  let sentence = cleanWords.join(' ')
  sentence = sentence.replace(/^(\P{L}*)(\p{L})/u, (_, pre, c) => pre + c.toUpperCase())
  if (!/[.!?]$/.test(sentence.trim())) sentence = sentence.trim() + '.'
  entries.push({ audio_id: code, sentence, keywords })
}

const lists = []
for (let i = 0; i < 70; i++) {
  const slice = entries.slice(i * 10, i * 10 + 10)
  const listNum = String(i + 1).padStart(2, '0')
  lists.push({
    code: `SHARVARD_ES_L${listNum}`,
    name: `Sharvard ES Lista ${i + 1}`,
    description: `Lista ${i + 1}/70 del corpus Sharvard peninsular ES. 10 frases balanceadas fonémicamente, 5 palabras clave por frase.`,
    items: slice.map((e, idx) => ({
      pos: idx + 1,
      token: e.sentence,
      keywords: e.keywords,
      audio_id: e.audio_id,
    })),
  })
}

const catalog = {
  id: 'sharvard-es',
  version: '1.0.0',
  schema: 1,
  source: 'https://zenodo.org/records/3547446',
  citation: 'Aubanel, V., García Lecumberri, M.L., Cooke, M. (2014). The Sharvard Corpus: A phonemically-balanced Spanish sentence resource for audiology. Int J Audiol 53(9):633-641.',
  license: 'CC-BY',
  language: 'es',
  region: 'ES',
  lists,
}

const json = JSON.stringify(catalog, null, 2)
fs.mkdirSync(path.dirname(OUT), { recursive: true })
fs.writeFileSync(OUT, json)

const hash = crypto.createHash('sha256').update(json).digest('hex')
console.log(`✓ ${OUT}`)
console.log(`  items: ${entries.length}, lists: ${lists.length}`)
console.log(`  sha256: ${hash}`)
console.log(`  bytes:  ${Buffer.byteLength(json)}`)
