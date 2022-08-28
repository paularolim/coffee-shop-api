import bcrypt from 'bcrypt';
import { BcryptAdapter } from './bcrypt-adapter';

jest.mock('bcrypt', () => ({
  async hash(): Promise<string> {
    return new Promise((resolve) => resolve('any_value'));
  },

  async compare(): Promise<boolean> {
    return new Promise((resolve) => resolve(true));
  },
}));

const salt = 12;
const makeSut = (): BcryptAdapter => new BcryptAdapter(salt);

describe('Bcrypt Adapter', () => {
  it('should call hash with correct values', async () => {
    const sut = makeSut();
    const hashSpy = jest.spyOn(bcrypt, 'hash');
    await sut.hash('any_value');

    expect(hashSpy).toHaveBeenCalledWith('any_value', salt);
  });

  it('should return a valid hash on hash success', async () => {
    const sut = makeSut();
    const hash = await sut.hash('any_value');

    expect(hash).toBe('any_value');
  });

  it('should throw if bcrypt hash throws', async () => {
    const sut = makeSut();
    const hashSpy = jest.spyOn(bcrypt, 'hash') as any;
    hashSpy.mockReturnValueOnce(new Promise((_, reject) => reject(new Error())));
    const hash = sut.hash('any_value');

    expect(hash).rejects.toThrow(new Error());
  });

  it('should call compare with correct values', async () => {
    const sut = makeSut();
    const compareSpy = jest.spyOn(bcrypt, 'compare');
    await sut.compare('any_value', 'any_hash');

    expect(compareSpy).toHaveBeenCalledWith('any_value', 'any_hash');
  });

  it('should return true when compare succeeds', async () => {
    const sut = makeSut();
    const isValid = await sut.compare('any_value', 'any_hash');

    expect(isValid).toBe(true);
  });

  it('should return false when compare fails', async () => {
    const sut = makeSut();
    jest
      .spyOn(bcrypt, 'compare')
      .mockReturnValueOnce(new Promise((resolve) => resolve(false)) as any);
    const isValid = await sut.compare('any_value', 'any_hash');

    expect(isValid).toBe(false);
  });

  it('should throw if bcrypt compare throws', async () => {
    const sut = makeSut();
    const compareSpy = jest.spyOn(bcrypt, 'compare') as any;
    compareSpy.mockReturnValueOnce(new Promise((_, reject) => reject(new Error())));
    const isValid = sut.compare('any_value', 'any_hash');

    expect(isValid).rejects.toThrow();
  });
});
