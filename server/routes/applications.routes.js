const {Router} = require('express');
const {check, validationResult} = require('express-validator');
const router = Router();
const {vstup} = require('../db/db.config');


///api/applications/get/submitted/:id/:limit
router.get('/get/submitted/:id/:limit', async (req, res) => {
  try {  
    const spId = req.params.id;
    let limit = req.params.limit;    
    if(typeof limit != Number) limit=500;    
    const resSub = await vstup.view('_applications', 'submitted_by_specialty_ranking',{descending:true, endkey:[spId, "100"], startkey:[spId, "200",{}], limit:limit || 500});
    const resBeyondSub = await vstup.view('_applications', 'submitted_by_specialty_ranking',{descending:true, endkey:[spId, "100"], startkey:[spId, "200",{}], skip:limit || 500});
    
    const resNotSub = await vstup.view('_applications', 'not_submitted_by_specialty_ranking',{descending:true, endkey:[spId,  "100"], startkey:[spId, "200",{}], limit:limit || 500});      
      
    const submitted = resSub.rows.map((e,i)=>{
      return {...e.value}
    }); 
    const submittedBeyondLimits = resBeyondSub.rows.map((e,i)=>{
      return {...e.value}
    }); 
    const unsubmitted = resNotSub.rows.map((e,i)=>{
      return {...e.value}
    }); 
    const Applications = submitted.concat(submittedBeyondLimits).concat(unsubmitted);   
    res.json({Applications });
  } catch (e) {
    res.status(500).json({ message: e.message||'Щось пішло не так, спробуйте знову!' });
  }
});
///api/applications/get/:id
router.get('/get/:id', async (req, res) => {
  try {  
    const spId = req.params.id;    
    const response = await vstup.view('_applications', 'all_by_specialty_ranking',{descending:true, endkey:[spId, "100"], startkey:[spId, "200",{}]});   
    if(!response.rows.length){
      return res.json({Applications : []});
    }
    const Applications = response.rows.map((e,i)=>{
      return {...e.value}
    })
    res.json({Applications : Applications});
  } catch (e) {
    res.status(500).json({ message: e.message||'Щось пішло не так, спробуйте знову!' });
  }
});
// /api/applications/add
router.put(
    '/add',[     
      check('appId', 'Ви маєте бути авторизовані').exists(),
      check('specialtyId', 'Оберіть спеціальність').exists(),
      check('Zno', 'Оберіть бали ЗНО').exists()],
    async (req, res) => {
    try {
      const errors = validationResult(req);  
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: "Некорректный данные при створенні заяви"
        })
      }        
      const {appId, specialtyId, Zno} = req.body;  
      const specRes = await vstup.view('_specialties', 'doc_by_id',{key:specialtyId});     
      const specDoc = specRes.rows[0].value;
      let results = [];
      Zno.forEach((e, i)=>{
          specDoc.Zno.forEach((zno, i)=>{
            if (zno.name === e.name)
            results.push(zno.type);            
          });          
      });
      if (!(results.indexOf('primary')!=-1 && results.indexOf('secondary')!=-1 && results.indexOf('custom')!=-1)){
        throw new Error('Введіть коректні бали ЗНО!');  
      }        
      const appRes = await vstup.view('_applicants', 'doc_by_id',{key:appId});    
      if(!appRes.rows.length){
        throw new Error('Помилка отримання абітурієнта');
      }
            
      const appDoc = appRes.rows[0].value;
       if(appDoc.Applications!=undefined){          
         appDoc.Applications.forEach((e, i)=>{
            if(e.Specialty === specialtyId){
              throw new Error('Ви вже подали заяву на цю спеціальність!');
            }
         })
      }
      let score = ((Zno[0].score + Zno[1].score + Zno[2].score)*0.3 + (0.1*appDoc.AverageScore))*specDoc.IndustryCoefficient;  
      if(score>200) score=200;
      if(!Number.isInteger(score)) {
        score = score.toFixed(6);
      }
      const response = await vstup.insert({...specDoc, NumberOfApplications:specDoc.NumberOfApplications+1});
      if(!response.ok)          
       throw new Error('Помилка спеціальності');
      let newApplications = [];
      if(appDoc.Applications != undefined){
        newApplications = appDoc.Applications.concat( [{Specialty: specialtyId, RankingScore: score.toString(), Submitted:false}]);
      }else{
        newApplications.push({Specialty: specialtyId, RankingScore: score.toString(), Submitted:false});
       }
      const updRes = await vstup.insert({...appDoc, Applications: newApplications});
      if(updRes.ok)
        return res.status(201).json({ok: true, message:'Заява створена!'});  
    } catch (e) {
      res.status(500).json({ message: e.message || 'Щось пішло не так, спробуйте знову!' })
    }
  })
  


  // /api/applications/submit
router.post(
  '/submit',
  [     
    check('appId', 'Ви маєте бути авторизовані').exists(),
    check('specialtyId', 'Оберіть спеціальність').exists()    
  ],
  async (req, res) => {
  try {
    const errors = validationResult(req);  
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
        message: "Некорректні дані"
      })
    }        
    const {appId, specialtyId} = req.body;  
    const specRes = await vstup.view('_specialties', 'doc_by_id',{key:specialtyId});    
    if(!specRes.rows.length) {
      throw new Error('Помилка отримання спеціальності');
    }
    const specDoc = specRes.rows[0].value;
    const appRes = await vstup.view('_applicants', 'doc_by_id',{key:appId});    
    if(!appRes.rows.length){
          throw new Error('Помилка отримання абітурієнта');
    }          
    const appDoc = appRes.rows[0].value;      
      
    appDoc.Applications.forEach((e,i)=>{
      if(e.Specialty === specialtyId){
        e.Submitted = true
      }
    })
    const updRes = await vstup.insert({...appDoc});
    if(updRes.ok)
     return res.status(201).json({ok: true, message:'Заява оновлена!'});    
  } catch (e) {
    res.status(500).json({ message: e.message || 'Щось пішло не так, спробуйте знову!' })
  }
})

//  /api/applications/delete
router.delete(
  '/delete',
  [
    check('appId', 'Некорректный id абітурієнта').exists(),
    check('specId', 'Некорректный id спеціальності').exists()       
  ],
  async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
        message: 'Некорректні дані при оновленні абітурієнта'
      })
    }
    const {appId, specId} = req.body;
    const userDoc = await vstup.view('_applicants', 'doc_by_id',{key:appId});     
    if (!userDoc.rows.length) {
      return res.status(400).json({ message: 'Такий користувач не існує' });      }
    let newApplications = userDoc.rows[0].value.Applications;
    newApplications.forEach((e, i)=>{
      if(e.Specialty === specId)
      newApplications.splice(i, 1);
    })
    const newUserDoc = {...userDoc.rows[0].value, Applications: newApplications};      
    const response = await vstup.insert(newUserDoc);
    if(!response.ok){
      throw new Error('Помилка оновлення');} 
    const specRes = await vstup.view('_specialties', 'doc_by_id',{key:specId}); 
    if(!specRes.rows.length)          
      throw new Error('Помилка спеціальності');
    const specDoc = specRes.rows[0].value;
    const spRes2 = await vstup.insert({...specDoc, NumberOfApplications:specDoc.NumberOfApplications-1});
      if(!spRes2.ok)          
        throw new Error('Помилка спеціальності');
    return res.status(200).json({ok:true, message: 'Заява видалена' })   

  } catch (e) {
    res.status(500).json({ message: e.message|| 'Щось пішло не так, спробуйте знову!' })
  }
})




module.exports = router
