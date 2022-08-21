export class ServerError extends Error {
  constructor(stack: string | null) {
    super('Something went wrong. Please try again later.');
    this.name = 'ServerError';
    this.stack = stack || '';
  }
}
