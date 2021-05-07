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
      res.json({Zno:[...arr]});  
    } catch (e) {
      res.status(500).json({ message: e.message||'Щось пішло не так, спробуйте знову!' });
    }
  })

module.exports = router