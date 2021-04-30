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
    const response = await request('/api/applicant/document/delete', 'POST', {appId:userId, Name: event.target.value});        
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
                    <div className='px-5 py-2'>
                        <div className='row  my-0 text-center'>
                            <h6 className='col-1 border border-dark mb-0 py-2 align-middle ' >№</h6>
                            <h6 className='col-1 border border-dark mb-0 py-2'>Назва</h6>
                            <h6 className='col border border-dark mb-0 py-2'>Серія та номер</h6>
                            <h6 className='col-2 border border-dark mb-0 py-2'>Дата видачі</h6>
                            <h6 className='col-2 border border-dark mb-0 py-2'>Орган видачі</h6>
                            <h6 className='col-1 border border-dark mb-0'>&nbsp;</h6>
                        </div>
                        {Documents.map((e,i)=>{
                            return                 (
                                <div className='row  my-0 text-center py-auto' key={i}>
                                    <p className='col-1 border border-dark mb-0 py-3 '>{i+1}</p>
                                    <p className='col-1  border border-dark mb-0 py-3' >{e.Name}</p>
                                    <p className='col border border-dark mb-0 py-3'> {e.Series && e.Series} {e.Number}</p>
                                    <p className='col-2 border border-dark mb-0 py-3'>{e.DateOfIssue}</p>
                                    <p className='col-2 border border-dark mb-0 py-3'>{e.IssuingAuthority}</p>
                                    <button to ='/' className='col-1 btn btn-outline-danger border border-dark mb-0 py-3 'value={e.Name} onClick={deleteHandler}>Видалити</button>
                                </div>
                                )
                        })}       
                    </div>
            ))}     
            <div className='row justify-content-end my-3 px-4'>
                <button className='col-1 btn btn-outline-primary btn-sm' disabled={loading} onClick={()=>{history.push('/applicant/documents/add')}}>Додати</button>

            </div>

        </div>
    )
}