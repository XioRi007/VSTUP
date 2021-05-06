const {Router} = require('express');
const {check, validationResult} = require('express-validator');
const router = Router();
const {vstup, users} = require('../db/db.config');

// /api/applicant/add
router.put(
    '/add',
    [
      check('Email', 'Некорректный email').isEmail(),      
      check('LastName', 'Введіть прізвище').exists(),
      check('FirstName', 'Введіть імя').exists(),
      check('Patronymic', 'Введіть по-батькові').exists(),
      check('PhoneNumber', 'Введіть PhoneNumber').exists()
    ],
    async (req, res) => {
    try {
      const errors = validationResult(req);  
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: 'Некорректні дані!'
        })
      }        
      const {Email, LastName, FirstName, Patronymic, PhoneNumber} = req.body;  
      const candidate = await vstup.view('_applicants', 'id_by_email',{key:Email});     
      if (candidate.rows.length ) {
        return res.status(400).json({ message: 'Такий користувач вже існує' });      }

      const user = {type:'applicant', LastName, FirstName, Patronymic, PhoneNumber,Email};      
  
      const response = await vstup.insert(user);
  
      res.status(201).json({ApplicantId:response.id, message: 'Користувача створено' })
  
    } catch (e) {
      res.status(500).json({ message: 'Щось пішло не так, спробуйте знову!' })
    }
  })
  
  
// /api/applicant/update
router.post(
  '/update',
  [
    check('appId', 'Некорректный id абітурієнта').exists()     
  ],
  async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
        message: 'Некорректні дані!'
      })
    }
    const {appId, doc} = req.body;
    const userDoc = await vstup.view('_applicants', 'doc_by_id',{key:appId});     
    if (!userDoc.rows.length ) {
      return res.status(404).json({ message: 'Такий користувач не існує' });      }

    const newUserDoc = {...userDoc.rows[0].value, ...doc};      

    const response = await vstup.insert(newUserDoc);
    if(!response.ok){
      throw new Error('Помилка оновлення користувача!');} 

    return res.status(200).json({ok:true, message: 'Користувача оновлено!' })    

  } catch (e) {
    res.status(500).json({ message: e.message|| 'Щось пішло не так, спробуйте знову!' })
  }
})


// /api/applicant/document/add
router.put(
  '/document/add',
  [
    check('appId', 'Некорректный id абітурієнта').exists()     
  ],
  async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
        message: 'Некорректні дані!'
      })
    }
    const {appId, doc} = req.body;
    const appDoc = await vstup.view('_applicants', 'doc_by_id',{key:appId});     
    if (!appDoc.rows.length ) {
      return res.status(404).json({ message: 'Такий користувач не існує' });
    }

    
    let newDocuments = [];
    if(appDoc.rows[0].value.Documents != undefined){
      newDocuments = appDoc.rows[0].value.Documents.concat( [doc]);
      }else{
        newDocuments.push(doc);
      }

    const newUserDoc = {...appDoc.rows[0].value, Documents: newDocuments};      

    const response = await vstup.insert(newUserDoc);
    if(!response.ok){
      throw new Error('Помилка оновлення користувача!');    } 

    return res.status(201).json({ok:true, message: 'Документ було створено' })    

  } catch (e) {
    res.status(500).json({ message: e.message|| 'Щось пішло не так, спробуйте знову!' })
  }
})

// /api/applicant/document/delete
router.delete(
  '/document/delete',
  [
    check('appId', 'Некорректный id абітурієнта').exists()     
  ],
  async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
        message: 'Некорректні дані!'
      })
    }
    const {appId, Name} = req.body;
    const appDoc = await vstup.view('_applicants', 'doc_by_id',{key:appId});     
    if (!appDoc.rows.length ) {
      return res.status(400).json({ message: 'Такого користувача не існує' });
    }    
    let newDocuments = appDoc.rows[0].value.Documents;
    newDocuments.forEach((e, i)=>{
    if(e.Name === Name)
      newDocuments.splice(i, 1);
    })
    const newUserDoc = {...appDoc.rows[0].value, Documents: newDocuments};      
    const response = await vstup.insert(newUserDoc);
    if(!response.ok){
      throw new Error('Помилка оновленя користувача');    
    } 
    return res.status(201).json({ok:true, message: 'Документ було створено' });   
  } catch (e) {
    res.status(500).json({ message: e.message|| 'Щось пішло не так, спробуйте знову!' })
  }
})


// /api/applicant/delete
router.delete(
  '/delete',
  [
    check('appId', 'Некорректный id абітурієнта').exists()     
  ],
  async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
        message: 'Некорректні дані!'
      })
    }
    const {appId} = req.body;
    const appRes = await vstup.view('_applicants', 'doc_by_id',{key:appId}); 
    if (!appRes.rows.length ) {
      return res.status(400).json({ message: 'Такого користувача не існує' });
    } 
    const appDoc = appRes.rows[0].value;

    if(appDoc.Applications){
      for (application of appDoc.Applications){
        const specDoc = await vstup.view('_specialties', 'doc_by_id',{key:application.Specialty});
        await vstup.insert({...specDoc.rows[0].value, NumberOfApplications:specDoc.rows[0].value.NumberOfApplications-1});
      }
    }
    const userDoc = await users.view('auth', 'doc_by_email',{key:appDoc.Email});
    if(!userDoc.rows.length){
      res.status(404).json('Користувача не знайдено');      
    }
    await users.destroy(userDoc.rows[0].value._id, userDoc.rows[0].value._rev);
    const response = await vstup.destroy(appDoc._id, appDoc._rev);
    if(!response.ok){
      throw new Error('Помилка видалення користувача');    
    } 
    return res.status(200).json({ok:true, message: 'Користувача видалено!' });   
  } catch (e) {
    res.status(500).json({ message: e.message|| 'Щось пішло не так, спробуйте знову!' })
  }
})

//api/applicant/get/scores/:id
router.get('/get/scores/:id', async (req, res) => {
  try {  
    const appId = req.params.id;
    const response = await vstup.view('_applicants', 'score_by_id',{key:appId});   
    if(!response.rows.length){
      throw new Error(' Помилка загрузки балів абітурієнта!');
    }
    res.json({Zno: response.rows[0].value.Zno, AverageScore: response.rows[0].value.AverageScore});    
  } catch (e) {
    res.status(500).json({ message: e.message||'Щось пішло не так, спробуйте знову!' });
  }
})
//api/applicant/get/zno/:id
router.get('/get/zno/:id', async (req, res) => {
  try {  
    const appId = req.params.id;
    const response = await vstup.view('_applicants', 'zno_by_id',{key:appId});   
    if(!response.rows.length){
      throw new Error(' Помилка загрузки балів абітурієнта!');
    }
    res.json({Zno: response.rows[0].value.Zno});    
  } catch (e) {
    res.status(500).json({ message: e.message||'Щось пішло не так, спробуйте знову!' });
  }
})
//api/applicant/get
router.get('/get/:id', async (req, res) => {
  try {  
    const appId = req.params.id;
    const response = await vstup.view('_applicants', 'doc_by_id',{key:appId});  
    if(!response.rows.length){
      throw new Error(' Помилка загрузки абітурієнта!');
    }
    res.json({appDoc: response.rows[0].value});
  } catch (e) {
    res.status(500).json({ message: e.message||'Щось пішло не так, спробуйте знову!' });
  }
}) 
module.exports = router