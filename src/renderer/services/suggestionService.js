import log from '../log'
import Dexie from 'dexie'

const db = new Dexie('db_suggestions')
db.version(1).stores({
  words: 'word',
  contacts: 'contact'
})
log.info('suggestions db initialized')

/**
 * Adds a word to the suggestion list
 * @param {string} type The type of text to add (word or contact)
 * @param {string} text Text to add
 */
async function put (type, text) {
  if (type === 'word') {
    db.words.put({
      word: text
    })
  } else if (type === 'contact') {
    db.contacts.put({
      contact: text
    })
  }
}

/**
 * Searches for suggestions based on the type
 * @param {string} type The type of text to search for (word or contact)
 * @param {string} start Starting string
 */
async function get (type, start) {
  if (type === 'word') {
    const result = await db.words.toArray()
    return result
  } else if (type === 'contact') {
    const result = db.contacts.where('contact').startsWith(start).toArray()
    return result
  }
  return []
}

export default { put, get }
