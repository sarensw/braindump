
export interface SharedFile {
  id: string
  cluster: string
  name: string
  path: string
}

export interface Dump extends File {
  title: string
}

export interface Snippet {
  name: string
  description: string
  body: string
}
