const express = require("express");
//var cors = require('cors');
const path = require('path')
const PORT = process.env.PORT || 5000;
const {getList} = require('./db/db.create');

const app = express();
//app.use(cors());
app.use(express.json({extended:true}));

app.use("/api/auth", require('./routes/auth.routes'));

app.use("/api/applicant", require('./routes/applicant.routes'));

app.use("/api/zno", require('./routes/zno.routes'));

app.use("/api/specialty", require('./routes/specialties.routes'));

app.use("/api/applications", require('./routes/applications.routes'));

app.use("/api/time", require('./routes/time.routes'));

if (process.env.NODE_ENV === 'production') {
  app.use('/', express.static(path.join(__dirname, 'client', 'build')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  })
}
  getList();



app.listen(PORT, ()=>{
    console.log("Server has been started!");

})
