import React, { useContext, useEffect, useState } from "react";
import { AlertContext } from "../context/alert/alertContext";
import { useHttp } from "../hooks/useHttp";
import { useHistory} from 'react-router-dom';
import { Loader } from "../components/Loader";
import { AuthContext } from "../context/auth/authContext";



export const AddDocument = ()=>{
    const {userId} = useContext(AuthContext);
    const history = useHistory();  
    const {loading, error, request, clearError} = useHttp();    
    const [form, setForm] = useState({
        Name:'', Series:'', Number:'', DateOfIssue:'', IssuingAuthority:''        
    });
    const alert = useContext(AlertContext);
    useEffect(()=>{
        alert.show(error, 'danger');
        // eslint-disable-next-line
    }, [error, clearError, alert.show]);    
    
     

    const submitHandler = async (e)=>{
        e.preventDefault();         
        try{
            //console.log(form);            
            
            const res = await request('/api/applicant/document/add', 'POST', {appId:userId, doc:{...form}});
            if(!res.ok){
                throw new Error('Ошибка додання документа!');
            }                  
            alert.show(res.message, 'success');
           history.push(`/applicant/${userId}`);                  

        }catch(e){
            alert.show(e.message, 'danger');
        }
    }
    const changeHandler= (event)=>{        
        setForm({ ...form, [event.target.name]: event.target.value })
    }



    return (<div className="container">
        <h1 className="fw-lighter fs-3 text-center m-5">Заповніть анкету:</h1>
        {loading && <Loader/>}
        <form className="g-3 col-4 justify-content-center mx-auto" onSubmit={submitHandler}>    

            <div className="row g-3 justify-content-center ">
                <div className="col">
                    <label htmlFor="Name" className="form-label">Назва</label>
                    <input type="text" className="form-control" id="Name" name='Name'onChange={changeHandler} required/>
                </div>                
            </div>
            

            <div className="row g-3 justify-content-center my-1">
                <div className="col-2">
                    <label htmlFor="Series" className="form-label">Серія</label>
                    <input type="text" className="form-control" id="Series" name='Series'onChange={changeHandler}/>
                </div>
                <div className="col">
                    <label htmlFor="Number" className="form-label">Номер</label>
                    <input type="number" className="form-control" id="Number" name='Number' onChange={changeHandler} required/>
                </div>
                
            </div>

            <div className="row g-3 justify-content-center my-1">
                <div className="col-5">
                    <label htmlFor="DateOfIssue" className="form-label">Дата видачі</label>
                    <input type="date" className="form-control" id="DateOfIssue" name='DateOfIssue' onChange={changeHandler} required/>
                </div>
                <div className="col">
                    <label htmlFor="IssuingAuthority" className="form-label">Орган видачі</label>
                    <input type="text" className="form-control" id="IssuingAuthority" name='IssuingAuthority' onChange={changeHandler} required/>
                </div>
                
            </div>

            <div className='row my-5'>
                <button type="submit" className="btn btn-primary mb-5 mx-auto" disabled={loading} style={{"width": 'fit-content'}} >Підтвердити</button>

            </div>
                    
            
        </form>
    </div>)
}