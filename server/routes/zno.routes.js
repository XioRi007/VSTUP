const {Router} = require('express');
const router = Router();
const {vstup} = require('../db/db.config');

// /api/zno/get
router.get('/get', async (req, res) => {
    try {    
      const response = await vstup.view("_specialties", "all_zno" , {group:true});  
      const arr = response.rows.map(e => e.key);
      if(!arr.length){
        throw new Error('Проблема загрузки предметов!');
      }
      /*const primary = arr.filter(zno =>  zno.type === 'primary' );   
      const secondary = arr.filter(zno =>  zno.type === 'secondary' );
      const custom = arr.filter(zno =>  zno.type === 'custom' );
      const last = custom.concat(secondary);
      */     
      res.json({Zno:[...arr]});  
    } catch (e) {
      res.status(500).json({ message: e.message||'1Что-то пошло не так, попробуйте снова' });
    }
  })

module.exports = router