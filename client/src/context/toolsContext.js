import {createContext} from 'react'

function noop() {}

export const ToolsContext = createContext({
  timeIsGone:false, setTime:noop,
  maxNumberOfApplications:5, changeMaxNum:noop
});