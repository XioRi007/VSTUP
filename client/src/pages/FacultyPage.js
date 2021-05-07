import React, { useContext, useState, useCallback, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { AlertContext } from "../context/alert/alertContext";
import { useHttp } from "../hooks/useHttp";



export const FacultyPage = ()=>{
    const history = useHistory();
    const alert = useContext(AlertContext);    
    const { error, request, clearError} = useHttp (); 
    const [faculties, setFaculties] = useState([]);  

    const loadFaculties = useCallback( async (faculties, setFaculties)=>{
        if(faculties.length) return;
        try{
            const {Faculties} = await request('/api/faculties/get');
            if (!Faculties)
                throw new Error('Ошибка загрузки факультетов');                      
            setFaculties(Faculties);  
        }catch(e){
            alert.show(e.message, 'danger');
            history.push('/'); 
        }        
    }, [request, alert, history]);   


    useEffect(()=>{
        loadFaculties(faculties, setFaculties);
    }, [loadFaculties, faculties, setFaculties]);

    useEffect(()=>{
        alert.show(error, 'danger');
        // eslint-disable-next-line
    }, [error, clearError, alert.show]);

    

    const list = faculties.map((e, i)=>{
            return (
            <tr className='row  my-0 text-center py-auto' key={i}>
                <td className='col-1 mb-0 py-3 '>{i+1}</td>
                <td className='col mb-0 py-3'> {e}</td>
                <td className='col-1  mb-0 py-3 '><Link className='link-primary text-decoration-none' to={`/specialties/faculty/${e}`} >Перейти</Link></td>
            </tr>
            )
        });      


        
    return (<div className='container'  style={{minHeight:'650px'}}>
        <h1 className='text-center my-5'>Оберіть факультет</h1>  
        <table className='table table-bordered border-dark px-5 py-2'>
            <thead className=''>
                <tr className='row my-0 text-center'>
                    <th className='col-1 mb-0 py-2 align-middle ' >№</th>
                    <th className='col mb-0 py-2'>Назва факультету</th>
                    <th className='col-1  mb-0'>&nbsp;</th>
                </tr>                
            </thead>
            <tbody>
                {list}
            </tbody>                   
        </table>
    </div>)
}

