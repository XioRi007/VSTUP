import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { Loader } from "../components/Loader";
import { AlertContext } from "../context/alert/alertContext";
import { useHttp } from "../hooks/useHttp";
import { useLoad } from "../hooks/useLoad";

export const SpecialtiesByFacultyPage = ()=>{
    const faculty = useParams().faculty;
    const alert = useContext(AlertContext); 
    const [specialties, setSpecialties] = useState([]);
    const {loading, error, clearError} = useHttp();  
    const {loadSpecialties} = useLoad();

    useEffect(()=>{
        let cleanupFunction = false;
        loadSpecialties(faculty, cleanupFunction, setSpecialties);
        return () => cleanupFunction = true;       
    
        }, [loadSpecialties, setSpecialties, faculty]);

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
    <div className='container'  style={{minHeight:'650px'}}>
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