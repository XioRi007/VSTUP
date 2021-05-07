const {Router} = require('express');
const router = Router();

const {tools} = require('../db/db.config');

// /api/tools/time/change
router.post('/time/change', async (req, res) => {
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
      res.status(500).json({ message: e.message||'Щось пішло не так, спробуйте знову!' });
    }
  })
  
  
// /api/tools/time/
router.get('/time', async (req, res) => {
    //console.log('herre');
    try { 
      const response = await tools.view("time", "time"); 
        
      if(!response.rows.length){
        throw new Error('Проблема загрузки часу!');
      }

      res.json({ok:true, time:response.rows[0].value});
  
    } catch (e) {
      res.status(500).json({ message: e.message||'Щось пішло не так, спробуйте знову!' });
    }
  })

  
// /api/tools/maxnum/change
router.post('/maxnum/change', async (req, res) => {
  try { 
    const {maxnum} = req.body;      
    const numDoc = await tools.view("maxNumberOfApplications", "doc");       
    if(!numDoc.rows.length){
      throw new Error('Проблема загрузки максимальної кількості заяв!');
    }
    const response = await tools.insert({...numDoc.rows[0].value, maxNumberOfApplications:maxnum });
    if(!response.ok)
      throw new Error('Проблема оновлення часу!');
    res.json({ok:true, maxnum});

  } catch (e) {
    res.status(500).json({ message: e.message||'Щось пішло не так, спробуйте знову!' });
  }
})


// /api/tools/maxnum/
router.get('/maxnum', async (req, res) => {
  try { 
    const response = await tools.view("maxNumberOfApplications", "maxnum"); 
      
    if(!response.rows.length){
      throw new Error('Проблема загрузки максимальної кількості заяв!');
    }

    res.json({ok:true, maxNumberOfApplications: Number(response.rows[0].value)});

  } catch (e) {
    res.status(500).json({ message: e.message||'Щось пішло не так, спробуйте знову!' });
  }
})
  
  
module.exports = router