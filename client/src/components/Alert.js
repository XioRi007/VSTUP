import React, {useContext} from "react";
import { AlertContext } from "../context/alert/alertContext";



export const Alert = ()=>{

    const {alert, hide} = useContext(AlertContext);
    
    if(!alert.visible || !alert.text)
        return null;


    return (
        
        <div className="row justify-content-end position-absolute" style={{"width": '100%'}}>
            <div className={`alert alert-${alert.type || 'warning'} col-3 m-4 alert-dismissible`} >
                {alert.text}
                <button onClick = {hide}type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>

        </div>
        
        )
}