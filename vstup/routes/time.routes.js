const {Router} = require('express');
const {check, validationResult} = require('express-validator');
const router = Router();

const {tools} = require('../db/db.config');

// /api/time/change
router.post('/change', async (req, res) => {
    //console.log('herre');
    try { 
      const {time} = req.body;
        
      const timeDoc = await tools.view("time", "doc"); 
        
      if(!timeDoc.rows.length){
        throw new Error('Проблема загрузки часу!');
      }
      const response = await tools.insert({...timeDoc.rows[0].value, time });
      if(!response.ok)
        throw new Error('Проблема оновлення часу!');
      res.json({ok:true, time});
  
    } catch (e) {
      res.status(500).json({ message: e.message||'Что-то пошло не так, попробуйте снова' });
    }
  })
  
  
// /api/time/
router.get('/', async (req, res) => {
    //console.log('herre');
    try { 
      const response = await tools.view("time", "time"); 
        
      if(!response.rows.length){
        throw new Error('Проблема загрузки часу!');
      }

      res.json({ok:true, time:response.rows[0].value});
  
    } catch (e) {
      res.status(500).json({ message: e.message||'Что-то пошло не так, попробуйте снова' });
    }
  })
  
  
module.exports = router