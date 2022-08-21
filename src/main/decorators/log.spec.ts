import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols';
import { LogControllerDecorator } from './log';

interface SutTypes {
  controllerStub: Controller;
  sut: LogControllerDecorator;
}

const makeController = (): Controller => {
  class ControllerStub implements Controller {
    handle(httpRequest: HttpRequest): Promise<HttpResponse> {
      return new Promise((resolve) => resolve({ statusCode: 200, body: {} }));
    }
  }

  return new ControllerStub();
};

const makeSut = (): SutTypes => {
  const controllerStub = makeController();
  const sut = new LogControllerDecorator(controllerStub);
  return { controllerStub, sut };
};

describe('LogControllerDecorator', () => {
  it('should call controller handle', async () => {
    const { controllerStub, sut } = makeSut();
    const handleSpy = jest.spyOn(controllerStub, 'handle');

    const httpRequest = { body: { name: 'any_name' } };
    await sut.handle(httpRequest);
    expect(handleSpy).toHaveBeenCalledWith(httpRequest);
  });

  it('should return the same result of the controller', async () => {
    const { sut } = makeSut();

    const httpRequest = { body: { name: 'any_name' } };
    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual({ statusCode: 200, body: {} });
  });
});
