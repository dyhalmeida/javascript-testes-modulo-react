import Response from 'miragejs';
import { renderHook } from '@testing-library/react-hooks';
import { makeServer } from '../miragejs/server';
import { useFetchProducts } from './use-fetch-products';

describe('useFetchProducts', () => {
  let server;

  beforeEach(() => {
    server = makeServer({ environment: 'test' });
  });

  afterEach(() => {
    server.shutdown();
  });

  it('Deve retornar uma lista de 10 produtos', async () => {
    server.createList('product', 10);

    const { result, waitForNextUpdate } = renderHook(() => useFetchProducts());

    await waitForNextUpdate();

    expect(result.current.products).toHaveLength(10);
    expect(result.current.error).toBe(false);
  });

  it('Deve setar error como true quando o bloco catch for executado', async () => {
    server.get('products', () => {
      return new Response(500, {}, '');
    });

    const { result, waitForNextUpdate } = renderHook(() => useFetchProducts());

    await waitForNextUpdate();

    expect(result.current.error).toBe(true);
    expect(result.current.products).toHaveLength(0);
  });
});