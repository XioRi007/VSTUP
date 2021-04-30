import React, { useContext, useEffect, useState } from "react";
import { AlertContext } from "../context/alert/alertContext";
import { AuthContext } from "../context/auth/authContext";
import { useHttp } from "../hooks/useHttp";
import {useHistory} from 'react-router-dom';


export const ApplicantFormPage = ()=>{
    
    const history = useHistory();
    const { userId } = useContext(AuthContext);
    const [form, setForm] = useState({
        Email:'', Password: '', LastName:'', FirstName:'', Patronymic: '', PhoneNumber: ''
    });
    const {loading, error, request, clearError} = useHttp();    
    const alert = useContext(AlertContext);
    useEffect(()=>{        
        alert.show(error, 'danger');
        // eslint-disable-next-line
    }, [error, clearError, alert.show]);
    

    const submitHandler = async (e)=>{
        console.log('form',form);
        e.preventDefault();
        try{
            const response = await request('/api/applicant/update', 'POST', {appId:userId, doc:{ LastName: form.LastName, FirstName: form.FirstName, 
                                                                                Patronymic: form.Patronymic, PhoneNumber: form.PhoneNumber}});          
            if(!response.ok){
                throw new Error('Ошибка оновлення абитуриента!');
            }            
            alert.show(response.message, 'success');           
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
        <form className="row g-3 justify-content-center" onSubmit={submitHandler}>                        

            <div className="row g-3 justify-content-center">
                <div className="col-4">
                    <label htmlFor="LastName" className="form-label">LastName</label>
                    <input type="text" className="form-control" id="LastName" name='LastName'onChange={changeHandler} required/>
                </div>
                <div className="col-4">
                    <label htmlFor="FirstName" className="form-label">FirstName</label>
                    <input type="text" className="form-control" id="FirstName" name='FirstName' onChange={changeHandler} required/>
                </div>
                
            </div>

            <div className="row g-3 justify-content-center">
                <div className="col-4">
                    <label htmlFor="Patronymic" className="form-label">Patronymic</label>
                    <input type="text" className="form-control" id="Patronymic" name='Patronymic' onChange={changeHandler} required/>
                </div>
                <div className="col-4">
                    <label htmlFor="phoneNumber" className="form-label">PhoneNumber</label>
                    <input type="text" className="form-control" id="PhoneNumber" name='PhoneNumber' onChange={changeHandler} required/>
                </div>
                
            </div>
            <button type="submit" className="btn btn-primary m-5" disabled={loading} style={{"width": 'fit-content'}} >Підтвердити</button>

        </form>
    </div>)
}