import { createStore, combineReducers } from 'redux'
import { reducer as formReducer } from 'redux-form'

const reducers = {
  form: formReducer.plugin({
    newSchedulesRequest: (state, action) => {
      switch (action.type) {
        case 'SCHEDULES_POST_REQUEST_SUCCESS':
          return undefined
        default:
          return state
      }
    },
    newInboundCall: (state, action) => {
      switch (action.type) {
        case 'INBOUND_CALL_POST_SUCCESS':
          return undefined
        default:
          return state
      }
    },
    newAppointment: (state, action) => {
      switch (action.type) {
        case 'APPOINTMENT_INSERT_SUCCESS':
          return undefined
        case 'OPEN_NEW_PATIENT':
          return { ...state,
            values: {
              ...state.values,
              gender: action.autofill.gender,
              firstName: action.autofill.firstName,
              lastName: action.autofill.lastName,
              telephone: null,
              email: null,
              birthday: null
            }
          }
        case 'CLOSE_NEW_PATIENT':
          return { ...state,
            values: {
              ...state.values,
              firstName: null,
              lastName: null,
              telephone: null,
              email: null,
              birthday: null
            }
          }
        case 'NEW_PATIENT_SWAP_NAME_FIELDS':
          return { ...state,
            values: {
              ...state.values,
              firstName: state.values.lastName,
              lastName: state.values.firstName
            }
          }
        default:
          return state
      }
    }
  })
}

const reducer = combineReducers(reducers)
export const store = createStore(reducer, window.devToolsExtension && window.devToolsExtension())
