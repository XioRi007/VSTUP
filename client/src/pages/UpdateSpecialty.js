import React, { useContext, useEffect, useState } from "react";
import { AlertContext } from "../context/alert/alertContext";
import { useHttp } from "../hooks/useHttp";
import { useHistory} from 'react-router-dom';
import { Loader } from "../components/Loader";
import { useLoad } from "../hooks/useLoad";


export const UpdateSpecialty = ()=>{
    const history = useHistory();  
    const [subjects, setSubjects] = useState([]);
    const [faculties, setFaculties] = useState([]);
    const [specialties, setSpecialties] = useState([]);
    const {loading, error, request, clearError} = useHttp(); 
    const {loadSubjects, loadFaculties, loadSpecialties} = useLoad();   
    const [currFaculty, setCurrFaculty] = useState('');
    
    const [form, setForm] = useState({
        specId:'',  Faculty:'', SpecialtyCode:'', Name: '',
        MaxNumberOfStudents:0,IndustryCoefficient:1,
        Zno1:'', Zno2:'', Zno3:'', Zno4:'',
        faculty_selector:'',zno1_selector:'', zno2_selector:'', zno3_selector:'', zno4_selector:''
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
        loadSpecialties(currFaculty, cleanupFunction, setSpecialties);
        return () => cleanupFunction = true;       
    
        }, [loadSpecialties, setSpecialties, currFaculty]);

    

    useEffect(()=>{
        let cleanupFunction = false;
        loadSubjects(cleanupFunction, setSubjects);
        return () => cleanupFunction = true;       
    
    }, [loadSubjects, setSubjects]);
    
   
        
    const submitHandler = async (e)=>{
        try{
            e.preventDefault();  
            let Specialty={
                SpecialtyCode: form.SpecialtyCode,
                Name: form.Name,
                Faculty: form.Faculty || form.faculty_selector,
                Zno: [
                    {
                    "name": form.Zno1 || form.zno1_selector,
                    "type": "primary"
                    },
                    {
                    "name": form.Zno2 || form.zno2_selector,
                    "type": "secondary"
                    },
                    {
                    "name": form.Zno3 || form.zno3_selector,
                    "type": "custom"
                    }
                ],
                MaxNumberOfStudents: Math.abs(form.MaxNumberOfStudents),
                IndustryCoefficient: form.IndustryCoefficient
            }           

            if(form.Zno4 || form.zno4_selector){
                Specialty.Zno.push({"name": form.Zno4 || form.zno4_selector,
                                    "type": "custom"});
            }
            if(Specialty.Zno[1].name === Specialty.Zno[2].name || Specialty.Zno[1].name === Specialty.Zno[3].name || Specialty.Zno[2].name === Specialty.Zno[3].name){            ///////////////////////////////////////////////////////////////////////////////////
                throw new Error('?????????????? ?????????? ??????!');
            }                    
            const res = await request(`/api/specialty/update`, 'POST', { specId:form.specId, Specialty});            
            if(!res.ok){
                throw new Error(res.message || '?????????????? ?????????????????? ????????????????????????!');            
            } 
            alert.show(res.message, 'success');
            history.push(`/admin`);

        }catch(e){
            window.scrollTo(0,0);
            alert.show(e.message, 'danger');
        }
    }
    const changeHandler= (event)=>{        
        setForm({ ...form, [event.target.name]: event.target.value })        
    }

    return (<div className="container">
        <h1 className="fw-lighter fs-3 text-center m-5">?????????????????? ????????????:</h1>
        {loading && <Loader/>}
        <form className="g-3 col-5 justify-content-center mx-auto" onSubmit={submitHandler}>   
            {( faculties !== undefined) && <div className='row '>
                <label htmlFor="currFaculty">??????????????????</label>
                <select className="col-5 form-select mb-3" id='currFaculty' name='currFaculty' required onChange={(e)=>{setCurrFaculty(e.target.value)}} value={currFaculty}>               
               
                    <option value="" selected disabled hidden>?????????????? </option>
                    {faculties.map((i, idx) => {return (<option key={idx} value={i} >{i}</option>)})}                   
                </select>
            </div>}

            {(specialties !== undefined) && <div className='row'>
                <label htmlFor="specId ">?????????????? ??????????????????????????</label>
                <select className="col-5 form-select mb-3" id='specId' name='specId' required onChange={changeHandler} value={form.specId}>
                    <option value="" selected disabled hidden>?????????????? </option>
                    {specialties.map((i, idx) => {return (<option key={idx} value={i.id} >{i.Name}</option>)})}                   
                </select>
            </div>}

            <div className="row g-3 justify-content-center">
                <div className="col-3">
                    <label htmlFor="LastName" className="form-label">??????</label>
                    <input type="text" className="form-control" id="SpecialtyCode" name='SpecialtyCode'onChange={changeHandler} required value={form.SpecialtyCode}/>
                </div>
                <div className="col">
                    <label htmlFor="FirstName" className="form-label">??????????</label>
                    <input type="text" className="form-control" id="Name" name='Name' onChange={changeHandler} required value={form.Name }/>
                </div>
                
            </div>
            <div className="row g-3 justify-content-center my-1">
                {( faculties !== undefined) && <div className='col-6'>
                    <label htmlFor="faculty_selector" className="form-label">??????????????????</label>
                    <select className="col-5 form-select my-0" id='faculty_selector' name='faculty_selector' onChange={changeHandler} value={form.faculty_selector}>               
                
                        <option value="" selected disabled hidden>?????????????? </option>
                        {faculties.map((i, idx) => {return (<option key={idx} value={i} >{i}</option>)})}                   
                    </select>
                </div>}
                <div className="col">
                    <label htmlFor="LastName" className="form-label">?????????? ??????????????????</label>
                    <input type="text" className="form-control" id="Faculty" name='Faculty'onChange={changeHandler} />
                </div>  
                
            </div>

            <div className="row g-3 justify-content-center my-2">
                <div className="col-6">
                    <label htmlFor="LastName" className="form-label">?????????????????????? ?????????????????? ??????????????????</label>
                    <input type="number" className="form-control" id="MaxNumberOfStudents" name='MaxNumberOfStudents' min="0" max="200"onChange={changeHandler} required value={form.MaxNumberOfStudents }/>
                </div>
                <div className="col-6">
                    <label htmlFor="FirstName" className="form-label">?????????????????? ????????????????????</label>
                    <input type="number" className="form-control" id="IndustryCoefficient" name='IndustryCoefficient'  onChange={changeHandler} required value={form.IndustryCoefficient }/>
                </div>
                
            </div>

            <h5 className='text-center my-3'>???????? ??????</h5>

            <div className="row g-3 justify-content-center">                
                 
                <div className='col'>
                    <label htmlFor="zno1_selector" className="form-label">????????'???????????? ?????? 1</label>
                    <select className="form-select mb-3" id='zno1_selector' name='zno1_selector'  onChange={changeHandler} value={form.zno1_selector}>
                        <option value="" selected disabled hidden>?????????????? </option>
                        {subjects.map((i, idx) => {return (<option key={idx} value={i} >{i}</option>)})}                   
                    </select>
                </div>
                
                <div className="col-6">
                    <label htmlFor="Zno1" className="form-label">???????? ??????</label>
                    <input type="text" className="form-control" id="Zno1" name='Zno1'onChange={changeHandler} value={form.Zno1}/>
                </div> 
            </div>
            
            <div className="row g-3 justify-content-center">                
                 
                <div className='col'>
                    <label htmlFor="zno2_selector" className="form-label">????????'???????????? ?????? 2</label>
                    <select className="form-select mb-3" id='zno2_selector' name='zno2_selector'  onChange={changeHandler} value={form.zno2_selector }>
                        <option value="" selected disabled hidden>?????????????? </option>
                        {subjects.map((i, idx) => {return (<option key={idx} value={i} >{i}</option>)})}                   
                    </select>
                </div>
                
                <div className="col-6">
                    <label htmlFor="Zno2" className="form-label">???????? ??????</label>
                    <input type="text" className="form-control" id="Zno2" name='Zno2'onChange={changeHandler} value={form.Zno2} />
                </div> 
            </div>

            <div className="row g-3 justify-content-center">                
                 
                <div className='col'>
                    <label htmlFor="zno3_selector" className="form-label">?????? ???? ??????????</label>
                    <select className="form-select mb-3" id='zno3_selector' name='zno3_selector'  onChange={changeHandler} value={form.zno3_selector }>
                        <option value="" selected disabled hidden>?????????????? </option>
                        {subjects.map((i, idx) => {return (<option key={idx} value={i} >{i}</option>)})}                   
                    </select>
                </div>
                
                <div className="col-6">
                    <label htmlFor="Zno3" className="form-label">???????? ??????</label>
                    <input type="text" className="form-control" id="Zno3" name='Zno3'onChange={changeHandler} value={form.Zno3}/>
                </div> 
            </div>

            <div className="row g-3 justify-content-center">                
                 
                <div className='col'>
                    <label htmlFor="zno4_selector" className="form-label">?????? ???? ??????????</label>
                    <select className="form-select mb-3" id='zno4_selector' name='zno4_selector'  onChange={changeHandler} value={form.zno4_selector }>
                        <option value="" selected disabled hidden>?????????????? </option>
                        {subjects.map((i, idx) => {return (<option key={idx} value={i} >{i}</option>)})}                   
                    </select>
                </div>
                
                <div className="col-6">
                    <label htmlFor="Zno4" className="form-label">???????? ??????</label>
                    <input type="text" className="form-control" id="Zno4" name='Zno4'onChange={changeHandler} value={form.Zno4} />
                </div> 
            </div>

            

                        
                         
                        
                     
            <div className='row'>
                <button type="submit" className="btn btn-primary mb-5 mx-auto" disabled={loading} style={{"width": 'fit-content'}} >??????????????????????</button>
            </div>


               
            
        </form>
    </div>)
}