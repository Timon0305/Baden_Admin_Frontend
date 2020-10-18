import {combineActions, createAction, handleAction} from 'redux-actions'
import Actions from '../action/'

const callApi = createAction(
  Actions.CALL_API,
  (method, callback, ...args) => ({method, callback, args})
)

const reducer = handleAction(combineActions(callApi), undefined, {})

export default {
  callApi,
  reducer
}
