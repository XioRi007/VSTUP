const {Router} = require('express');
const {check, validationResult} = require('express-validator');
const router = Router();
const {vstup} = require('../db/db.config');

// /api/zno/get
router.get('/get', async (req, res) => {
    //console.log('herre');
    try {  
  
      const response = await vstup.view("_specialties", "all_zno" , {group:true});     
      
      const arr = response.rows.map(e => e.key);
      if(!arr.length){
        throw new Error('Проблема загрузки предметов!');
      }


      const primary = arr.filter(zno =>  zno.type === 'primary' );   
      const secondary = arr.filter(zno =>  zno.type === 'secondary' );
      const custom = arr.filter(zno =>  zno.type === 'custom' );
      const last = custom.concat(secondary);
      //console.log(primary, secondary, custom);

      res.json({primary, secondary, custom, last})
  
    } catch (e) {
      res.status(500).json({ message: e.message||'1Что-то пошло не так, попробуйте снова' });
    }
  })
  
  

module.exports = router