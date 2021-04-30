import {createContext} from 'react'

function noop() {}

export const TimeContext = createContext({
  timeIsGone:false, setTime:noop
});