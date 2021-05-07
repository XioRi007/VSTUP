const {Router} = require('express');
const router = Router();
const {vstup} = require('../db/db.config');

//api/faculties/get
router.get('/get', async (req, res) => {
    try { 
      const response = await vstup.view('_specialties', 'all_faculties',{group:true});    
      if(!response.rows.length){
        throw new Error('Проблема загрузки факультетів!');
      }
      const Faculties = response.rows.map((e)=>{
        return e.key;
      })
      res.json({Faculties});  
    } catch (e) {
      res.status(500).json({ message: e.message||'Щось пішло не так, спробуйте знову!' });
    }
  });  

module.exports = router