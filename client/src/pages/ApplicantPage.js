import React, { useCallback, useState , useEffect, useContext} from "react";
import { useHistory, useParams } from "react-router-dom";
import { ApplicationList } from "../components/ApplicationList";
import { DocumentsList } from "../components/DocumentsList";
import { Loader } from "../components/Loader";
import { PersonalInfo } from "../components/PersonalInfo";
import { ScoresList } from "../components/ScoresList";
import { AlertContext } from "../context/alert/alertContext";
import { AuthContext } from "../context/auth/authContext";
import { useHttp } from "../hooks/useHttp";

export const ApplicantPage = ()=>{
    const history = useHistory();
    const {logout} = useContext(AuthContext);
    const [applicant, setApplicant] = useState({});
    const appId = useParams().id;
    const {loading, error, request, clearError} = useHttp();    
    const alert = useContext(AlertContext);      
       
    const loadApplicant = useCallback(async (cleanupFunction)=>{
      try{
        const {appDoc} = await request(`/api/applicant/get/${appId}`);   
        if(!cleanupFunction) setApplicant(appDoc) ;               
        }catch(e){
            alert.show(e.message, 'danger');
            history.push('/'); 
        }
        // eslint-disable-next-line
    }, [request, alert.show, history]);
    
    useEffect(()=>{
        alert.show(error, 'danger');
        // eslint-disable-next-line
    }, [error, clearError, alert.show]);

    useEffect(()=>{
      let cleanupFunction = false;
      loadApplicant(cleanupFunction);
      return () => cleanupFunction = true;     

  }, [loadApplicant]);

  const deleteHandler = async (event)=>{
    try{
        const response = await request('/api/applicant/delete', 'DELETE', {appId});        
        alert.show(response.message);
        logout();
        history.push('/');
    }catch(e){
        alert.show(e.message, 'danger');
        window.scrollTo(0,0);
    }       
}
  if (loading) return <Loader/> 
    return (<div className="container p-5">
        <div className="row mb-4">
            <h1 className='text-center'>Кабінет абітурієнта</h1>
        </div>        
        <PersonalInfo LastName={applicant.LastName} FirstName={applicant.FirstName} Patronymic={applicant.Patronymic} Email={applicant.Email} PhoneNumber={applicant.PhoneNumber}/>
        <ScoresList Zno={applicant.Zno} AverageScore={applicant.AverageScore} hasApps={applicant.Applications && applicant.Applications.length}/>        
        <ApplicationList Applications={applicant.Applications} hasScores={applicant.Zno && applicant.Zno.length}/>
        <DocumentsList Documents={applicant.Documents}/>
        <div className='row col-2 mx-auto my-4'>
            <button className='btn btn-danger' value={appId} onClick={deleteHandler}>Видалити</button>
        </div>        
    </div>)
}