/* eslint-disable max-classes-per-file */
import { AccountModel } from '../../../domain/models/account';
import { AddAccountModel } from '../../../domain/usecases/add-account';
import { AddAccountRepository } from '../../protocols/database/account/add-account-repository';
import { Hasher } from '../../protocols/criptography/hasher';
import { DbAddAccount } from './db-add-account';

const makeFakeAccount = (): AccountModel => ({
  id: 'any_id',
  name: 'any_name',
  email: 'any_email',
  password: 'any_password',
  phone: 'any_phone',
});

const makeFakeAccountData = (): AddAccountModel => ({
  name: 'any_name',
  email: 'any_email',
  password: 'any_password',
  phone: 'any_phone',
});

interface SutTypes {
  sut: DbAddAccount;
  hasherStub: Hasher;
}

const makeHasher = (): Hasher => {
  class HasherStub implements Hasher {
    async hash(value: string): Promise<string> {
      return new Promise((resolve) => resolve('hashed_password'));
    }
  }
  const hasherStub = new HasherStub();
  return hasherStub;
};

const makeSut = (): SutTypes => {
  class AddAccountRepositorySpy implements AddAccountRepository {
    async add(data: AddAccountModel): Promise<AccountModel | null> {
      return new Promise((resolve) => resolve(makeFakeAccount()));
    }
  }

  const hasherStub = makeHasher();
  const addAccountRepositorySpy = new AddAccountRepositorySpy();
  const sut = new DbAddAccount(hasherStub, addAccountRepositorySpy);

  return { sut, hasherStub };
};

describe('DbAddAccount Usecase', () => {
  it('should call Hasher with correct password', async () => {
    const { sut, hasherStub } = makeSut();
    const encryptSpy = jest.spyOn(hasherStub, 'hash');
    await sut.add(makeFakeAccountData());

    expect(encryptSpy).toHaveBeenCalledWith('any_password');
  });

  it('should throw if Hasher throws', async () => {
    const { sut, hasherStub } = makeSut();

    jest
      .spyOn(hasherStub, 'hash')
      .mockReturnValueOnce(new Promise((_, reject) => reject(new Error())));

    const promise = sut.add(makeFakeAccountData());

    await expect(promise).rejects.toThrow();
  });
});
