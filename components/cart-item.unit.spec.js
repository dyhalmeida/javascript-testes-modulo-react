import { fireEvent, render, screen } from '@testing-library/react'
import  CartItem from './cart-item'

const product = {
  description: 'any_product',
  price: 'any_price',
  image: 'https://images.unsplash.com/photo-1495856458515-0637185db551?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80',
}

const renderCartItem = () => render(<CartItem product={product} />)

describe('<CartItem />', () => {
  
  it('Deve renderizar <CartItem />', () => {
    renderCartItem()

    expect(screen.getByTestId('cart-item')).toBeInTheDocument()
  });

  it('Deve mostrar na tela os conteúdos das props', () => {
    renderCartItem()

    const image = screen.getByRole('img')

    expect(screen.getByText(new RegExp(product.description), 'i')).toBeInTheDocument()
    expect(screen.getByText(new RegExp(product.price), 'i')).toBeInTheDocument()
    expect(image).toHaveProperty('src', product.image)
    expect(image).toHaveProperty('alt', product.description)
  });

  it('Deve mostrar na tela a quantidade 1 como valor inicial', () => {
    renderCartItem()

    expect(screen.getByTestId('cart-item-quantity').textContent).toBe('1')

  });

  it('Deve incrementar 1 na quantidade quando o botão de incremento for clicado', async () => {
    renderCartItem()

    const [_, button] = screen.getAllByRole('button')

    await fireEvent.click(button)

    expect(screen.getByTestId('cart-item-quantity').textContent).toBe('2')

  });

  it('Deve decrementar 1 na quantidade quando o botão de decremento for clicado', async () => {
    renderCartItem()

    const [decrementButton, incrementButton] = screen.getAllByRole('button')

    await fireEvent.click(incrementButton)
    await fireEvent.click(decrementButton)
    

    expect(screen.getByTestId('cart-item-quantity').textContent).toBe('1')

  });

  it('O valor da quantidade nunca pode ser menor que 0', async () => {
    renderCartItem()

    const [decrementButton] = screen.getAllByRole('button')

    expect(screen.getByTestId('cart-item-quantity').textContent).toBe('1')

    await fireEvent.click(decrementButton)
    await fireEvent.click(decrementButton)    

    expect(screen.getByTestId('cart-item-quantity').textContent).toBe('0')

  });

});