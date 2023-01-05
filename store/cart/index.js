import create from 'zustand'
import produce from 'immer'

const initialState = {
  open: false,
  products: [],
}

export const useCartStore = create((set) => {
  const setState = (fn) => set(produce(fn))

  return {
    state: {
      ...initialState,
    },
    actions: {
      toggle() {
        setState(({ state }) => {
          state.open = !state.open
        })
      },
      reset() {
        setState((store) => {
          store.state = initialState
        })
      },
      add(product) {
        setState(({ state }) => {
          const exists = !!state.products.find(({ id }) => id === product.id)
          if (!exists) {
            if (!product.quantity) {
              product.quantity = 1
            }
            state.open = true
            state.products.push(product)
          }
        })
      },
      remove(product) {
        setState(({ state }) => {
          const exists = !!state.products.find(({ id }) => id === product.id)

          if (exists) {
            state.products = state.products.filter(({ id }) => {
              return id !== product.id
            })
          }
        })
      },
      removeAll() {
        setState(({ state }) => {
          state.products = []
        })
      },
      increment(product) {
        setState(({ state }) => {
          const foundProduct = state.products.find(
            ({ id }) => id === product.id,
          )
          if (foundProduct) {
            foundProduct.quantity += 1
          }
        })
      },
      decrement(product) {
        setState(({ state }) => {
          const foundProduct = state.products.find(
            ({ id }) => id === product.id,
          )
          if (foundProduct && foundProduct.quantity > 0) {
            foundProduct.quantity -= 1
          }
        })
      },
    },
  }
})
