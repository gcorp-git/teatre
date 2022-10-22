export interface IMole {
  spy(agent: (method: string, ...args: any) => void): () => void
}
