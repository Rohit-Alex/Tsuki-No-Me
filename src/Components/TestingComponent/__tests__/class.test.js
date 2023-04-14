import { cleanup } from "@testing-library/react";
import { testFn } from "TestFunctionUtils";
import { EntityService } from "Utilies/utils";

jest.mock('Utilies/utils')

describe('Class test cases', () => {
    beforeEach(() => {
        EntityService.mockImplementation(() => ({
            entities: jest.fn(() =>Promise.resolve('Default'))
        }))
    })

    afterEach(() => {
        jest.clearAllMocks()
        cleanup()
    })
   

    it('Should return the value resolved', async () => {
        EntityService.mockImplementationOnce(() => ({
            entities: jest.fn(() =>Promise.resolve('Some text'))
        }))
        const data = await testFn()
        expect(data).toEqual('Some text')
    })

    it('Should return API FAILED', async () => {
        EntityService.mockImplementationOnce(() => ({
            entities: jest.fn(() =>Promise.resolve(null))
        }))
        const data = await testFn()
        expect(data).toEqual('API FAILED')
    })

    it('Should return FAILED', async () => {
        EntityService.mockReturnValue({
            entities: () => Promise.resolve('FAILED')
        })
        const data = await testFn()
        expect(data).toEqual('FAILED')
    })

    it('Should return default value when not mocked', async () => {
        const data = await testFn()
        expect(data).toEqual('Default')
    })
})


describe('Class test cases using spyon', () => {
  it('should return data if successful', async () => {
    // Mock the EntityService's entities method to return a successful response
    const mockEntities = jest.fn(() => Promise.resolve('mock data'));
    jest.spyOn(EntityService.prototype, 'entities').mockImplementationOnce(mockEntities);

    const result = await testFn();
    expect(result).toEqual('mock data');
  });

  it('should return "FAILED" if data is "FAILED"', async () => {
    // Mock the EntityService's entities method to return "FAILED"
    const mockEntities = jest.fn(() => Promise.resolve('FAILED'));
    jest.spyOn(EntityService.prototype, 'entities').mockImplementationOnce(mockEntities);

    const result = await testFn();
    expect(result).toEqual('FAILED');
  });

  it('should return "API FAILED" if data is falsy', async () => {
    // Mock the EntityService's entities method to return null
    const mockEntities = jest.fn(() => Promise.resolve(null));
    jest.spyOn(EntityService.prototype, 'entities').mockImplementationOnce(mockEntities);

    const result = await testFn();
    expect(result).toEqual('API FAILED');
  });
});

