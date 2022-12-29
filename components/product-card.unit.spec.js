import { fireEvent, render, screen } from '@testing-library/react'
import  ProductCard from './product-card'

const addToCart = jest.fn()

const product = {
  description: 'any_product',
  price: 'any_price',
  image: 'https://images.unsplash.com/photo-1495856458515-0637185db551?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80',
}

const renderProductCard = () => render(<ProductCard product={product} addToCart={addToCart} />)

describe('<ProductCard />', () => {
  
  it('Deve renderizar <ProductCard />', () => {
    renderProductCard()

    expect(screen.getByTestId('product-card')).toBeInTheDocument()
  });

  it('Deve mostrar na tela os conteúdos das props', () => {
    renderProductCard()

    expect(screen.getByText(new RegExp(product.description), 'i')).toBeInTheDocument()
    expect(screen.getByText(new RegExp(product.price), 'i')).toBeInTheDocument()
    expect(screen.getByTestId('product-image')).toHaveStyle({
      backgroundImage: product.image
    })
  });

  it('Deve chamar props.addToCart() quando o botão for clicado', async () => {
    renderProductCard()
    
    const button = screen.getByRole('button')

    await fireEvent.click(button)

    expect(addToCart).toHaveBeenCalledTimes(1)
    expect(addToCart).toHaveBeenCalledWith(product)

  });

});