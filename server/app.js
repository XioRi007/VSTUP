const express = require("express");
const PORT = process.env.PORT || 5000;
const app = express();
app.use(express.json({extended:true}));
app.get('/', function(req, res) {
  res.send('hello world');
});
app.use("/api/auth", require('./routes/auth.routes'));
app.use("/api/applicant", require('./routes/applicant.routes'));
app.use("/api/zno", require('./routes/zno.routes'));
app.use("/api/faculties", require('./routes/faculties.routes'));
app.use("/api/specialty", require('./routes/specialties.routes'));
app.use("/api/applications", require('./routes/applications.routes'));
app.use("/api/tools", require('./routes/tools.routes'));

app.listen(PORT, ()=>{
    console.log("Server has been started on port", PORT);
})
