import React, { useCallback, useContext, useEffect, useState } from "react";
import { AlertContext } from "../context/alert/alertContext";
import { useHttp } from "../hooks/useHttp";
import { useHistory} from 'react-router-dom';
import { AuthContext } from "../context/auth/authContext";
import { useLoad } from "../hooks/useLoad";
import { TimeContext } from "../context/timeContext";


export const AddApplication = ()=>{
    const {timeIsGone} = useContext(TimeContext);
    const {userId} = useContext(AuthContext);

    const history = useHistory();  
    const [faculties, setFaculties] = useState([]);
    const [scores, setScores] = useState([]);
    const [specialties, setSpecialties] = useState([]);
    const {loading, error, request, clearError} = useHttp();    
    const {loadFaculties, loadSpecialties} = useLoad();
    const [form, setForm] = useState({
        Faculty:'', Specialty:'', Scores: []       
    });
    const alert = useContext(AlertContext);
    useEffect(()=>{
        alert.show(error, 'danger');
        // eslint-disable-next-line
    }, [error, clearError, alert.show]);
    
    useEffect(()=>{
        let cleanupFunction = false;
        loadFaculties(cleanupFunction, setFaculties, faculties.length);
        return () => cleanupFunction = true;       
    
        }, [loadFaculties, setFaculties, faculties.length]);


    useEffect(()=>{
        let cleanupFunction = false;
        loadSpecialties(form.Faculty, cleanupFunction, setSpecialties);
        return () => cleanupFunction = true;       
    
        }, [loadSpecialties, setSpecialties, form.Faculty]);

    const loadScores = useCallback( async (cleanupFunction)=>{
        try{
            const {Score} =await request(`/api/applicant/get/scores/${userId}`);      
            if (!Score)
                throw new Error('Ошибка загрузки балів');    
            if(Score !== undefined){
                let tmp = [];                
                for (let key in Score){  
                    if( typeof Score[key] === 'object'){
                        tmp.push({name: Score[key].name, score: Score[key].score});
                    }
                }
                if(!cleanupFunction) setScores(tmp);
            }                                   
        }catch(e){
            alert.show(e.message, 'danger');
            history.push('/'); 
        }        
    }, [request, alert, userId]);   

    useEffect(()=>{
        let cleanupFunction = false;  
        loadScores(cleanupFunction);
        return () => cleanupFunction = true;     
    }, [loadScores]);

    if(timeIsGone){
        return (<div className='row p-auto d-flex align-items-center' style={{minHeight:'650px'}}>
            <h4 className='text-center my-5' >Подача заяв закрита</h4>
        </div>)
    }
    
   
    const submitHandler = async (e)=>{
        try{
            
            e.preventDefault();   
            if(form.Scores.length !== 3)    {
                alert.show('Оберіть три предмети!', 'danger');
                return ;
            }
            let scorelist = [];
            form.Scores.forEach((e, i)=>{//делаем из индексов ЗНО сами ЗНО
                scorelist.push(scores[e]);
            })
            setForm({ ...form, Scores: scorelist });    
            const doc = {
                appId: userId,
                specialtyId:form.Specialty,
                Zno: scorelist
            }
       
            const res = await request(`/api/applications/add`, 'POST', {...doc});            
            if(!res.ok){
                throw new Error(res.message || 'Помилка створення заяви!');            
            } 
            alert.show(res.message, 'success');
            history.push(`/applicant/${userId}`);

        }catch(e){
            alert.show(e.message, 'danger');
        }
    }
    const changeHandler= (event)=>{        
        setForm({ ...form, [event.target.name]: event.target.value })        
    }


    const handleChangeMultiple = (event) => {
        const { options } = event.target;
        const idx = [];        
        for (let i = 0, l = options.length; i < l; i += 1) {
          if (options[i].selected) {
              idx.push(options[i].value);         
          }
        }
        setForm({ ...form, Scores: idx });
      };

    return (<div className="container" style={{minHeight:'650px'}}>
        <h1 className="fw-lighter fs-3 text-center m-5">Заповніть анкету:</h1>
       
        <form className="g-3 col-4 justify-content-center mx-auto" onSubmit={submitHandler}>   
            {( faculties !== undefined) && <div className='row'>
                <label htmlFor="Faculty">Факультет</label>
                <select className="col-5 form-select mb-3" id='Faculty' name='Faculty' required onChange={changeHandler} value={form.Faculty}>               
               
                    <option value="" selected disabled hidden>Вибрати </option>
                    {faculties.map((i, idx) => {return (<option key={idx} value={i} >{i}</option>)})}                   
                </select>
            </div>}

            {(specialties !== undefined) && <div className='row'>
                <label htmlFor="Specialty ">Оберіть спеціальність</label>
                <select className="col-5 form-select mb-3" id='Specialty' name='Specialty' required onChange={changeHandler} value={form.Specialty}>
                    <option value="" selected disabled hidden>Вибрати </option>
                    {specialties.map((i, idx) => {return (<option key={idx} value={i._id} >{i.Name}</option>)})}                   
                </select>
            </div>}
            <div className='row'>
                <label htmlFor="scores ">Оберіть ЗНО</label>
                <select className="form-select" multiple={true} aria-label="multiple select example" id='scores' name='Scores' onChange={handleChangeMultiple} value={form.Scores}>
                    {
                    scores.length &&  scores.map((e, i)=>{                       
                        return (<option key={i} value={i} >{e.name} : {e.score}</option>);                        
                    })}
                </select>
            
                      

            </div>
            <div className='row'>
                <button type="submit" className="btn btn-primary m-5 mx-auto" disabled={loading} style={{"width": 'fit-content'}} >Підтвердити</button>
            </div>


               
            
        </form>
    </div>)
}
//{{name: e.name, score:e.score}}