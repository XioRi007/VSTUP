import React, {useCallback, useReducer} from 'react';
import {AlertContext} from './alertContext';
import {alertReducer} from './alertReducer';

export const AlertState = ({children}) => {
  const [state, dispatch] = useReducer(alertReducer, {visible: false});

  const hide = useCallback(() => dispatch({type: "HIDE_ALERT"}), [dispatch]);

  const show = useCallback((text, type = 'warning') => {

    dispatch({
      type: "SHOW_ALERT",
      payload: {text, type}
    });
    setTimeout(hide, 4000);     

  }, [dispatch, hide]);

  

  return (
    <AlertContext.Provider value={{
      show, hide,
      alert: state
    }}>
      {children}
    </AlertContext.Provider>
  )
}