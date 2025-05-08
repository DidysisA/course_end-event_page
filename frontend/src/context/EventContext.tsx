import { createContext, useReducer, useContext } from 'react'
import type { ReactNode } from 'react'
import api from '../api/api'

export interface EventType {
  _id: string
  title: string
  description: string
  date: string
}

interface State {
  events: EventType[]
  loading: boolean
}
type Action =
  | { type: 'SET_EVENTS'; payload: EventType[] }
  | { type: 'ADD_EVENT';  payload: EventType }

function eventsReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_EVENTS':
      return { ...state, events: action.payload, loading: false }
    case 'ADD_EVENT':
      return { ...state, events: [...state.events, action.payload] }
    default:
      return state
  }
}

interface ContextProps extends State {
  fetchEvents: () => Promise<void>
  addEvent:    (data: Omit<EventType, '_id'>) => Promise<void>
}

const EventContext = createContext<ContextProps | undefined>(undefined)

export const EventProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(eventsReducer, {
    events: [],
    loading: true,
  })

  const fetchEvents = async () => {
    const res = await api.get<EventType[]>('/events')
    dispatch({ type: 'SET_EVENTS', payload: res.data })
  }

  const addEvent = async (data: Omit<EventType, '_id'>) => {
    const res = await api.post<EventType>('/events', data)
    dispatch({ type: 'ADD_EVENT', payload: res.data })
  }

  return (
    <EventContext.Provider value={{ ...state, fetchEvents, addEvent }}>
      {children}
    </EventContext.Provider>
  )
}

export const useEvents = () => {
  const ctx = useContext(EventContext)
  if (!ctx) throw new Error('useEvents must be inside EventProvider')
  return ctx
}
