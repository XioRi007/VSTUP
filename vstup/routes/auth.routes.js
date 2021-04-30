const {Router} = require('express');
const bcrypt = require('bcryptjs');
const {check, validationResult} = require('express-validator');
const router = Router();


const {users} = require('../db/db.config');

// /api/auth/login
router.post(
  '/login/',
  [
    check('Email', 'Введите корректный email').normalizeEmail().isEmail(),
    check('Password', 'Введите пароль').exists()
  ],
  async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
        message: 'Некорректные данные при входе в систему'
      })
    }

    //console.log(req.body);

    const {Email, Password} = req.body

    const user = await users.view('auth', 'doc_by_email',{key:Email});   

    if (!user.rows.length) {
      return res.status(400).json({ message: 'Пользователь не найден' })
    }
    //console.log(user.rows[0].value);

    const isMatch = await bcrypt.compare(Password, user.rows[0].value.Password)

    if (!isMatch) {
      return res.status(400).json({ message: 'Неверный пароль, попробуйте снова' })
    }
   
    if(user.rows[0].value.type === 'admin'){
        res.json({ userId: 'admin' });
    }else{       

        res.json({ userId: user.rows[0].value.ApplicantId });
    }    

  } catch (e) {
    res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
  }
})


// /api/auth/register
router.post(
    '/register',
    [
      check('Email', 'Некорректный email').isEmail(),
      check('Password', 'Минимальная длина пароля 6 символов')
        .isLength({ min: 6 })
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
  
      const {Email, Password, ApplicantId} = req.body;      
  
      const candidate = await users.view('auth', 'doc_by_email',{key:Email}); 
      //console.log(candidate);  
  
      if (candidate.rows.length) {
        return res.status(400).json({ message: 'Такой пользователь уже существует' });
      }

      const hashedPassword = await bcrypt.hash(Password, 12);

      const user = { Email, Password: hashedPassword, ApplicantId };
  
      const response = await users.insert(user);
      //console.log(response);
  
      res.status(201).json({ ok:true, message: 'Пользователь создан' })
  
    } catch (e) {
      res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
    }
  })
  
  

module.exports = router