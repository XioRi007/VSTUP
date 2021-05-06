import React, { useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import {  ToolsContext } from "../context/toolsContext";

export const AdminPage = ()=>{
    const {timeIsGone, changeTime, maxNumberOfApplications} = useContext(ToolsContext);    
    const history = useHistory();
    const changeTimeHandler = (event)=>{
        changeTime(!timeIsGone);        
    }
    

    return (<div className='container p-3 justify-content-center 'style={{minHeight:'650px'}}>
        <div className="row m-4">
            <h1 className='text-center'>Кабінет адміністратора</h1>
        </div>        
            <div className='row  my-3 col-3'>           
                <Link to='/admin/add' className='col text-decoration-none'>Додати спеціальність</Link>            
            </div>
            <div className='row   my-3 col-3'>
                <Link to='/admin/update' className='col text-decoration-none'>Змінити спеціальність</Link>            
            </div>
            <div className='row  my-3 col-3'>           
                <Link to='/admin/delete' className='col text-decoration-none'>Видалити спеціальність</Link>            
            </div>
            
            <div className="mb-3 row">
                <label htmlFor="time" className="col-1 col-form-label">Час :</label>
                <div className="col-1">
                    <input type="text" readOnly className="form-control-plaintext" id="time" value={timeIsGone ? "Вийшов" : "Триває"}/>
                </div>
                <button className='btn btn-outline-primary col-2' onClick={changeTimeHandler}>{timeIsGone ? "Почати" : "Закінчити"} подачу заяв</button>
            </div>

            <div className="mb-3 row">
                <label htmlFor="maxnum" className="col-3 col-form-label">Максимальна кількість заяв абітурієнта :</label>
                <div className="col-1">
                    <input type="text" readOnly className="form-control-plaintext" id="maxnum" value={maxNumberOfApplications}/>
                </div>
                <button className='btn btn-outline-primary col-2' onClick={()=>{history.push('/admin/update/maxnum')}}>Змінити</button>
            </div>
        <div>                    
   </div>
</div>)
}