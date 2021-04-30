import React from "react";
import { Link } from "react-router-dom";

import logo from '../img/student.png' // relative path to image 

export const PersonalInfo = ({LastName='', FirstName='', Patronymic='', Email='', PhoneNumber=''})=>{  
  
    return (
        <div className='row mb-3' style={{border: '5px double #b0bec5'}}>
            <h3 className='fs-5 fw-light mt-2'>Персональна інформація</h3>

            <div className=" col-3 mt-2 mb-3">
                <img src={logo} style={{height:'250px', width:'250px'}} alt='applicant'></img>
            </div>
            <div className="col row g-3 justify-content-start  mt-2 mb-3" >     
                    
                <div className="row g-3 justify-content-start">
                    <div className="form-floating col-3">
                        <input readOnly type="text" className="form-control" id="LastName" value={LastName}/>
                        <label htmlFor="LastName">Прізвище</label>
                    </div>
                    <div className="form-floating col-3">
                        <input readOnly type="text" className="form-control" id="FirstName" value={FirstName}/>
                        <label htmlFor="FirstName">Ім'я</label>
                    </div>
                    <div className="form-floating col-3">
                        <input readOnly type="text" className="form-control" id="Patronymic" value={Patronymic}/>
                        <label htmlFor="Patronymic">По-батькові</label>
                    </div>

                </div>

                <div className="row g-3 justify-content-start">
                    <div className="form-floating col-4">
                        <input readOnly type="text" className="form-control" id="Email" value={Email}/>
                        <label htmlFor="Email">Email</label>
                    </div>
                    <div className="form-floating col-3">
                        <input readOnly type="text" className="form-control" id="PhoneNumber" value={PhoneNumber}/>
                        <label htmlFor="PhoneNumber">Номер телефону</label>
                    </div>
                </div>

            </div>
            <div className='row justify-content-end mb-3 px-4'>
                <Link to='/applicant/update' className='col-1 btn btn-outline-primary btn-sm'>Змінити</Link>

            </div>

        </div>
    )
}
// 