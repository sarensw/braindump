import fs from 'fs/promises'

export const fileExists = async path => !!(await fs.stat(path).catch(e => false))
