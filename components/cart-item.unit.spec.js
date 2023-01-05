import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderHook } from '@testing-library/react-hooks'
import  CartItem from './cart-item'
import { useCartStore } from '../store/cart'
import { setAutoFreeze } from 'immer'

setAutoFreeze(false)

const product = {
  description: 'any_product',
  price: 'any_price',
  image: 'https://images.unsplash.com/photo-1495856458515-0637185db551?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80',
}

const renderCartItem = () => render(<CartItem product={product} />)

describe('<CartItem />', () => {

  let result

  beforeEach(() => {
    result = renderHook(() => useCartStore()).result
  })
  
  it('Deve renderizar <CartItem />', () => {
    renderCartItem()

    expect(screen.getByTestId('cart-item')).toBeInTheDocument()
  })

  it('Deve mostrar na tela os conteúdos das props', () => {
    renderCartItem()

    const image = screen.getByRole('img')

    expect(screen.getByText(new RegExp(product.description), 'i')).toBeInTheDocument()
    expect(screen.getByText(new RegExp(product.price), 'i')).toBeInTheDocument()
    expect(image).toHaveProperty('src', product.image)
    expect(image).toHaveProperty('alt', product.description)
  })

  // it.skip('Deve mostrar na tela a quantidade 1 como valor inicial', () => {
  //   renderCartItem()

  //   expect(screen.getByTestId('cart-item-quantity').textContent).toBe('1')

  // })

  // it.skip('Deve incrementar 1 na quantidade quando o botão de incremento for clicado', async () => {
  //   renderCartItem()

  //   const incrementButton = screen.getByTestId('btn-increment')

  //   await fireEvent.click(incrementButton)

  //   expect(screen.getByTestId('cart-item-quantity').textContent).toBe('2')

  // })

  // it.skip('Deve decrementar 1 na quantidade quando o botão de decremento for clicado', async () => {
  //   renderCartItem()

  //   const incrementButton = screen.getByTestId('btn-increment')
  //   const decrementButton = screen.getByTestId('btn-decrement')


  //   await fireEvent.click(incrementButton)
  //   await fireEvent.click(decrementButton)
    

  //   expect(screen.getByTestId('cart-item-quantity').textContent).toBe('1')

  // })

  // it.skip('O valor da quantidade nunca pode ser menor que 0', async () => {
  //   renderCartItem()

  //   const decrementButton = screen.getByTestId('btn-decrement')

  //   expect(screen.getByTestId('cart-item-quantity').textContent).toBe('1')

  //   await fireEvent.click(decrementButton)
  //   await fireEvent.click(decrementButton)    

  //   expect(screen.getByTestId('cart-item-quantity').textContent).toBe('0')

  // })

  it('Deve chamar remove() quando o botão de remover for clicado', async () => {
    const spy = jest.spyOn(result.current.actions, 'remove')

    renderCartItem()

    const button = screen.getByRole('button', { name: /remove/i })

    await userEvent.click(button)

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(product)
  })

  it('Deve chamar increment() quando o botão de incrementar for clicado', async () => {
    const spy = jest.spyOn(result.current.actions, 'increment');

    renderCartItem();

    const button = screen.getByTestId('btn-increment');

    await userEvent.click(button);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(product);
  });

  it('Deve chamar decrement() quando o botão de decrementar for clicado', async () => {
    const spy = jest.spyOn(result.current.actions, 'decrement');

    renderCartItem();

    const button = screen.getByTestId('btn-decrement');

    await userEvent.click(button);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(product);
  });


})