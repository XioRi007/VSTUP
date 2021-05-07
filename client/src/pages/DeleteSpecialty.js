import React, { useContext, useEffect, useState } from "react";
import { AlertContext } from "../context/alert/alertContext";
import { useHttp } from "../hooks/useHttp";
import { useHistory} from 'react-router-dom';
import { useLoad } from "../hooks/useLoad";


export const DeleteSpecialty = ()=>{
    const history = useHistory();  
    const [faculties, setFaculties] = useState([]);
    const [specialties, setSpecialties] = useState([]);
    const {loading, error, request, clearError} = useHttp();    
    const {loadFaculties, loadSpecialties} = useLoad(); 
    const [form, setForm] = useState({
        Faculty:'', Specialty:''  
    });

    const alert = useContext(AlertContext);
    useEffect(()=>{
        alert.show(error, 'danger');
        // eslint-disable-next-line
    }, [error, clearError, alert.show]);



    useEffect(()=>{
        let cleanupFunction = false;
        loadSpecialties(form.Faculty, cleanupFunction, setSpecialties);
        return () => cleanupFunction = true;       
    
        }, [loadSpecialties, setSpecialties, form.Faculty]);

    
    useEffect(()=>{
        let cleanupFunction = false;
        loadFaculties(cleanupFunction, setFaculties, faculties.length);
        return () => cleanupFunction = true;       
    
        }, [loadFaculties, setFaculties, faculties.length]);
 
    
        
    const submitHandler = async (e)=>{
        try{
            e.preventDefault();  
            const res = await request(`/api/specialty/delete`, 'DELETE', {Specialty:form.Specialty});            
            if(!res.ok){
                throw new Error(res.message || 'Помилка створення заяви!');            
            } 
            alert.show(res.message, 'success');
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
            {( faculties !== undefined) && <div className='row '>
                <label htmlFor="Faculty">Факультет</label>
                <select className="col-5 form-select mb-3" id='Faculty' name='Faculty' required value={form.Faculty} onChange={changeHandler}>               
               
                    <option value="" selected disabled hidden>Вибрати </option>
                    {faculties.map((i, idx) => {return (<option key={idx} value={i} >{i}</option>)})}                   
                </select>
            </div>}

            {(specialties !== undefined) && <div className='row'>
                <label htmlFor="Specialty ">Оберіть спеціальність</label>
                <select className="col-5 form-select mb-3" id='Specialty' name='Specialty' required onChange={changeHandler} value={form.Specialty}>
                    <option value="" selected disabled hidden>Вибрати </option>
                    {specialties.map((i, idx) => {return (<option key={idx} value={i.id} >{i.Name}</option>)})}                   
                </select>
            </div>}
                        
                     
            <div className='row'>
                <button type="submit" className="btn btn-primary mb-5 mx-auto" disabled={loading} style={{"width": 'fit-content'}} >Видалити</button>
            </div>


               
            
        </form>
    </div>)
}
//{{name: e.name, score:e.score}}