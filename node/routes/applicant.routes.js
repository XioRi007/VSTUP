const {Router} = require('express');
const {check, validationResult} = require('express-validator');
const router = Router();

//const nano = require('nano')('http://admin:1234@localhost:5984');
//если нет такой базы - создать 
//const vstup = nano.db.use('vstup');
const {vstup} = require('../db/db.config');


// /api/applicant/add
router.post(
    '/add',
    [
      check('Email', 'Некорректный email').isEmail(),      
      check('LastName', 'Введіть LastName').exists(),
      check('FirstName', 'Введіть FirstName').exists(),
      check('Patronymic', 'Введіть Patronymic').exists(),
      check('PhoneNumber', 'Введіть PhoneNumber').exists()
    ],
    async (req, res) => {
    try {
      const errors = validationResult(req)
  
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: 'Некорректный данные при регистрации'
        })
      }
        
      const {Email, LastName, FirstName, Patronymic, PhoneNumber} = req.body
  
      const candidate = await vstup.view('_applicants', 'id_by_email',{key:Email});     
      //console.log("candidate", candidate);
      if (candidate.rows.length ) {
//console.log("herre");
        return res.status(400).json({ message: 'Такой пользователь уже существует' });      }

      const user = {type:'applicant', LastName, FirstName, Patronymic, PhoneNumber,Email};      
  
      const response = await vstup.insert(user);
     // console.log(response);
  
      res.status(201).json({ApplicantId:response.id, message: 'Пользователь создан' })
  
    } catch (e) {
      res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
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
        message: 'Некорректный данные при оновленні абітурієнта'
      })
    }
    const {appId, doc} = req.body;
   // console.log("appid", appId);
    const userDoc = await vstup.view('_applicants', 'doc_by_id',{key:appId});     
    //console.log("userDoc", userDoc);
    if (!userDoc.rows.length ) {
      //console.log("herre");
      return res.status(400).json({ message: 'Такой пользователь не существует' });      }

    const newUserDoc = {...userDoc.rows[0].value, ...doc};      

    const response = await vstup.insert(newUserDoc);
    //console.log(response);
    if(!response.ok){
      throw new Error('Ошибка обновления пользователя');    } 

    return res.status(200).json({ok:true, message: 'Пользователь обновлен' })    

  } catch (e) {
    res.status(500).json({ message: e.message|| 'Что-то пошло не так, попробуйте снова' })
  }
})


// /api/applicant/document/add
router.post(
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
        message: 'Некорректный данные при доданні документа'
      })
    }
    const {appId, doc} = req.body;
   // console.log("appid", appId);
    const appDoc = await vstup.view('_applicants', 'doc_by_id',{key:appId});     
    //console.log("userDoc", appDoc);
    if (!appDoc.rows.length ) {
      //console.log("herre");
      return res.status(400).json({ message: 'Такой пользователь не существует' });
    }

    
    let newDocuments = [];
    //console.log(doc);
    if(appDoc.rows[0].value.Documents != undefined){
      newDocuments = appDoc.rows[0].value.Documents.concat( [doc]);
      //console.log(newDocuments);
      }else{
        newDocuments.push(doc);
      }

    const newUserDoc = {...appDoc.rows[0].value, Documents: newDocuments};      

    const response = await vstup.insert(newUserDoc);
    if(!response.ok){
      throw new Error('Ошибка обновления пользователя');    } 

    return res.status(201).json({ok:true, message: 'Документ було створено' })    

  } catch (e) {
    res.status(500).json({ message: e.message|| 'Что-то пошло не так, попробуйте снова' })
  }
})

// /api/applicant/document/delete
router.post(
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
        message: 'Некорректный данные при доданні документа'
      })
    }
    const {appId, Name} = req.body;
   // console.log("appid", appId);
    const appDoc = await vstup.view('_applicants', 'doc_by_id',{key:appId});     
    //console.log("userDoc", appDoc);
    if (!appDoc.rows.length ) {
      //console.log("herre");
      return res.status(400).json({ message: 'Такой пользователь не существует' });
    }

    
    let newDocuments = appDoc.rows[0].value.Documents;
    newDocuments.forEach((e, i)=>{
      if(e.Name === Name)
      newDocuments.splice(i, 1);
    })

    const newUserDoc = {...appDoc.rows[0].value, Documents: newDocuments};      

    const response = await vstup.insert(newUserDoc);
    if(!response.ok){
      throw new Error('Ошибка обновления пользователя');    } 

    return res.status(201).json({ok:true, message: 'Документ було створено' })    

  } catch (e) {
    res.status(500).json({ message: e.message|| 'Что-то пошло не так, попробуйте снова' })
  }
})


//api/applicant/get/scores/:id
router.get('/get/scores/:id', async (req, res) => {
  try {  
    const appId = req.params.id;
    const response = await vstup.view('_applicants', 'score_by_id',{key:appId});    
  
    if(!response.rows.length){
      throw new Error('Проблема загрузки балів абітурієнта!');
    }
    //console.log(response.rows);

    res.json({Score: response.rows[0].value.Score});

  } catch (e) {
    res.status(500).json({ message: e.message||'Что-то пошло не так, попробуйте снова' });
  }
})





//api/applicant/get
router.get('/get/:id', async (req, res) => {
  try {  
    const appId = req.params.id;
    const response = await vstup.view('_applicants', 'doc_by_id',{key:appId});    
  
    if(!response.rows.length){
      throw new Error('Проблема загрузки абітурієнта!');
    }
    //console.log(response.rows[0].value);


    res.json({appDoc: response.rows[0].value});

  } catch (e) {
    res.status(500).json({ message: e.message||'Что-то пошло не так, попробуйте снова' });
  }
})

  

module.exports = router