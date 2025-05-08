import { createContext, useReducer, useContext } from 'react'
import type { ReactNode } from 'react'

interface FilterState {
  search: string
}
type FilterAction = { type: 'SET_SEARCH'; payload: string }

function filterReducer(state: FilterState, action: FilterAction): FilterState {
  switch (action.type) {
    case 'SET_SEARCH':
      return { ...state, search: action.payload }
    default:
      return state
  }
}

interface FilterContextProps extends FilterState {
  setSearch: (s: string) => void
}

const FilterContext = createContext<FilterContextProps | undefined>(undefined)

export const FilterProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(filterReducer, { search: '' })

  const setSearch = (s: string) => dispatch({ type: 'SET_SEARCH', payload: s })

  return (
    <FilterContext.Provider value={{ ...state, setSearch }}>
      {children}
    </FilterContext.Provider>
  )
}

export const useFilter = () => {
  const ctx = useContext(FilterContext)
  if (!ctx) throw new Error('useFilter must be inside FilterProvider')
  return ctx
}
