import React, { useCallback, useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { AlertContext } from "../context/alert/alertContext";
import { AuthContext } from "../context/auth/authContext";
import { ToolsContext } from "../context/toolsContext";
import { useHttp } from "../hooks/useHttp";
import { Loader } from "./Loader";

export const ApplicationList = ({Applications, hasScores})=>{  
    const {userId} = useContext(AuthContext);    
    const history = useHistory();
    const {timeIsGone, maxNumberOfApplications} = useContext(ToolsContext);
    const alert = useContext(AlertContext);    
    const {loading, error, request, clearError} = useHttp (); 
    const [applications, setApplications] = useState([]); 
    const [hasSubmittedDoc, setSubmit]  = useState(false);    

    const loadSpecialties = useCallback( async (apps, cleanupFunction)=>{
        let list = [];        
        if(apps === undefined)
            return;  
        for(let e of apps){
          const {Name, Code} = await request(`/api/specialty/get/name_code/${e.Specialty}`);
          if(e.Submitted) setSubmit(true);
          list.push({id:e.Specialty, Name, Code, RankingScore: e.RankingScore, Submitted: e.Submitted});  
        };
        if(!cleanupFunction) setApplications(list);
      }, [request]);

    useEffect(()=>{
        alert.show(error, 'danger');
        // eslint-disable-next-line
    }, [error, clearError]);
        
    useEffect(()=>{    
        let cleanupFunction = false;          
        loadSpecialties(Applications, cleanupFunction);
        return () => cleanupFunction = true; 
    }, [loadSpecialties, Applications]);
    
    if (loading){
        return <Loader/>
    }
    const deleteHandler = async (event)=>{
        try{
            const response = await request('/api/applications/delete', 'DELETE', {appId:userId, specId: event.target.value});        
            alert.show(response.message);
            window.location.reload(); 
        }catch(e){
            alert.show(e.message, 'danger');
            window.scrollTo(0,0);
        }       
    }
    const submitApplicationHandler = async (event)=>{
        try{        
            if (!timeIsGone){
                return alert.show('Ви зможете це зробити після закриття прийому заяв','danger');
            }
            const doc = {
                appId: userId,
                specialtyId:event.target.value
            }    
            const res = await request(`/api/applications/submit`, 'POST', {...doc});            
            if(!res.ok){
                throw new Error(res.message || 'Помилка створення заяви!');            
            } 
            alert.show(res.message, 'success');
            window.location.reload();      
        }catch(e)  {
            alert.show(e.message, 'danger');
            window.scrollTo(0,0);
        }
    }
    let list = [];        
        list = applications.map((e, i)=>{
            return (
            <tr className='row  my-0 text-center py-auto' key={i}>
                <td className='col-1  py-3 '>{i+1}</td>
                <td className='col-1  py-3' >{e.Code}</td>
                <td className='col  py-3'> {e.Name}</td>
                <td className='col-2  py-3'>{Number(e.RankingScore)}</td>
                <td className='col-2  py-3'>{e.Submitted ?'Так' : <button  className=' btn btn-outline-success btn-sm  'disabled={e.Submitted || hasSubmittedDoc} value={e.id} onClick={submitApplicationHandler}>Підтвердити</button>}</td>
                <button  className='col-1 btn btn-outline-danger btn-sm 'value={e.id} onClick={deleteHandler}>Видалити</button>
            </tr>
            )
        });    
   
    return (
        <div className='row mb-3' style={{border: '5px double #b0bec5'}} >
            <h3 className='fs-5 fw-light mt-2'>Заяви</h3>         
            {((Applications === undefined || !Applications.length) ? (
                <div className='row'>
                    <h4 className='text-center'>Ви поки що не додали заяв</h4>
                </div>) : ( 
                    <div className='row px-5 py-1'> <table className='table table-bordered border-dark px-5 py-2 align-middle'>
                        <thead >
                            <tr className='row  my-0 text-center'>
                                <th className='col-1  py-2 align-middle ' >№</th>
                                <th className='col-1  py-2'>Код</th>
                                <th className='col  py-2'>Назва спеціальності</th>
                                <th className='col-2  py-2'>Рейтинговий бал</th>
                                <th className='col-2  py-2'>Підтверджено</th>
                                <th className='col-1 '>&nbsp;</th>
                            </tr>
                        </thead>
                        <tbody>
                            {list}       
                        </tbody>
                    </table></div>
                ))}   
            <div className='row justify-content-end my-3'>
                <button className='col-1 btn btn-outline-primary btn-sm mx-4' disabled={!hasScores || list.length === maxNumberOfApplications || loading|| timeIsGone} onClick={()=>{window.scrollTo(0,0); history.push('/applicant/applications/add')}}>Додати</button>
            </div>
        </div>
    )
}
