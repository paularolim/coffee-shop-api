import { AccountModel } from '../../../domain/models/account';
import { Authentication, AuthenticationModel } from '../../../domain/usecases/authentication';
import { LoadAccountByEmailRepository } from '../../protocols/database/authentication/load-account-by-email-repository';
import { DbAuthentication } from './db-authentication';

interface SutTypes {
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository;
  sut: Authentication;
}

const makeFakeAccount = (): AccountModel => ({
  id: 'any_id',
  email: 'any_email',
  name: 'any_name',
  password: 'any_pass',
});

const makeFakeAuthentication = (): AuthenticationModel => ({
  email: 'any_email@mail.com',
  password: '1234',
});

const makeLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async load(email: string): Promise<AccountModel | null> {
      return makeFakeAccount();
    }
  }

  return new LoadAccountByEmailRepositoryStub();
};

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository();
  const sut = new DbAuthentication(loadAccountByEmailRepositoryStub);
  return { loadAccountByEmailRepositoryStub, sut };
};

describe('DbAuthentication usecase', () => {
  it('should call LoadAccountByEmailRepository with correct email', async () => {
    const { loadAccountByEmailRepositoryStub, sut } = makeSut();
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'load');

    await sut.auth(makeFakeAuthentication());
    expect(loadSpy).toHaveBeenCalledWith('any_email@mail.com');
  });

  it('should throw if LoadAccountByEmailRepository throws', async () => {
    const { loadAccountByEmailRepositoryStub, sut } = makeSut();
    jest
      .spyOn(loadAccountByEmailRepositoryStub, 'load')
      .mockReturnValueOnce(new Promise((_, reject) => reject(new Error())));

    const promise = sut.auth(makeFakeAuthentication());
    expect(promise).rejects.toThrow();
  });

  it('should return null if LoadAccountByEmailRepository returns null', async () => {
    const { loadAccountByEmailRepositoryStub, sut } = makeSut();
    jest
      .spyOn(loadAccountByEmailRepositoryStub, 'load')
      .mockReturnValueOnce(new Promise((resolve) => resolve(null)));

    const accessToken = await sut.auth(makeFakeAuthentication());
    expect(accessToken).toBeNull();
  });
});
