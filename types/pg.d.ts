declare module "pg" {
  export class Client {
    constructor(config?: { connectionString?: string; [key: string]: unknown })
    connect(): Promise<void>
    query<T = unknown>(text: string, values?: unknown[]): Promise<{ rows: T[] }>
    end(): Promise<void>
  }
}
