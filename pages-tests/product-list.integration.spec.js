import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event';
import ProductList from '../pages'
import { makeServer } from '../miragejs/server'
import Response from 'miragejs';

const renderProductList = () => render(<ProductList />)

describe('<ProductList />', () => {

  let server;

  beforeEach(() => {
    server = makeServer({ environment: 'test' })
  })

  afterEach(() => {
    server.shutdown()
  })
  
  it('Deve renderizar <ProductList />', () => {
    renderProductList()
    expect(screen.getByTestId('product-list')).toBeInTheDocument()
  });

  it('Deve renderizar <ProductCard /> 10 vezes', async () => {

    server.createList('product', 10)

    renderProductList()
    await waitFor(() => {
      expect(screen.getAllByTestId('product-card')).toHaveLength(10)
    })
  });

  it('Deve renderizar a mensagem "no products"', async () => {
    renderProductList();

    await waitFor(() => {
      expect(screen.getByTestId('no-products')).toBeInTheDocument();
    });
  });

  it('Deve exibir uma mensagem de error quando a promise for rejeitada', async () => {
    server.get('products', () => {
      return new Response(500, {}, '');
    });

    renderProductList();

    await waitFor(() => {
      expect(screen.getByTestId('server-error')).toBeInTheDocument();
      expect(screen.queryByTestId('no-products')).toBeNull();
      expect(screen.queryAllByTestId('product-card')).toHaveLength(0);
    });
  });

  it('Deve filtar a lista de produtos quando a busca for acionada', async () => {
    const searchTerm = 'any_product';

    server.createList('product', 2);

    server.create('product', {
      description: searchTerm,
    });

    renderProductList();

    await waitFor(() => {
      expect(screen.getAllByTestId('product-card')).toHaveLength(3);
    });

    const form = screen.getByRole('form');
    const input = screen.getByRole('searchbox');

    await userEvent.type(input, searchTerm);
    await fireEvent.submit(form);

    await waitFor(() => {
      expect(screen.getAllByTestId('product-card')).toHaveLength(1);
    });
  });

  it('Deve exibir a quantidade total de produtos', async () => {
    server.createList('product', 10);

    renderProductList();

    await waitFor(() => {
      expect(screen.getByText(/10 Products/i)).toBeInTheDocument();
    });
  });

  it('Deve exibir produto (singular) quando houver apenas 1 produto', async () => {
    server.create('product');

    renderProductList();

    await waitFor(() => {
      expect(screen.getByText(/1 Product$/i)).toBeInTheDocument();
    });
  });

  it('Deve exibir a quantidade quando a lista de produtos for filtrada', async () => {
    const searchTerm = 'any_product';

    server.createList('product', 2);

    server.create('product', {
      description: searchTerm,
    });

    renderProductList();

    await waitFor(() => {
      expect(screen.getByText(/3 Products/i)).toBeInTheDocument();
    });

    const form = screen.getByRole('form');
    const input = screen.getByRole('searchbox');

    await userEvent.type(input, searchTerm);
    await fireEvent.submit(form);

    await waitFor(() => {
      expect(screen.getByText(/1 Product$/i)).toBeInTheDocument();
    });
  });

});