import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { TimeContext } from "../context/timeContext";

export const AdminPage = ()=>{
    const {timeIsGone, changeTime} = useContext(TimeContext);    
    const changeTimeHandler = (event)=>{
        changeTime(!timeIsGone);        
    }

    return (<div className='container p-3 justify-content-center 'style={{minHeight:'650px'}}>
        <div className="row m-4">
            <h1 className='text-center'>Кабінет адміністратора</h1>
        </div>
        
            <div className='row  my-3'>           
                <Link to='/admin/add' className='col text-decoration-none'>Додати спеціальність</Link>            
            </div>
            <div className='row   my-3'>
                <Link to='/admin/update' className='col text-decoration-none'>Змінити спеціальність</Link>            
            </div>
            <div className='row  my-3'>           
                <Link to='/admin/delete' className='col text-decoration-none'>Видалити спеціальність</Link>            
            </div>
            <div className='row col-4 my-3'>
                <button className='btn btn-outline-primary col-6 ' onClick={changeTimeHandler}>{timeIsGone ? "Почати" : "Закінчити"} подачу заяв</button>            
            </div>

    </div>)

}