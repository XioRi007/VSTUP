import React, { useContext, useEffect, useState } from "react";
import { AlertContext } from "../context/alert/alertContext";
import { useHttp } from "../hooks/useHttp";
import { useHistory} from 'react-router-dom';
import { Loader } from "../components/Loader";
import { AuthContext } from "../context/auth/authContext";
import { useLoad } from "../hooks/useLoad";



export const AddScore = ()=>{
    const {userId} = useContext(AuthContext);
    const {loadSubjects} = useLoad();

    const history = useHistory();  
    const [subjects, setSubjects] = useState([]);
    const {loading, error, request, clearError} = useHttp();    
    const [form, setForm] = useState({
        Zno1:"", 
        Zno1Score: 100, 
        Zno2:"", 
        Zno2Score:100, 
        Zno3: "", 
        Zno3Score: 100, 
        Zno4: "", 
        Zno4Score: 100,Aver:100
    });
    const alert = useContext(AlertContext);
    useEffect(()=>{
        alert.show(error, 'danger');
        // eslint-disable-next-line
    }, [error, clearError, alert.show]);


           
    useEffect(()=>{
        let cleanupFunction = false;
        loadSubjects(cleanupFunction, setSubjects);
        return () => cleanupFunction = true;       

    }, [loadSubjects, setSubjects]);
    


    const submitHandler = async (e)=>{
        e.preventDefault();   
        const set = new Set([form.Zno1, form.Zno2,form.Zno3,form.Zno4]);
        if(set.size !== 4){
            return alert.show("Зно мають бути різними!", 'danger');
        }    

        const Zno = [
            {
              name: form.Zno1,
              score: Number(form.Zno1Score)
            },{
              name: form.Zno2,
              score: Number(form.Zno2Score)
            },{
              name: form.Zno3,
              score: Number(form.Zno3Score)
            },{
              name: form.Zno4,
              score: Number(form.Zno4Score)
            }];
        const AverageScore= Number(form.Aver);      
        
        
          if(Zno[3].name === ''){            ///////////////////////////////////////////////////////////////////////////////////
            Zno.splice(3,1);
        }
        try{
            const res = await request('/api/applicant/update', 'POST', {appId:userId, doc:{Zno, AverageScore}});
            if(!res.ok){
                throw new Error('Ошибка обновления абитуриента!');
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



    return (<div className="container">
        <h1 className="fw-lighter fs-3 text-center m-5">Заповніть анкету:</h1>
        {loading && <Loader/>}
        <form className="g-3 col-4 justify-content-center mx-auto" onSubmit={submitHandler}>    

            <div className='row'>
                <h3 className='text-center'>Зно 1</h3>

                <label htmlFor="zno1_selector ">Оберіть предмет</label>
                <select className="col-5 form-select mb-3" id='zno1_selector' name='Zno1' required onChange={changeHandler} value={form.Zno1}>
                    <option value="" selected disabled hidden>Вибрати </option>
                    {subjects.map((i, idx) => {return (<option key={idx} value={i} >{i}</option>)})}                   
                </select>
                <div className=" col-3 form-floating mb-3 p-1 mx-auto">
                    <input type="number" className="form-control" id="floatingInput" placeholder="194" min="100" max="200" name='Zno1Score' required onChange={changeHandler} value={form.Zno1Score}/>
                    <label htmlFor="floatingInput">Оцінка</label>
                </div>
            </div>

            <div className='row'>
                <h3 className='text-center'>Зно 2</h3>
                <label htmlFor="zno2_selector ">Оберіть предмет</label>
                <select className="col-5 form-select mb-3" aria-label="Default select example" id='zno1_selector' name='Zno2' required onChange={changeHandler} value={form.Zno2}>
                    <option value="" selected disabled hidden>Вибрати </option>
                    {subjects.map((i, idx) => {return (<option key={idx} value={i}>{i}</option>)})}
                </select>
                <div className=" col-3 form-floating mb-3 p-1 mx-auto">
                    <input type="number" className="form-control" id="floatingInput" placeholder="194" min="100" max="200" name='Zno2Score' required onChange={changeHandler} value={form.Zno2Score}/>
                    <label htmlFor="floatingInput">Оцінка</label>
                </div>
            </div>

            <div className='row'>
                <h3 className='text-center'>Зно 3</h3>
                <label htmlFor="zno3_selector ">Оберіть предмет</label>
                <select className="col-5 form-select mb-3" aria-label="Default select example" id='zno1_selector' name='Zno3' required onChange={changeHandler} value={form.Zno3}>
                    <option value="" selected disabled hidden>Вибрати </option>
                    {subjects.map((i, idx) => {return (<option key={idx} value={i}>{i}</option>)})}
                </select>
                <div className=" col-3 form-floating mb-3 p-1 mx-auto">
                    <input type="number" className="form-control" id="floatingInput" placeholder="194" min="100" max="200" name='Zno3Score' required onChange={changeHandler} value={form.Zno3Score}/>
                    <label htmlFor="floatingInput">Оцінка</label>
                </div>
            </div>
            <div className='row'>
                <h3 className='text-center'>Зно 4</h3>
                <label htmlFor="zno3_selector ">Оберіть предмет</label>
                <select className="col-5 form-select mb-3" aria-label="Default select example" id='zno1_selector' name='Zno4' onChange={changeHandler} value={form.Zno4}>
                    <option value=''>Не складав</option>
                    {subjects.map((i, idx) => {return (<option key={idx} value={i}>{i}</option>)})}
                </select>
                <div className=" col-3 form-floating mb-3 p-1 mx-auto">
                    <input type="number" className="form-control" id="floatingInput" placeholder="194" min="100" max="200" name='Zno4Score' required onChange={changeHandler} value={form.Zno4Score}/>
                    <label htmlFor="floatingInput">Оцінка</label>
                </div>
            </div>


            <div className='row'>
                <h3 className='text-center'>Атестат</h3>                                  
                <div className=" col-3 form-floating mb-3 p-1 mx-auto">
                    <input type="number" className="form-control" id="floatingInput" placeholder="194" min="100" max="200" name='Aver' required onChange={changeHandler} value={form.Aver}/>
                    <label htmlFor="floatingInput">Оцінка</label>
                </div>
            </div>
            <div className='row'>
                <button type="submit" className="btn btn-primary mb-5 mx-auto" disabled={loading} style={{"width": 'fit-content'}} >Підтвердити</button>

            </div>
                    
            
        </form>
    </div>)
}