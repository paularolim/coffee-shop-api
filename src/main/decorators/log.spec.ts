import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols';
import { LogControllerDecorator } from './log';

describe('LogControllerDecorator', () => {
  it('should call controller handle', async () => {
    class ControllerStub implements Controller {
      handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        return new Promise((resolve) => resolve({ statusCode: 200, body: {} }));
      }
    }

    const controllerStub = new ControllerStub();
    const handleSpy = jest.spyOn(controllerStub, 'handle');
    const sut = new LogControllerDecorator(controllerStub);

    const httpRequest = { body: { name: 'any_name' } };
    await sut.handle(httpRequest);
    expect(handleSpy).toHaveBeenCalledWith(httpRequest);
  });
});
