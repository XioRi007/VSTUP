import React from "react";
import { Link } from "react-router-dom";
export const Footer = ()=>{ 
    return (
        <footer className="bg-light text-center text-lg-start mx-auto mt-4">
  
  <div className="container p-4">
   
    <div className="row justify-content-between">
     
      <div className="col-lg-4 col-md-12 mb-4 mb-md-0">
        <h5 className="text-uppercase">Вступ</h5>

        <p>
          Інфораційна система, створена в рамках курсової роботи з дисципліни "Бази даних"
        </p>
        <ul className="list-unstyled mb-0 ">
            <li>
             <Link className="link-secondary text-decoration-none " to="/">Головна</Link>
          </li>
          <li>
             <Link className="link-secondary text-decoration-none" to="/auth">Увійти</Link>
          </li>
          <li>
            <Link className="link-secondary text-decoration-none" to="/faculties">Факультети</Link>
          </li>
          <li>
             <Link className="link-secondary text-decoration-none" to="/specialties">Спеціальності</Link>
          </li>
          
         
        </ul>
      </div>    
    
      <div className="col-lg-3 col-md-6 mb-4 mb-md-0 text-end">
        <h5 className="text-uppercase ">Credits</h5>

        <ul className="list-unstyled mb-0 ">
          <li>
            <p>Виконала: студентка 2 курсу математичного фак-ту гр. 6.1219-1пі Барнаш Марія</p>
          </li>
          <li>
            <p>Науковий керівник: к.ф.-м.н., доцент Лісняк А.О. </p>
          </li>
         
        </ul>
      </div>     
    
    </div>
    
  </div>


 
  <div className="text-center p-3" style={{backgroundColor:'rgba(0, 0, 0, 0.2)'}}>
    © 2021 Copyright:
    <a className="link-primary text-decoration-none" href="https://www.znu.edu.ua/" target="_blank" rel="noreferrer">&nbsp;Znu.edu.ua</a>
  </div>
 
</footer>
    )
}
// style="background-color: rgba(0, 0, 0, 0.2);"