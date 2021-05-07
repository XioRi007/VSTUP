import {createContext} from 'react'

function noop() {}

export const AuthContext = createContext({
  isAdmin:false, isApplicant:false, adminLogin:noop, adminLogout:noop, logout:noop, login:noop, userId:null, ready:false
});