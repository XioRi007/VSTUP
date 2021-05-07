import React from "react";
import {Switch, Route, Redirect} from "react-router-dom";
import { AuthPage } from "../pages/AuthPage";
import { FacultyPage } from "../pages/FacultyPage";
import { SpecialtiesPage } from "../pages/SpecialtiesPage";
import { SpecialtyPage } from "../pages/SpecialtyPage";
import { ApplicantPage } from "../pages/ApplicantPage";
import { UpdateApplicant } from "../pages/UpdateApplicant";
import { NewApplicant } from "../pages/NewApplicant";
import { MainPage } from "../pages/MainPage";
import { AddScore } from "../pages/AddScore";
import { AddApplication } from "../pages/AddApplication";
import { AddDocument } from "../pages/AddDocument";
import { AdminPage } from "../pages/AdminPage";
import { AddSpecialty } from "../pages/AddSpecialty";
import { UpdateSpecialty } from "../pages/UpdateSpecialty";
import { DeleteSpecialty } from "../pages/DeleteSpecialty";
import { SpecialtiesByFacultyPage } from "../pages/SpecialtiesByFacultyPage";
import { UpdateMaxNum } from "../pages/UpdateMaxNum";


export const useRoutes = (isAdmin, isApplicant) =>{    
    
    if(isAdmin){//если admin
        return (
            <Switch>   
                <Route path="/admin" exact>
                    <AdminPage/>
                </Route>      
                <Route path='/admin/update/maxnum'>
                    <UpdateMaxNum/>
                </Route>          
                <Route path="/admin/update" exact>
                    <UpdateSpecialty/>
                </Route>
                <Route path="/admin/add">
                    <AddSpecialty/>
                </Route>
                <Route path="/admin/delete">
                    <DeleteSpecialty/>                   
                </Route>
                
                <Route path="/faculties" exact>
                    <FacultyPage/>
                </Route>
                <Route path="/specialties/faculty/:faculty" >
                    <SpecialtiesByFacultyPage/>
                </Route>
                <Route path="/specialties" exact>
                    <SpecialtiesPage/>
                </Route>
                <Route path="/specialty/:specialty">
                    <SpecialtyPage/>
                </Route>                             
                <Route path="/applicant/new" exact >
                    <NewApplicant/>
                </Route>
                <Route path="/auth">
                    <AuthPage/>
                </Route>
                <Route path="/" exact>
                    <MainPage/>
                </Route>
                <Redirect to="/"/>
                
            </Switch>
        )
    }
    if(isApplicant){
        return (
            <Switch>  

                <Route path="/faculties" exact>
                    <FacultyPage/>
                </Route>                
                <Route path="/specialties" exact>
                    <SpecialtiesPage/>
                </Route>
                <Route path="/specialties/faculty/:faculty" >
                    <SpecialtiesByFacultyPage/>
                </Route>
                <Route path="/specialty/:specialty">
                    <SpecialtyPage/>
                </Route>                             
                <Route path="/applicant/new" exact >
                    <NewApplicant/>
                </Route>
                <Route path="/auth">
                    <AuthPage/>
                </Route>
                <Route path="/" exact>
                    <MainPage/>
                </Route>
                
                <Route path="/applicant/update" exact> 
                    <UpdateApplicant/>
                </Route> 
                <Route path="/applicant/scores/add" exact>
                    <AddScore/>
                </Route> 
                <Route path="/applicant/documents/add">
                    <AddDocument/>
                </Route>  
                <Route path="/applicant/applications/add" exact>
                    <AddApplication/>
                </Route>  
                <Route path="/applicant/:id">
                    <ApplicantPage/>
                </Route>            
                               
                
                <Redirect to="/"/>
                
            </Switch>
        )
    }

    return (
        <Switch>
            <Route path="/faculties" exact>
                    <FacultyPage/>
                </Route>
                <Route path="/specialties/faculty/:faculty" >
                    <SpecialtiesByFacultyPage/>
                </Route>
                <Route path="/specialties" exact>
                    <SpecialtiesPage/>
                </Route>
                <Route path="/specialty/:specialty">
                    <SpecialtyPage/>
                </Route>                             
                <Route path="/applicant/new" exact >
                    <NewApplicant/>
                </Route>
                <Route path="/auth">
                    <AuthPage/>
                </Route>
                <Route path="/" exact>
                    <MainPage/>
                </Route>
                <Redirect to="/"/>
        </Switch>
    )

}