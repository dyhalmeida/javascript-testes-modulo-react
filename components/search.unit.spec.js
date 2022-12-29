import Search from './search';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const doSearch = jest.fn()

const renderSearch = () => {
  render(<Search doSearch={doSearch} />)
}

describe('Search', () => {

  beforeEach(() => {
    renderSearch()
  })

  it('Deve renderizar um form', () => {
    expect(screen.getByRole('form')).toBeInTheDocument()
  });

  it('Deve renderizar um input do tipo "search"', () => {
    expect(screen.getByRole('searchbox')).toHaveProperty('type', 'search')
  });

  it('Deve chamar props.doSearch() quando for feito submit no formulário', async () => {
    const form = screen.getByRole('form')
    await fireEvent.submit(form)
    expect(doSearch).toHaveBeenCalledTimes(1)
  });

  it('Deve chamar props.doSearch() com um input', async () => {
    const form = screen.getByRole('form')

    const inputText = 'any test'
    const input = screen.getByRole('searchbox')

    await userEvent.type(input, inputText)
    await fireEvent.submit(form)

    expect(doSearch).toHaveBeenCalledWith(inputText)
    
  });


});
