import React from "react";
import { Link } from "react-router-dom";


export const MainPage = ()=>{
    return (<div className='container' style={{"height": '700px'}}>
    <div className="row justify-content-around mx-auto " > 
        <h1 className="text-center mt-3 col-11" style={{"height": 'fit-content', "fontSize":"130px"}}>Ласкаво просимо до системи <br/>ВСТУП</h1>
        
     </div>
     <div className='row m-3'>
     <Link to="/auth" className="col-2 btn btn-success p-3 mx-auto" style={{"width":"150px","height": 'fit-content'}}>
            Почати
        </Link>
        </div>
    </div>)
}