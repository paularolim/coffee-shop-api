import jwt from 'jsonwebtoken';
import { JwtAdapter } from './jwt-adapter';

jest.mock('jsonwebtoken', () => ({
  sign: (): Promise<string> => new Promise((resolve) => resolve('any_token')),
}));

const makeSut = (): JwtAdapter => new JwtAdapter('secret');

describe('Jwt Adapter', () => {
  it('should call sign with correct values', async () => {
    const sut = makeSut();
    const signSpy = jest.spyOn(jwt, 'sign');
    await sut.encrypt({ id: 'any_id' });
    expect(signSpy).toHaveBeenCalledWith({ id: 'any_id' }, 'secret');
  });

  it('should return a token on sign success', async () => {
    const sut = makeSut();
    const token = await sut.encrypt({ id: 'any_id' });
    expect(token).toBe('any_token');
  });

  it('should throw if sign throws', async () => {
    const sut = makeSut();
    jest.spyOn(jwt, 'sign').mockImplementationOnce(() => {
      throw new Error();
    });
    const promise = sut.encrypt({ id: 'any_id' });
    await expect(promise).rejects.toThrow();
  });
});
