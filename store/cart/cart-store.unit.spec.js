import { renderHook, act } from '@testing-library/react-hooks'
import { useCartStore } from '.'
import { makeServer } from '../../miragejs/server'

describe('Cart Store', () => {
  
  let server
  let result
  let toggle
  let addToCart
  let remove
  let removeAll
  let increment
  let decrement

  beforeEach(() => {
    server = makeServer({ environment: 'test' })
    result = renderHook(() => useCartStore()).result
    toggle = result.current.actions.toggle
    addToCart = result.current.actions.add
    remove = result.current.actions.remove
    removeAll = result.current.actions.removeAll
    increment = result.current.actions.increment
    decrement = result.current.actions.decrement
  })

  afterEach(() => {
    server.shutdown()
    act(() => result.current.actions.reset())
  })

  it('Deve retornar "open" como falso, no estado inicial', async () => {
    expect(result.current.state.open).toBe(false)
  })

  it('Deve retornar um array vazio para produtos no estado inicial', () => {
    expect(Array.isArray(result.current.state.products)).toBe(true)
    expect(result.current.state.products).toHaveLength(0)
  })

  it('Deve alterar o estado de "open" de false para true e vice versa', async () => {
    expect(result.current.state.open).toBe(false)
    expect(result.current.state.products).toHaveLength(0)

    act(() => toggle())
    expect(result.current.state.open).toBe(true)

    act(() => toggle())
    expect(result.current.state.open).toBe(false)
    expect(result.current.state.products).toHaveLength(0)
  })

  it('Deve adicionar 2 produtos na lista e abrir o carrinho', async () => {
    const products = server.createList('product', 2)

    for (const product of products) {
      act(() => addToCart(product))
    }

    expect(result.current.state.products).toHaveLength(2)
    expect(result.current.state.open).toBe(true)
  })

  it('Deve barrar dois produtos iguais no carrinho', () => {
    const product = server.create('product')

    act(() => addToCart(product))
    act(() => addToCart(product))

    expect(result.current.state.products).toHaveLength(1)
  })

  it('Deve remover um produto', () => {
    const [product1, product2] = server.createList('product', 2)

    act(() => {
      addToCart(product1)
      addToCart(product2)
    })

    expect(result.current.state.products).toHaveLength(2)

    act(() => {
      remove(product1)
    })

    expect(result.current.state.products).toHaveLength(1)
    expect(result.current.state.products[0]).toEqual(product2)
  })

  it('Não deve alterar os produtos no carrinho se o produto fornecido não estiver no array', () => {
    const [product1, product2, product3] = server.createList('product', 3)

    act(() => {
      addToCart(product1)
      addToCart(product2)
    })

    expect(result.current.state.products).toHaveLength(2)

    act(() => {
      remove(product3)
    })

    expect(result.current.state.products).toHaveLength(2)
  })

  it('Deve limpar o carinho', () => {
    const products = server.createList('product', 2)

    act(() => {
      for (const product of products) {
        addToCart(product)
      }
    })

    expect(result.current.state.products).toHaveLength(2)

    act(() => {
      removeAll()
    })

    expect(result.current.state.products).toHaveLength(0)
  })

  it('Deve atribuir 1 como quantidade inicial no produto, quando addToCart for chamado', () => {
    const product = server.create('product')

    act(() => {
      addToCart(product)
    })

    expect(result.current.state.products[0].quantity).toBe(1)
  })

  it('Deve incrementar a quantidade do produto', () => {
    const product = server.create('product')

    act(() => {
      addToCart(product)
      increment(product)
    })

    expect(result.current.state.products[0].quantity).toBe(2)
  })

  it('Deve decrementar a quantidade do produto', () => {
    const product = server.create('product')

    act(() => {
      addToCart(product)
      decrement(product)
    })

    expect(result.current.state.products[0].quantity).toBe(0)
  })

  it('Não deve decrementar a quantidade do produto abaixo de zero', () => {
    const product = server.create('product')

    act(() => {
      addToCart(product)
      decrement(product)
      decrement(product)
    })

    expect(result.current.state.products[0].quantity).toBe(0)
  })


})

