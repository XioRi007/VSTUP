import React, { useCallback, useContext, useEffect, useState } from "react";
import { AlertContext } from "../context/alert/alertContext";
import { useHttp } from "../hooks/useHttp";
import { useHistory, useParams} from 'react-router-dom';
import { TimeContext } from "../context/timeContext";
import { Loader } from "../components/Loader";

export const SpecialtyPage = ()=>{
    const specId = useParams().specialty;   
    const [specialty, setSpecialty] = useState({}); 
    const [applications, setApplications] = useState([]);       
    const {timeIsGone} = useContext(TimeContext);
    const { error, request, clearError, loading} = useHttp();      
    const history = useHistory();
    const alert = useContext(AlertContext);  
    let list = [];

    const loadSpecialty = useCallback( async (id, cleanupFunction)=>{
        if(!id) return;                
        try{            
            const {Specialty} =await request(`/api/specialty/get/${id}`);            
            if (!Specialty){                
                throw new Error('Помилка загрузки специальності');          
            }                         
            if(!cleanupFunction) setSpecialty({...Specialty});  
        }catch(e){           
            alert.show(e.message, 'danger');
            history.push('/');            
        }                
    }, [request, alert, history]);   

    useEffect(()=>{  
        let cleanupFunction = false;      
        loadSpecialty(specId, cleanupFunction);
        return () => cleanupFunction = true;       
    }, [loadSpecialty, specId]);

    const loadAllApplications = useCallback( async (cleanupFunction)=>{
        if(!specId || list.length || !specialty) return;                
        try{            
            const {Applications} =await request(`/api/applications/get/${specId}`);  
            //console.log(Applications);       
            if(!cleanupFunction) setApplications(Applications);  
        }catch(e){
            alert.show(e.message, 'danger');
            history.push('/');    
        } // eslint-disable-next-line               
    }, [request, alert, specId, history]);   

    const loadApplications = useCallback( async (cleanupFunction)=>{
        if(!specId || list.length || !specialty.MaxNumberOfStudents) return;                
        try{       
            let {Applications} =await request(`/api/applications/get/true/${specId}/${specialty.MaxNumberOfStudents}`);  
            const subb =  Applications;
            const res  = await request(`/api/applications/get/false/${specId}/${null}`);
            const neew = subb.concat(res.Applications);
            if(!cleanupFunction) setApplications(neew);  
        }catch(e){
            alert.show(e.message, 'danger');
            history.push('/');    
        }                // eslint-disable-next-line
    }, [request, alert, specId, history]);   

    useEffect(()=>{
        let cleanupFunction = false;      

        if(timeIsGone){     
            loadApplications(cleanupFunction);   
        }else{
            loadAllApplications(cleanupFunction);
        }
        return () => cleanupFunction = true;  
        // eslint-disable-next-line
    }, [loadAllApplications, loadApplications,timeIsGone]);

    useEffect(()=>{
        alert.show(error, 'danger');   
        // eslint-disable-next-line
    }, [error, clearError]); 
    

    if(specialty.NumberOfApplications && !loading ){  
        list = applications.map((e, i)=>{
                return (
                    <tr className='row  my-0 text-center py-auto' style={(timeIsGone && e.Submitted) ? {backgroundColor:'#c8e6c9'} : {}} key={i}>
                        <td className='col-1 '>{i+1}</td>
                        <td className='col-3 '>{e.LastName}</td>
                        <td className='col-2  '>{e.FirstName}</td>
                        <td className='col-2  '>{e.Patronymic}</td>
                        <td className='col-2 '>{e.RankingScore}</td>
                        <td className='col-2 '>{e.Submitted ? 'Так' : 'Ні'}</td>                            
                    </tr>
                )
            })
    }
  
    return (<div className='container'>
        <h1 className='text-center my-5'>{specialty.SpecialtyCode} : {specialty.Name}</h1>  
        <div className='row mb-3' style={{border: '5px double #b0bec5'}}>
            <h3 className='fs-5 fw-light mx-5 mt-3'>Інформація</h3>
            
            <div className="col-9 row g-5 justify-content-between mx-auto my-1" >             
                
                <div className=" col-4 g-3 justify-content-center my-2">
                    <div className=" form-floating row g-3  mb-2">   
                        <input type="text" className="form-control" id="faculty"  value={specialty.Faculty || ''} readOnly/>
                        <label htmlFor="faculty">Факультет</label>                   
                    </div>

                    <div className=" form-floating row g-3 mb-2">   
                        <input type="number" className="form-control" id="maxNumber" value={specialty.MaxNumberOfStudents || 0} readOnly/>
                        <label htmlFor="maxNumber">Максимальна кількість студентів</label>                   
                    </div>

                    <div className=" form-floating row g-3 mb-2">   
                        <input type="number" className="form-control" id="coeff" value={specialty.IndustryCoefficient || 1} readOnly/>
                        <label htmlFor="coeff">Галузевий коефіціент</label>                   
                    </div>
                    <div className=" form-floating row g-3 mb-2">   
                        <input type="number" className="form-control" id="numOfApps"  value={specialty.NumberOfApplications || 0} readOnly/>
                        <label htmlFor="numOfApps">Подано заяв</label>                   
                    </div>

                </div>

                <div className='col-4 g-3 justify-content-center my-2'>  
                    { specialty.Zno && specialty.Zno.map((e,i)=>{
                        return (
                            <div className=" form-floating row g-3  mb-2" key={i}>   
                                <input type="text" className="form-control" id={`Zno${i+1}`} value={e.name}  readOnly/>
                                <label htmlFor={`Zno${i+1}`}>{`ЗНО ${i+1}`}</label>                   
                            </div>)
                    })} 
                </div>      
            </div>
        </div>

        <div className='row p-4 px-5' style={{border: '5px double #b0bec5'}}>
            <h3 className='fs-5 fw-light '>Рейтинг</h3>
            {
            specialty.NumberOfApplications ? (
                !list.length ? <Loader/>:(
            <table className=' table table-bordered  border-dark col-10 align-middle'>
                <thead className=''>
                    <tr className='row  my-0 text-center'>
                        <th className='col-1' >№</th>
                        <th className='col-3 ' >Прізвище</th>
                        <th className='col-2'>Ім'я</th>
                        <th className='col-2'>По-батькові</th>
                        <th className='col-2 '>Бал</th>
                        <th className='col-2 '>Підтверджено</th>
                        
                    </tr>
                </thead>
                <tbody>
                {list}                    
                </tbody>                
            </table> )          
                ) : ( <h4 className='text-center'>На цю спеціальність поки не подано заяв</h4>                
                )}          

        </div>

    </div>)

}