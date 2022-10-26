export interface Encrypter {
  encrypt(value: object): Promise<string | null>;
}
