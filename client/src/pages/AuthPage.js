import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AlertContext } from "../context/alert/alertContext";
import { AuthContext } from "../context/auth/authContext";
import { useHttp } from "../hooks/useHttp";
import {useHistory} from 'react-router-dom';

export const AuthPage = ()=>{
    const history = useHistory();
    const {adminLogin, login, } = useContext(AuthContext);
    const [form, setForm] = useState({
        Email:'', Password: ''
    });
    const {loading, error, request, clearError} = useHttp();    
    const alert = useContext(AlertContext);
    useEffect(()=>{
        alert.show(error, 'danger');
        // eslint-disable-next-line
    }, [error, clearError, alert.show]);

    

    const submitHandler = async (e)=>{
        e.preventDefault();
        try{
            const data = await request('/api/auth/login', 'POST', {...form});
            alert.show('Ви ввійшли в систему', 'success');
            if(data.userId === 'admin'){
                adminLogin();
                history.push('/admin');
            }else{
                login(data.userId);
                history.push(`/applicant/${data.userId}`);
            }
            

        }catch(e){
            alert.show(e.message, 'danger');
        }
        
    }
    const changeHandler= (event)=>{
        setForm({ ...form, [event.target.name]: event.target.value })
    }
   
    return (
        <div className="container p-5" style={{minHeight:'650px'}}>        
            <h1 className="fs-3 text-center m-5">Увійдіть до свого аккаунту: </h1>
            <div className="row justify-content-center" >    
                <form className="col-3 " onSubmit={submitHandler}>
                <div className="form-floating mb-3">
                    <input type="email" className="form-control" id="Email" name='Email' placeholder="name@example.com" value={form.Email} onChange={changeHandler} required/>
                    <label htmlFor="Email">Email address</label>                    
                </div>
                <div className="form-floating">
                    <input type="password" className="form-control" id="Password" name='Password' placeholder="Password" value={form.Password}onChange={changeHandler} required autoComplete="on"/>
                    <label htmlFor="Password">Password</label>
                </div>
                <div className="form-text px-2 pt-2 text-end">Новенький? &nbsp;
                    <Link to="/applicant/new">Тобі сюди
                    </Link>
                </div>
                <button type="submit" className="btn btn-primary" disabled={loading} style={{"width": 'fit-content'}}>Увійти</button>                        
                </form>    
            </div>            
        </div>)
}