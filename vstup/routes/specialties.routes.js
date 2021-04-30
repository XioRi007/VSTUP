const {Router} = require('express');
const {check, validationResult} = require('express-validator');
const router = Router();

const {vstup} = require('../db/db.config');

//для сравнения
///api/specialty/get/name_code/id
router.get('/get/name_code/:id', async (req, res) => {
  try {  
    const spId = req.params.id;
    const response = await vstup.view('_specialties', 'name_code_by_id',{key:spId});      
    if(!response.rows.length){
      throw new Error('Проблема загрузки спеціальності!');
    }
    res.json({...response.rows[0].value});
  } catch (e) {
    res.status(500).json({ message: e.message||'Что-то пошло не так, попробуйте снова' });
  }
});
//получить факультеті - переенести

//api/specialty/get/faculties
router.get('/get/faculties', async (req, res) => {
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
    res.status(500).json({ message: e.message||'Что-то пошло не так, попробуйте снова' });
  }
});


//по факультету
//api/specialty/get/specialty/:faculty
router.get('/get/specialty/:faculty', async (req, res) => {
  try {  
    const faculty = req.params.faculty;
    const response = await vstup.view('_specialties', 'all_by_faculty_name',{endkey:[faculty, {}], startkey:[faculty]});    
    //console.log(faculty);
      
    if(!response.rows.length){
      throw new Error('Проблема загрузки спеціальності!');
    }
   // console.log(response.rows);
    const Specialties = response.rows.map((e)=>{
      return {...e.value, id: e.id};
    })

    res.json({Specialties});

  } catch (e) {
    res.status(500).json({ message: e.message||'Что-то пошло не так, попробуйте снова' });
  }
});




//api/specialty/get/all
router.get('/get/all', async (req, res) => {
  try {  
    const response = await vstup.view('_specialties', 'all_by_popularity',{descending:true}); 
    if(!response.rows.length){
      throw new Error('Проблема загрузки спеціальності!');
    }
    const Specialties = response.rows.map((e)=>{
      return {...e.value};
    })
    res.json({Specialties});
  } catch (e) {
    res.status(500).json({ message: e.message||'Что-то пошло не так, попробуйте снова' });
  }
});



//api/specialty/get/:id
router.get('/get/:id', async (req, res) => {
  try {  
    //console.log('here131');
    const id = req.params.id;   
    const response = await vstup.view('_specialties', 'doc_by_id',{key:id});   
    if(!response.rows.length){
      throw new Error('Проблема загрузки спеціальності!');
    } 
    return res.json({Specialty: {...response.rows[0].value}});
  } catch (e) {
    res.status(500).json({ message: e.message||'Что-то пошло не так, попробуйте снова' });
  }
});

// /api/specialty/update
router.post(
  '/update',
  [
    check('specId', 'Введіть код ').exists()       
  ],
  async (req, res) => {
  try {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
        message: errors.message
      })
    }
      
    const {specId, Specialty} = req.body;
    //console.log(Specialty);

    const candidate = await vstup.view('_specialties', 'doc_by_id',{key:specId});   
    //console.log(candidate);
    if (!candidate.rows.length ) {
      return res.status(400).json({message: 'Така спеціальність не існує'});
    }

   
    const response = await vstup.insert({...candidate.rows[0].value, ...Specialty});
   // console.log(response);

    res.status(201).json({ok:true, message: 'Спеціальність оновлена'})

  } catch (e) {
    res.status(500).json({ message: e.message || 'Что-то пошло не так, попробуйте снова' })
  }
})



// /api/specialty/add
router.post(
  '/add',
  [
    check('SpecialtyCode', 'Введіть код ').exists(),      
    check('Name', 'Введіть назву').exists(),
    check('Faculty', 'Введіть факультет').exists(),
    check('MaxNumberOfStudents', 'Введіть максимальну кількість студентів').exists(),
    check('IndustryCoefficient', 'Введіть коеффіціент').exists()
  ],
  async (req, res) => {
  try {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
        message: errors.message
      })
    }
      
    const Specialty = req.body;
    //console.log(Specialty);

    const candidate = await vstup.view('_specialties', 'id_by_name',{key:Specialty.Name});   
    //console.log(candidate);
    if (candidate.rows.length ) {
      return res.status(400).json({ message: 'Така спеціальність вже існує' });
    }

   
    const response = await vstup.insert(Specialty);
   // console.log(response);

    res.status(201).json({ok:true, message: 'Спеціальність створена' })

  } catch (e) {
    res.status(500).json({ message: e.message || 'Что-то пошло не так, попробуйте снова' })
  }
})
  



// /api/specialty/delete
router.delete(
  '/delete',
  [
    check('Specialty', 'Оберіть спеціальність').exists()   
  ],
  async (req, res) => {
  try {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
        message: errors.message
      })
    }
      
    const {Specialty} = req.body;

    const candidate = await vstup.view('_specialties', 'rev_by_id',{key:Specialty});   
    //console.log(candidate);
    if (!candidate.rows.length ) {
      return res.status(400).json({ message: 'Така спеціальність не існує' });
    }
   
    const response = await vstup.destroy(candidate.rows[0].id, candidate.rows[0].value);
   // console.log(response);
   if(!response.ok){
    return res.status(400).json({ message: 'Помилка видалення спеціальності!' });
   }
    

    res.status(201).json({ok:true, message: 'Спеціальність видалена' })

  } catch (e) {
    res.status(500).json({ message: e.message || 'Что-то пошло не так, попробуйте снова' })
  }
})
  

module.exports = router