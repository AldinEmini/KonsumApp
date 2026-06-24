// Auto-translation using Emergent LLM key (OpenAI-compatible endpoint)
// Translates text fields from a source language to other languages

import OpenAI from 'openai'

let _client = null
function getClient() {
  if (_client) return _client
  _client = new OpenAI({
    apiKey: process.env.EMERGENT_LLM_KEY,
    baseURL: 'https://integrations.emergentagent.com/llm',
  })
  return _client
}

const LANGS = {
  en: 'English',
  sq: 'Albanian (Shqip)',
  mk: 'Macedonian (Македонски, Cyrillic script)',
}

/**
 * Translate an object's text fields into target languages.
 * Returns { en: {...}, sq: {...}, mk: {...} } where source lang has original values.
 *
 * @param {Object} obj  - object with text fields to translate
 * @param {string[]} fields - field names to translate
 * @param {string} sourceLang - 'en'|'sq'|'mk'
 */
export async function translateObject(obj, fields, sourceLang = 'en') {
  const targets = Object.keys(LANGS).filter(l => l !== sourceLang)
  const result = { [sourceLang]: {} }
  for (const f of fields) result[sourceLang][f] = obj[f] || ''

  // Build source content
  const sourceContent = fields.map(f => `${f}: ${obj[f] || ''}`).join('\n')

  for (const tl of targets) {
    try {
      const prompt = `You are a professional translator for a supermarket website called Konsum. Translate the following fields from ${LANGS[sourceLang]} to ${LANGS[tl]}. Keep the same format (one field per line: "fieldname: value"). Be natural and concise. For Macedonian use Cyrillic script. Preserve any HTML, brand names like "Konsum", prices and units (MKD, kg, etc) unchanged.

Source (${LANGS[sourceLang]}):
${sourceContent}

Translation (${LANGS[tl]}):`

      const completion = await getClient().chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.2,
        max_tokens: 800,
      })

      const text = completion.choices[0]?.message?.content || ''
      // Parse "fieldname: value" lines
      const dict = {}
      for (const line of text.split('\n')) {
        const m = line.match(/^([a-zA-Z_]+):\s*(.+)$/)
        if (m && fields.includes(m[1])) dict[m[1]] = m[2].trim()
      }
      // Fallback: if a field wasn't returned, use source
      for (const f of fields) if (!dict[f]) dict[f] = obj[f] || ''
      result[tl] = dict
    } catch (e) {
      console.error(`Translation to ${tl} failed:`, e.message)
      // Fallback: copy source
      result[tl] = {}
      for (const f of fields) result[tl][f] = obj[f] || ''
    }
  }

  return result
}

/**
 * Quick helper to get translated field with fallback chain.
 * @param {Object} obj - object with .translations field
 * @param {string} field - field name
 * @param {string} lang - target language
 */
export function getTranslated(obj, field, lang = 'en') {
  if (!obj) return ''
  return obj.translations?.[lang]?.[field]
    || obj.translations?.en?.[field]
    || obj[field]
    || ''
}
