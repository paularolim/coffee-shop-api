export class ServerError extends Error {
  constructor() {
    super('Something went wrong. Please try again later.');
    this.name = 'ServerError';
  }
}
