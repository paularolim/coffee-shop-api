/* eslint-disable max-classes-per-file */
import { AccountModel } from '../../../domain/models/account';
import { AddAccountModel } from '../../../domain/usecases/add-account';
import { AddAccountRepository } from '../../protocols/database/account/add-account-repository';
import { Encrypter } from '../../protocols/encrypter';
import { DbAddAccount } from './db-add-account';

interface SutTypes {
  sut: DbAddAccount;
  encrypterStub: Encrypter;
}

const makeEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt(value: string): Promise<string> {
      return new Promise((resolve) => resolve('hashed_password'));
    }
  }
  const encrypterStub = new EncrypterStub();
  return encrypterStub;
};

const makeSut = (): SutTypes => {
  class AddAccountRepositorySpy implements AddAccountRepository {
    async add({ email, name, password }: AddAccountModel): Promise<AccountModel | null> {
      return new Promise((resolve) => resolve({ id: 'any_id', name, email, password }));
    }
  }

  const encrypterStub = makeEncrypter();
  const addAccountRepositorySpy = new AddAccountRepositorySpy();
  const sut = new DbAddAccount(encrypterStub, addAccountRepositorySpy);

  return { sut, encrypterStub };
};

describe('DbAddAccount Usecase', () => {
  it('should call Encrypter with correct password', async () => {
    const { sut, encrypterStub } = makeSut();
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt');
    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password',
    };
    await sut.add(accountData);

    expect(encryptSpy).toHaveBeenCalledWith('valid_password');
  });

  it('should throw if Encrypter throws', async () => {
    const { sut, encrypterStub } = makeSut();

    jest
      .spyOn(encrypterStub, 'encrypt')
      .mockReturnValueOnce(new Promise((_, reject) => reject(new Error())));

    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password',
    };
    const promise = sut.add(accountData);

    await expect(promise).rejects.toThrow();
  });
});
