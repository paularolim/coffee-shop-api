/* eslint-disable max-classes-per-file */
import { AccountModel } from '../../../domain/models/account';
import { Authentication, AuthenticationModel } from '../../../domain/usecases/authentication';
import { HashComparer } from '../../protocols/criptography/hash-comparer';
import { TokenGenerator } from '../../protocols/criptography/token-generator';
import { LoadAccountByEmailRepository } from '../../protocols/database/authentication/load-account-by-email-repository';
import { DbAuthentication } from './db-authentication';

interface SutTypes {
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository;
  hashComparerStub: HashComparer;
  tokenGeneratorStub: TokenGenerator;
  sut: Authentication;
}

const makeFakeAccount = (): AccountModel => ({
  id: 'any_id',
  email: 'any_email',
  name: 'any_name',
  password: 'hashed_pass',
});

const makeFakeAuthentication = (): AuthenticationModel => ({
  email: 'any_email@mail.com',
  password: 'any_pass',
});

const makeTokenGenerator = (): TokenGenerator => {
  class TokenGeneratorStub implements TokenGenerator {
    async generate(id: string): Promise<string> {
      return 'any_token';
    }
  }

  return new TokenGeneratorStub();
};

const makeHashComparer = (): HashComparer => {
  class HashComparerStub implements HashComparer {
    async compare(value: string, hash: string): Promise<boolean> {
      return true;
    }
  }

  return new HashComparerStub();
};

const makeLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async load(email: string): Promise<AccountModel | null> {
      return makeFakeAccount();
    }
  }

  return new LoadAccountByEmailRepositoryStub();
};

const makeSut = (): SutTypes => {
  const tokenGeneratorStub = makeTokenGenerator();
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository();
  const hashComparerStub = makeHashComparer();
  const sut = new DbAuthentication(
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
    tokenGeneratorStub,
  );
  return { loadAccountByEmailRepositoryStub, sut, hashComparerStub, tokenGeneratorStub };
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

  it('should call HashComparer with correct password', async () => {
    const { hashComparerStub, sut } = makeSut();
    const compareSpy = jest.spyOn(hashComparerStub, 'compare');

    await sut.auth(makeFakeAuthentication());
    expect(compareSpy).toHaveBeenCalledWith('any_pass', 'hashed_pass');
  });

  it('should throw if HashComparer throws', async () => {
    const { hashComparerStub, sut } = makeSut();
    jest
      .spyOn(hashComparerStub, 'compare')
      .mockReturnValueOnce(new Promise((_, reject) => reject(new Error())));

    const promise = sut.auth(makeFakeAuthentication());
    expect(promise).rejects.toThrow();
  });

  it('should return null if HashComparer returns false', async () => {
    const { hashComparerStub, sut } = makeSut();
    jest
      .spyOn(hashComparerStub, 'compare')
      .mockReturnValueOnce(new Promise((resolve) => resolve(false)));

    const accessToken = await sut.auth(makeFakeAuthentication());
    expect(accessToken).toBeNull();
  });

  it('should call TokenGenerator with correct id', async () => {
    const { tokenGeneratorStub, sut } = makeSut();
    const generateSpy = jest.spyOn(tokenGeneratorStub, 'generate');

    await sut.auth(makeFakeAuthentication());
    expect(generateSpy).toHaveBeenCalledWith('any_id');
  });

  it('should throw if TokenGenerator throws', async () => {
    const { tokenGeneratorStub, sut } = makeSut();
    jest
      .spyOn(tokenGeneratorStub, 'generate')
      .mockReturnValueOnce(new Promise((_, reject) => reject(new Error())));

    const promise = sut.auth(makeFakeAuthentication());
    expect(promise).rejects.toThrow();
  });
});
