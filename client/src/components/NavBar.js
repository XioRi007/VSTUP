import React, { useContext } from "react";
import { Link } from "react-router-dom";
import {useHistory} from 'react-router-dom';
import { AuthContext } from "../context/auth/authContext";

export const NavBar = ()=>{
  const {isAdmin, isApplicant, adminLogout, logout, userId} = useContext(AuthContext);
  const history = useHistory();
  let params = {};
  if(!isApplicant && !isAdmin){
    params = {
      text: 'Login',
      handler: ()=>{
        history.push('/auth');
      }
    }
  }else 
      if(isApplicant){
        params = {
          text: 'Logout',
          handler: logout
        }
      }else{
        params = {
          text: 'Logout',
          handler: adminLogout
        }

      }
      
  

    return (
      <nav className="navbar navbar-expand-lg navbar-primary bg-light">
        <div className="mx-5 container-fluid">
          <Link className="navbar-brand fw-bold fs-3" to="/">ВСТУП</Link>
          
          <div className="collapse navbar-collapse justify-content-end mx-5">
            <ul className="navbar-nav ">
                
                <li className="nav-item">
                    <Link className="nav-link " to="/faculties">Факультети</Link>
                </li> 
                <li className="nav-item">
                    <Link className="nav-link " to="/specialties">Спеціальності</Link>
                </li>                        
            </ul> 
          </div>
         
          {(isApplicant || isAdmin) && (<Link className="btn btn-outline-success btn-sm" to={ isApplicant? `/applicant/${userId}` : '/admin'}>Персональний кабінет</Link>)}

          <button className="btn btn-success ms-4" onClick={params.handler}>{params.text}</button>
        </div>
      </nav>)
}
// 