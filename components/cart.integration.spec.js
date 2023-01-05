import { renderHook, act as hooksAct } from '@testing-library/react-hooks'
import { screen, render } from '@testing-library/react'
import { useCartStore } from '../store/cart'
import { makeServer } from '../miragejs/server'
import userEvent from '@testing-library/user-event'
import TestRenderer from 'react-test-renderer'
import { setAutoFreeze } from 'immer'
import Cart from './cart'

setAutoFreeze(false)
const { act: componentsAct } = TestRenderer


describe('Cart', () => {

  let server
  let result
  let spy
  let addToCart
  let toggle
  let reset

  beforeEach(() => {
    server = makeServer({ environment: 'test' })
    result = renderHook(() => useCartStore()).result
    addToCart = result.current.actions.add
    reset = result.current.actions.reset
    toggle = result.current.actions.toggle
    spy = jest.spyOn(result.current.actions, 'toggle')
  })

  afterEach(() => {
    server.shutdown()
    jest.clearAllMocks()
  })

  it('Deve conter a classe css "hidden" no componente', () => {
    render(<Cart />)
    expect(screen.getByTestId('cart')).toHaveClass('hidden')
  })

  it('Deve remover a classe css "hidden" do componente', async () => {
    await componentsAct(async () => {
      render(<Cart />)

      const button = screen.getByTestId('close-button')
      await userEvent.click(button)

      expect(screen.getByTestId('cart')).not.toHaveClass('hidden')
    })
  })

  it('Deve chamer toggle() duas vezes', async () => {
    await componentsAct(async () => {
      render(<Cart />)
      const button = screen.getByTestId('close-button')
      await userEvent.click(button)
      await userEvent.click(button)
      expect(spy).toHaveBeenCalledTimes(2)
    })

  })

  it('Deve exibir 2 card de produto', () => {
    const products = server.createList('product', 2)

    hooksAct(() => {
      for (const product of products) {
        addToCart(product)
      }
    })

    render(<Cart />)

    expect(screen.getAllByTestId('cart-item')).toHaveLength(2)
  })

  it('Deve remover todos os produtos quando o botão de limpar o carrinho for clicado', async () => {
    const products = server.createList('product', 2)

    hooksAct(() => {
      for (const product of products) {
        addToCart(product)
      }
    })

    await componentsAct(async () => {
      render(<Cart />)

      expect(screen.getAllByTestId('cart-item')).toHaveLength(2)

      const button = screen.getByRole('button', { name: /clear cart/i })

      await userEvent.click(button)

      expect(screen.queryAllByTestId('cart-item')).toHaveLength(0)
    })
  })

  it('Não deve exibir o botão de limpar o carrinho se não tiver produtos adicionados', async () => {
    render(<Cart />)

    expect(
      screen.queryByRole('button', { name: /clear cart/i }),
    ).not.toBeInTheDocument()
  })
  
})