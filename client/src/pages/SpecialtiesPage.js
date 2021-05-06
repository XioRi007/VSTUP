import React, { useEffect, useState, useContext, useCallback } from "react";
import { Link, useHistory } from "react-router-dom";
import { Loader } from "../components/Loader";
import { AlertContext } from "../context/alert/alertContext";
import { useHttp } from "../hooks/useHttp";

export const SpecialtiesPage = ()=>{
    const history= useHistory();
    const alert = useContext(AlertContext); 
    const [specialties, setSpecialties] = useState([]);
    const {loading, error, request, clearError} = useHttp();  

    const loadSpecialties = useCallback( async (cleanupFunction)=>{        
        try{
            if(specialties.length) return;
            const {Specialties} =await request(`/api/specialty/get/all`);          
            if (!Specialties)
                throw new Error('Ошибка загрузки специальностей');                      
            if(!cleanupFunction) setSpecialties(Specialties);         
        }catch(e){
            alert.show(e.message, 'danger');
            history.push('/'); 
        }
                
    }, [request, alert, history, specialties.length]); 

    useEffect(()=>{
        let cleanupFunction = false;
        loadSpecialties(cleanupFunction, setSpecialties);
        return () => cleanupFunction = true;       
    
        }, [loadSpecialties]);

    useEffect(()=>{
        alert.show(error, 'danger');
        // eslint-disable-next-line
    }, [error, clearError, alert.show]);

    if(loading) {return <Loader/>;}

    const list = specialties.map((e, i)=>{
            return (
            <tr className='row  my-0 text-center py-auto' key={i}>
                <td className='col-1 '>{i+1}</td>
                <td className='col-1 '>{e.SpecialtyCode}</td>
                <td className='col  '>{e.Name}</td>
                <td className='col-2 '>{e.NumberOfApplications}</td>
                <td className='col-1   '><Link className='link-primary text-decoration-none' to={`/specialty/${e._id}`} >Перейти</Link></td>
            </tr>
            )
        });

    return (
    <div className='container' style={{minHeight:'650px'}}>
        <h1 className='text-center my-5'>Оберіть спеціальність</h1>  
        <table className='table table-bordered border-dark px-5 py-2'>
            <thead className=''>
                <tr className='row  my-0 text-center'>
                    <th className='col-1' >№</th>
                    <th className='col-1 ' >Код</th>
                    <th className='col'>Назва спеціальності</th>
                    <th className='col-2 '>Кількість заяв</th>
                    <th className='col-1 '>&nbsp;</th>
                </tr>
            </thead>
            <tbody>
                {list}
            </tbody>
              
        </table>
    </div>)

}