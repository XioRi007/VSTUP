import React, { useContext, useState } from "react";
import { AlertContext } from "../context/alert/alertContext";
import { useHistory} from 'react-router-dom';
import { ToolsContext } from "../context/toolsContext";


export const UpdateMaxNum = ()=>{
    const history = useHistory();  
    const { changeMaxNum} = useContext(ToolsContext);  
   
    const [form, setForm] = useState({
        maxnum:0  
    });

    const alert = useContext(AlertContext);

    const submitHandler = async (e)=>{
        try{
            e.preventDefault();  
            changeMaxNum(form.maxnum);            
            history.push(`/admin`);
        }catch(e){
            alert.show(e.message, 'danger');
        }
    }
    const changeHandler= (event)=>{        
        setForm({ ...form, [event.target.name]: event.target.value })        
    }


    return (<div className="container" style={{minHeight:'650px'}}>
        <h1 className="fw-lighter fs-3 text-center m-5">Заповніть анкету:</h1>        
        <form className="g-3 col-4 justify-content-center mx-auto" onSubmit={submitHandler}>   
            <div className="col">
                <label htmlFor="maxnum" className="form-label">Максимальна кількість заяв абітурієнта</label>
                <input type="number" className="form-control" id="maxnum" min='1' max='10' name='maxnum'onChange={changeHandler} required/>
            </div>        
            <button type="submit" className="btn btn-primary m-5 " style={{"width": 'fit-content'}} >Підтвердити</button>
            
        </form>
    </div>)
}