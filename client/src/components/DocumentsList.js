import React, { useContext, useEffect } from "react";
import {useHistory} from 'react-router-dom';
import { AlertContext } from "../context/alert/alertContext";
import { AuthContext } from "../context/auth/authContext";
import { useHttp } from "../hooks/useHttp";
import { Loader } from "./Loader";


export const DocumentsList = ({Documents})=>{  
  const history = useHistory();
  const {userId} = useContext(AuthContext);    
  const alert = useContext(AlertContext);    
  const {loading, error, request, clearError} = useHttp (); 


  const deleteHandler = async (event)=>{
    const response = await request('/api/applicant/document/delete', 'DELETE', {appId:userId, Name: event.target.value});        
    alert.show(response.message);
    window.location.reload(); 
}
useEffect(()=>{
    alert.show(error, 'danger');
    // eslint-disable-next-line
}, [error, clearError]);

    return (
        <div className='row mb-3' style={{border: '5px double #b0bec5'}}>
            <h3 className='fs-5 fw-light mt-2'>Документи</h3>         
            {((Documents === undefined || !Documents.length) ? (
                <div className='row'>
                    <h4 className='text-center'>Ви поки що не додали документи</h4>
                </div>) : ( !Documents.length ? <Loader/>:
                    <div className='row px-5 py-1'> <table className='table table-bordered border-dark px-5 py-2 align-middle'>
                        <thead >
                            <tr className='row  my-0 text-center'>
                                <th className='col-1   py-2 align-middle ' >№</th>
                                <th className='col  py-2'>Назва</th>
                                <th className='col-2   py-2'>Серія та номер</th>
                                <th className='col-2  py-2'>Дата видачі</th>
                                <th className='col-2  py-2'>Орган видачі</th>
                                <th className='col-1 '>&nbsp;</th>
                            </tr>
                        </thead>
                        <tbody>
                        {Documents.map((e,i)=>{
                            return                 (
                                <tr className='row  my-0 text-center py-auto' key={i}>
                                    <td className='col-1  py-3 '>{i+1}</td>
                                    <td className='col   py-3' >{e.Name}</td>
                                    <td className='col-2  py-3'> {e.Series && e.Series} {e.Number}</td>
                                    <td className='col-2  py-3'>{e.DateOfIssue}</td>
                                    <td className='col-2  py-3'>{e.IssuingAuthority}</td>
                                    <td className='col-1   py-3'> <button className="btn btn-outline-danger btn-sm" value={e.Name} onClick={deleteHandler}>Видалити</button></td>
                                </tr>
                                )
                        })}</tbody>      
                    </table></div>
            ))}     
            <div className='row justify-content-end my-3'>
                <button className='col-1 btn btn-outline-primary btn-sm mx-4' disabled={loading} onClick={()=>{window.scrollTo(0,0);history.push('/applicant/documents/add')}}>Додати</button>

            </div>

        </div>
    )
}