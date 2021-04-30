import React from "react";
import { Link } from "react-router-dom";


export const MainPage = ()=>{
    return (
    <div className="row justify-content-around mx-auto " style={{"height": '700px'}}> 
        <h1 className="text-center my-auto" style={{"height": 'fit-content', "fontSize":"150px"}}>Wellcome to the VSTUP!</h1>
        <Link to="/auth" className="btn btn-success p-3" style={{"width":"150px","height": 'fit-content'}}>
                    Почати
        </Link>
     </div>)
}