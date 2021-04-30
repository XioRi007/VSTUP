import React, { useCallback, useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { AlertContext } from "../context/alert/alertContext";
import { AuthContext } from "../context/auth/authContext";
import { TimeContext } from "../context/timeContext";
import { useHttp } from "../hooks/useHttp";
import { Loader } from "./Loader";


export const ApplicationList = ({Applications})=>{  
    const {userId} = useContext(AuthContext);    
    const history = useHistory();
    const {timeIsGone} = useContext(TimeContext);
    const alert = useContext(AlertContext);    
    const {loading, error, request, clearError} = useHttp (); 
    const [applications, setApplications] = useState([]); 
    const [hasSubmittedDoc, setSubmit]  = useState(false);



    const loadSpecialties = useCallback( async (apps, cleanupFunction)=>{
        let list = [];        
        if(apps === undefined)
            return;  
        apps.forEach(async (e, i)=>{
          const {Name, Code} = await request(`/api/specialty/get/name_code/${e.Specialty}`);
          if(e.Submitted) setSubmit(true);
          list.push({id:e.Specialty, Name, Code, RankingScore: e.RankingScore, Submitted: e.Submitted});  
        });
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
        const response = await request('/api/applications/delete', 'POST', {appId:userId, specId: event.target.value});        
        alert.show(response.message);
        window.location.reload(); 

    }
    const submitApplicationHandler = async (event)=>{
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
        
    }

    let list = [];
        list = applications.map((e, i)=>{
            return (
            <div className='row  my-0 text-center py-auto' key={i}>
                <p className='col-1 border border-dark mb-0 py-3 '>{i+1}</p>
                <p className='col-1  border border-dark mb-0 py-3' >{e.Code}</p>
                <p className='col border border-dark mb-0 py-3'> {e.Name}</p>
                <p className='col-2 border border-dark mb-0 py-3'>{e.RankingScore}</p>
                <p className='col-2 border border-dark mb-0 py-3'>{e.Submitted ?'Так' :'Ні'}</p>
                <button  className='col-1 btn btn-outline-success btn-sm border border-dark mb-0 py-3 'disabled={e.Submitted || hasSubmittedDoc} value={e.id} onClick={submitApplicationHandler}>Підтвердити</button>
                <button  className='col-1 btn btn-outline-danger btn-sm border border-dark mb-0 py-3 'value={e.id} onClick={deleteHandler}>Видалити</button>
            </div>
            )
        });        

    return (
        <div className='row mb-3' style={{border: '5px double #b0bec5'}} >
            <h3 className='fs-5 fw-light mt-2'>Заяви</h3>         
            {((Applications === undefined || !Applications.length) ? (
                <div className='row'>
                    <h4 className='text-center'>Ви поки що не додали Заяви</h4>
                </div>) : ( !list.length ? <Loader/>:
                    <div className='px-5 py-2'>
                        <div className='row  my-0 text-center'>
                            <h6 className='col-1 border border-dark mb-0 py-2 align-middle ' >№</h6>
                            <h6 className='col-1 border border-dark mb-0 py-2'>Код</h6>
                            <h6 className='col border border-dark mb-0 py-2'>Назва спеціальності</h6>
                            <h6 className='col-2 border border-dark mb-0 py-2'>Рейтинговий бал</h6>
                            <h6 className='col-2 border border-dark mb-0 py-2'>Підтверджено</h6>
                            <h6 className='col-2 border border-dark mb-0'>&nbsp;</h6>
                        </div>
                        {list}       
                    </div>
                ))}          
            
            <div className='row justify-content-end my-3 px-4'>
                <button className='col-1 btn btn-outline-primary btn-sm' disabled={list.length === 5 || loading|| timeIsGone} onClick={()=>{history.push('/applicant/applications/add')}}>Додати</button>

            </div>

        </div>
    )
}
///applicant/applications/add