import { combineReducers } from 'redux'

import users from './user';

const appReducer = combineReducers({
  users,
})

export default appReducer