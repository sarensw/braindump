import { open } from 'fs/promises'
import log from 'electron-log'
import fuzzysort from 'fuzzysort'
import { join } from 'path'

interface SearchResult {
  id: string
  score: number
  indexes: number[]
  target: string
  path: string
  lnr: number
}

class FuzzySearch {
  private readonly fuzzyLimit: number = 100
  private readonly fuzzyThreshold: number = -10000

  async searchPath (id: string, path: string, directory: string, what: string): Promise<SearchResult[]> {
    // const id = '717a60b5-be89-49bb-9bbb-f7600a4170c5'
    // const path = 'dump_45_1639538554227'
    const fullPath = join(directory, path)
    const file = await open(fullPath, 'r')

    const stream = file.createReadStream({
      encoding: 'utf-8'
    })

    const result: SearchResult[] = []

    let lnr = 0

    for await (const chunk of stream) {
      try {
        const targets = String(chunk).split('\n')

        for (const target of targets) {
          // increase the line number before because lnr starts at 0
          lnr++

          const searchResults = await fuzzysort.goAsync(what, [target], {
            limit: this.fuzzyLimit,
            threshold: this.fuzzyThreshold
          })

          for (const searchResult of searchResults) {
            // The search results will contain null for every line
            // where nothing was founnd
            if (searchResult !== undefined && searchResult !== null) {
              result.push({
                id,
                score: searchResult.score,
                indexes: searchResult.indexes,
                target: searchResult.target,
                path,
                lnr
              })
            }
          }
        }
      } catch (err) {
        log.error('could not perform fuzzy search')
        log.error(err)
      }
    }

    return result
  }

  async search (files: Array<{ path: string, id: string }>, what: string): Promise<SearchResult[]> {
    log.debug(`search requested for ${what}`)

    const allResults: SearchResult[] = []

    for (const file of files) {
      const directory = '/Users/sarensw/OneDrive/bddata/'
      const result = await this.searchPath(file.id, file.path, directory, what)
      allResults.push(...result)
    }

    // sort all results by relevance
    allResults.sort((a, b) => b.score - a.score)

    return allResults
  }
}

export { FuzzySearch }
