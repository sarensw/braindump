import { Snippet } from '../../shared/types'
import log from '../log'
import { store } from '../store'
import { set } from '../store/storeSnippets'
import YAML from 'yaml'

import type { Document } from 'yaml'

const PATH_FILE_SNIPPETS: string = 'snippets.yaml'
const SNIPPETS_DEFAULT: Snippet = {
  name: 'Hello Snippet',
  description: 'Create your own snippets in the snippet editor. You can even use placeholders to quickly add variable parts in your snippets.',
  /* eslint-disable no-template-curly-in-string */
  body: 'Hello ${1:name}, greetings from Braindump, the ${2:best} editor in the world'
}

function getYamlDocument (snippets: Snippet[]): Document {
  const doc = new YAML.Document()
  doc.commentBefore = ' Copy the following block that starts with a dash (\'-\') to create your own snippets. Note that indentation is important. This file use the YAML format. Find more info here: https://en.wikipedia.org/wiki/YAML'
  doc.contents = snippets
  return doc
}

async function initializeSnippetsService (): Promise<void> {
  log.debug('initializing snippets')
  await loadSnippets()
}

async function readSnippets (): Promise<string> {
  log.debug('read snippets')
  let snippetsRaw = await window.__preload.invoke({
    channel: 'file/read',
    payload: {
      path: PATH_FILE_SNIPPETS
    }
  })
  log.debug(`snippets read (length): ${String(snippetsRaw).length}`)

  if (snippetsRaw === null) {
    log.debug('no snippets file existing yet, creating an empty one')

    await writeSnippets([SNIPPETS_DEFAULT])

    snippetsRaw = await window.__preload.invoke({
      channel: 'file/read',
      payload: {
        path: PATH_FILE_SNIPPETS
      }
    })
  }

  return snippetsRaw
}

async function loadSnippets (): Promise<Snippet[]> {
  log.debug('loading snippets')
  const snippetsRaw = await readSnippets()
  log.debug(snippetsRaw)
  const snippets = YAML.parse(snippetsRaw) as Snippet[]

  log.debug(`snippets loaded (text length ${snippetsRaw.length}, # ${snippets.length}`)
  store.dispatch(set(snippets))
  return snippets
}

async function writeSnippets (snippets: Snippet[]): Promise<void> {
  log.debug('save snippets')

  const doc = getYamlDocument(snippets)
  const snippetsRaw = doc.toString()
  window.__preload.send({
    channel: 'file/write',
    payload: {
      path: PATH_FILE_SNIPPETS,
      text: snippetsRaw
    }
  })
}

export { initializeSnippetsService, readSnippets, loadSnippets, writeSnippets, PATH_FILE_SNIPPETS }
