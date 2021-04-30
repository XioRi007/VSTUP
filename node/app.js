const express = require("express");
const path = require('path')
const PORT = process.env.PORT || 5000;
const {getList} = require('./db/db.create');

const app = express();
app.use(express.json({extended:true}));
app.get('/', (req, res) => {
  res.send('Hello World!')
});
app.use("/api/auth", require('./routes/auth.routes'));

app.use("/api/applicant", require('./routes/applicant.routes'));

app.use("/api/zno", require('./routes/zno.routes'));

app.use("/api/specialty", require('./routes/specialties.routes'));

app.use("/api/applications", require('./routes/applications.routes'));

app.use("/api/time", require('./routes/time.routes'));

getList();

app.listen(PORT, ()=>{
    console.log("Server has been started!");

})
