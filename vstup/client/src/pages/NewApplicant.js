import React, { useContext, useEffect, useState } from "react";
import { AlertContext } from "../context/alert/alertContext";
import { AuthContext } from "../context/auth/authContext";
import { useHttp } from "../hooks/useHttp";
import {useHistory} from 'react-router-dom';
export const NewApplicant = ()=>{

    const history = useHistory();
    const { login, } = useContext(AuthContext);
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
            const {ApplicantId} = await request('/api/applicant/add', 'POST', {Email: form.Email, LastName: form.LastName, FirstName: form.FirstName, 
                                                                                Patronymic: form.Patronymic, PhoneNumber: form.PhoneNumber});
            console.log('here2',ApplicantId);
            if(!ApplicantId){
                throw new Error('Ошибка создания абитуриента!');
            }            

            const {ok, message} = await request('/api/auth/register', 'POST', {Email: form.Email, Password: form.Password, ApplicantId});

            if(!ok)
                throw new Error(message || 'Помилка регістрації');
            alert.show('Пользователь создан!', 'success');
            login(ApplicantId);
            history.push(`/applicant/${ApplicantId}`);
                  

        }catch(e){
            alert.show(e.message, 'danger');
        }
        
        //alert.show(, 'success');
    }
    const changeHandler= (event)=>{
        setForm({ ...form, [event.target.name]: event.target.value })
    }




    return (<div className="container">
        <h1 className="fw-lighter fs-3 text-center m-5">Заповніть анкету:</h1>
        <form className="row g-3 justify-content-center" onSubmit={submitHandler}>
            <div className="row g-3 justify-content-center">
                <div className="col-4">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input type="email" className="form-control" id="email" name='Email'onChange={changeHandler} required/>
                </div>
                <div className="col-4">
                    <label htmlFor="password" className="form-label" >Пароль</label>
                    <input type="password" className="form-control" id="password" name='Password'onChange={changeHandler} required/>
                </div>
            </div>
            

            <div className="row g-3 justify-content-center">
                <div className="col-4">
                    <label htmlFor="LastName" className="form-label">Прізвище</label>
                    <input type="text" className="form-control" id="LastName" name='LastName'onChange={changeHandler} required/>
                </div>
                <div className="col-4">
                    <label htmlFor="FirstName" className="form-label">Ім'я</label>
                    <input type="text" className="form-control" id="FirstName" name='FirstName' onChange={changeHandler} required/>
                </div>
                
            </div>

            <div className="row g-3 justify-content-center">
                <div className="col-4">
                    <label htmlFor="Patronymic" className="form-label">По-батькові</label>
                    <input type="text" className="form-control" id="Patronymic" name='Patronymic' onChange={changeHandler} required/>
                </div>
                <div className="col-4">
                    <label htmlFor="phoneNumber" className="form-label">Номер телефону</label>
                    <input type="text" className="form-control" id="PhoneNumber" name='PhoneNumber' onChange={changeHandler} required/>
                </div>
                
            </div>
            <button type="submit" className="btn btn-primary m-5" disabled={loading} style={{"width": 'fit-content'}} >Підтвердити</button>

        </form>
    </div>)
}