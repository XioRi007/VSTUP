import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AlertContext } from "../context/alert/alertContext";

export const ScoresList = ({Zno, AverageScore, hasApps})=>{  
    const alert = useContext(AlertContext);
  let list = [];
  if(Zno !== undefined){ 

     list = Zno.map((e, i)=>{        
         return (<tr key={i} className='row  my-0 text-center'>
                    <td className='col-1  py-2 ' >{i+1}</td>
                    <td className='col   py-2'>{e.name}</td>
                    <td className='col-1   py-2'>{e.score}</td>                      
                  </tr>)
     });
     list.push(
         (<tr key={Zno.length} className='row  my-0 text-center'>
            <td className='col-1  py-2 ' >{Zno.length+1}</td>
            <td className='col   py-2'>Середній бал атестата</td>
            <td className='col-1   py-2'>{AverageScore}</td>    
         </tr>)
     )
    }    
    return (
        <div className='row mb-3' style={{border: '5px double #b0bec5'}}>
            <h3 className='fs-5 fw-light mt-2'>Бали ЗНО</h3>
            {(!list.length) ? (<div className='row'>
                <h4 className='text-center'>Ви поки що не додали бали ЗНО</h4>
            </div> )    :      
            <div className='row px-5 py-1'> <table className='table table-bordered border-dark px-5 py-2 align-middle'>
                <thead >
                    <tr className='row  my-0 text-center'>
                        <th className='col-1  py-2 ' >№</th>
                        <th className='col   py-2'>Предмет</th>
                        <th className='col-1  py-2'>Бал</th>
                    </tr>                    
                </thead>
                <tbody>
                    {[...list]}
                </tbody>

            </table> </div> }
            <div className='row justify-content-end mb-3 '>
                <Link className='col-1 btn btn-outline-primary btn-sm mx-4' to='/applicant/scores/add' onClick={(e)=>{if(hasApps) {e.preventDefault(); alert.show('Не можна змінювати оцінки після подачі заяв', 'danger')}window.scrollTo(0,0);}} >{list.length ? ('Змінити'):("Додати")}</Link>
            </div>

        </div>
    )
}
