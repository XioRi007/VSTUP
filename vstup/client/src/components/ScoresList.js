import React from "react";
import { Link } from "react-router-dom";


export const ScoresList = ({Score, hasApps})=>{  
  let list = [];
  if(Score !== undefined){
      let tmp = [];

    for (let key in Score){    
        if( typeof Score[key] === 'object'){
            tmp.push({name: Score[key].name, score: Score[key].score});
        }
        else{
            tmp.push({name: 'Середній бал атестата', score: Score[key]});
        }
     }
     list = tmp.map((e, i)=>{
        
         return (<div key={i} className='row  my-0 text-center'>
                    <p className='col-1 border border-dark mb-0 py-2 ' >{i+1}</p>
                    <p className='col border border-dark mb-0 py-2'>{e.name}</p>
                    <p className='col-1 border border-dark mb-0 py-2'>{e.score}</p>                      
                  </div>)
     })
  }
     

    return (
        <div className='row mb-3' style={{border: '5px double #b0bec5'}}>
            <h3 className='fs-5 fw-light mt-2'>Бали ЗНО</h3>
            {(!list.length) ? (<div className='row'>
                <h4 className='text-center'>Ви поки що не додали бали ЗНО</h4>
            </div> )    :      
            (<div  className='px-5 py-2'>
                <div className='row  my-0 text-center'>
                    <h6 className='col-1 border border-dark mb-0 py-2 ' >№</h6>
                    <h6 className='col border border-dark mb-0 py-2'>Предмет</h6>
                    <h6 className='col-1 border border-dark mb-0 py-2'>Бал</h6>
                    
                </div>
                {[...list]}

            </div> )    }
            <div className='row justify-content-end mb-3 px-4'>
                <Link className='col-1 btn btn-outline-primary btn-sm' to='/applicant/scores/add' onClick={(e)=>{if(hasApps) e.preventDefault()}} >{list.length ? ('Змінити'):("Додати")}</Link>

            </div>

        </div>
    )
}

/**
 * 
 *                    
                     
                      
 */