import { Authentication, AuthenticationModel } from '../../../domain/usecases/authentication';
import { HashComparer } from '../../protocols/criptography/hash-comparer';
import { Encrypter } from '../../protocols/criptography/encrypter';
import { LoadAccountByEmailRepository } from '../../protocols/database/authentication/load-account-by-email-repository';

export class DbAuthentication implements Authentication {
  private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository;

  private readonly hashComparer: HashComparer;

  private readonly encrypter: Encrypter;

  constructor(
    loadAccountByEmailRepository: LoadAccountByEmailRepository,
    hashComparer: HashComparer,
    encrypter: Encrypter,
  ) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository;
    this.hashComparer = hashComparer;
    this.encrypter = encrypter;
  }

  async auth(authentication: AuthenticationModel): Promise<string | null> {
    const account = await this.loadAccountByEmailRepository.loadByEmail(authentication.email);
    if (account) {
      const isValid = await this.hashComparer.compare(authentication.password, account.password);
      if (isValid) {
        return this.encrypter.encrypt(account.id);
      }
    }
    return null;
  }
}
