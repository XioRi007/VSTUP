

const {nano} = require('../db/db.config');

const getList = async ()=>{
    try{

    
    const res = await nano.db.list();
    if(res.length>2) return;

    await nano.db.create('vstup');
    await nano.db.create('users');
    await nano.db.create('tools');
    


    const tools = nano.db.use('tools');
    await tools.insert(
        {
          "_id": "_design/time",
          "views": {
           "time": {
            "map": "function (doc) {\n  if(doc.type === \"time\"){\n    emit(null, doc.time);\n  }\n  \n  \n}"
           },
           "doc": {
            "map": "function (doc) {\n  if(doc.type === \"time\"){\n    emit(doc._id, doc)\n  }\n}"
           }
          },
          "language": "javascript"
         });
    await tools.insert({
            "_id": "5b57f5939217c730f2554a7e1d041573",
            "type": "time",
            "time": false
           });



    const vstup = nano.db.use('vstup');

    await vstup.insert({
        "_id": "_design/_applicants",
        "views": {
            "doc_by_id": {
                "map": "function (doc) {if (doc.type === \"applicant\"){emit(doc._id, doc);}}"
               },   
            "id_by_email": {
                "map": "function (doc) {\n  if(doc.type === 'applicant'){\n    emit(doc.Email, doc._id);\n  }\n}"
               },
            "score_by_id": {
                "map": "function (doc) {\n  if(doc.type === \"applicant\"){\n    emit(doc._id, {Score: doc.Score});\n  }\n}"
               }
        },
        "language": "javascript"
       });

    await vstup.insert({
        "_id": "_design/_applications",
        "language": "javascript",
        "views": {
         "all_by_specialty_ranking": {
          "map": "function(doc) {\n    if (doc.type === \"applicant\" && doc.Applications){\n      for(let i = 0; i<doc.Applications.length; i++){    \n        emit([doc.Applications[i].Specialty, doc.Applications[i].RankingScore], {LastName : doc.LastName, FirstName: doc.FirstName, Patronymic: doc.Patronymic, RankingScore : doc.Applications[i].RankingScore, Submitted : doc.Applications[i].Submitted});    \n      }\n    }  \n}"
         },
         "all_by_specialty_ranking_submit": {
          "map": "function(doc) {\n    if (doc.type === \"applicant\" && doc.Applications){\n      for(let i = 0; i<doc.Applications.length; i++){\n        emit([doc.Applications[i].Specialty,  doc.Applications[i].Submitted, doc.Applications[i].RankingScore], {LastName : doc.LastName, FirstName: doc.FirstName, Patronymic: doc.Patronymic, RankingScore : doc.Applications[i].RankingScore, Submitted : doc.Applications[i].Submitted});    \n      }\n    }  \n}"
         }
        }
       });

    await vstup.insert( 
        {
           "_id": "_design/_specialties",
           "views": {
            "all_by_popularity": {
                "map": "function(doc) {\n    if (doc.type === \"specialty\"){\n        emit(doc.NumberOfApplications, doc);    \n    }  \n}\n"
               },
               "all_faculties": {
                "reduce": "function (keys, values, rereduce) {\n  return true;\n}",
                "map": "function (doc) {\n  if(doc.type === \"specialty\"){\n    emit(doc.Faculty, null);\n    }\n}"
               },
               "doc_by_id": {
                "map": "function (doc) {\n  if(doc.type === \"specialty\"){\n    emit(doc._id, doc);\n  }\n}"
               },
               "rev_by_id": {
                "map": "function (doc) {\n  if(doc.type === \"specialty\"){\n    emit(doc._id, doc._rev);\n  }\n}"
               },
               "all_zno": {
                "reduce": "function (keys, values, rereduce) {\n  return true;\n}",
                "map": "function (doc) {\n  if(doc.type === 'specialty'){\n    doc.Zno.forEach((i)=>{\n      emit(i, null);\n    });\n  }\n}"
               },
               "name_code_by_id": {
                "map": "function (doc) {\n  if(doc.type === \"specialty\"){\n    emit(doc._id, {Name: doc.Name, Code: doc.SpecialtyCode});\n  }\n}"
               },
               "id_by_name": {
                "map": "function (doc) {\n  if(doc.type === 'specialty'){\n    emit(doc.Name, doc._id);\n  }\n}"
               },
               "all_by_faculty_name": {
                "map": "function(doc) {\n    if (doc.type === \"specialty\"){\n      emit([doc.Faculty, doc.Name], doc);\n    }  \n}"
               }
           },
           "language": "javascript"
          });

    await vstup.insert(
        {
           "_id": "9eca0a31ca6be6383715d723b600e982",
           "type": "specialty",
           "SpecialtyCode": "121",
           "Name": "Програмна інженерія",
           "Faculty": "Математичний",
           "Zno": [
            {
             "name": "Українська мова та література",
             "type": "primary"
            },
            {
             "name": "Математика",
             "type": "secondary"
            },
            {
             "name": "Фізика",
             "type": "custom"
            },
            {
             "name": "Англійська мова",
             "type": "custom"
            }
           ],
           "MaxNumberOfStudents": 50,
           "NumberOfApplications": 2,
           "IndustryCoefficient": 1
          });

          await vstup.insert({
            "_id": "09217f93920419d85676e862d1004949",
            "type": "applicant",
            "LastName": "Барнаш",
            "FirstName": "Марія",
            "Patronymic": "Iванівна",
            "PhoneNumber": "0982543586",
            "Email": "maria@ukr.net",
            "Score": {
             "Zno1": {
              "name": "Українська мова та література",
              "score": 194
             },
             "Zno2": {
              "name": "Математика",
              "score": 183
             },
             "Zno3": {
              "name": "Англійська мова",
              "score": 186
             },
             "AverageScore": 195
            },
            "Documents": [
             {
              "Name": "Паспорт",
              "Series": "AP",
              "Number": "78887787",
              "DateOfIssue": "18-08-2020",
              "IssuingAuthority": "4897"
             }
            ],
            "Applications": [
             {
              "Specialty": "9eca0a31ca6be6383715d723b600e982",
              "RankingScore": 188.4,
              "Submitted": false
             },
             {
              "Specialty": "9eca0a31ca6be6383715d723b600efca",
              "RankingScore": 192.168,
              "Submitted": false
             }
            ]
           });
          await vstup.insert(
            {
              "_id": "09217f93920419d85676e862d1005562",
              "type": "applicant",
              "LastName": "Іванов",
              "FirstName": "Іван",
              "Patronymic": "Iванович",
              "PhoneNumber": "0984543506",
              "Email": "ivan@ukr.net",
              "Score": {
               "Zno1": 184,
               "Zno2": 192,
               "Zno3": 183,
               "AverageScore": 195
              },
              "Applications": [
               {
                "Specialty": "9eca0a31ca6be6383715d723b600e982",
                "RankingScore": 190,
                "Submitted": false
               },
               {
                "Specialty": "9eca0a31ca6be6383715d723b600efca",
                "RankingScore": 189,
                "Submitted": false
               }
              ]
             });
          await vstup.insert({
            "_id": "5b57f5939217c730f2554a7e1d000143",
            "type": "applicant",
            "LastName": "ivanov",
            "FirstName": "ivan",
            "Patronymic": "ivanovich",
            "PhoneNumber": "30",
            "Email": "ivan@i.com",
            "Score": {
             "Zno1": {
              "name": "Українська мова та література",
              "score": 200
             },
             "Zno2": {
              "name": "Історія України",
              "score": 100
             },
             "Zno3": {
              "name": "Англійська мова",
              "score": 187
             },
             "Zno4": {
              "name": "Німецька мова",
              "score": 179
             },
             "AverageScore": 200
            },
            "Applications": [
             {
              "Specialty": "9eca0a31ca6be6383715d723b600fcfa",
              "RankingScore": 166.1,
              "Submitted": false
             }
            ]
           });
           await vstup.insert(
            {
              "_id": "5b57f5939217c730f2554a7e1d022f8b",
              "type": "applicant",
              "LastName": "qq",
              "FirstName": "qq",
              "Patronymic": "qq",
              "PhoneNumber": "101",
              "Email": "qw@q.com",
              "Score": {
               "Zno1": {
                "name": "Українська мова та література",
                "score": 100
               },
               "Zno2": {
                "name": "Математика",
                "score": 100
               },
               "Zno3": {
                "name": "Англійська мова",
                "score": 100
               },
               "Zno4": {
                "name": "Історія України",
                "score": 100
               },
               "AverageScore": 200
              },
              "Applications": [
               {
                "Specialty": "9eca0a31ca6be6383715d723b600efca",
                "RankingScore": 112.2,
                "Submitted": false
               },
               {
                "Specialty": "9eca0a31ca6be6383715d723b600fcfa",
                "RankingScore": 110,
                "Submitted": false
               }
              ],
              "Documents": []
             });

             await vstup.insert(
                {
                  "_id": "5b57f5939217c730f2554a7e1d027968",
                  "type": "specialty",
                  "SpecialtyCode": "77",
                  "Name": "77",
                  "Faculty": "Іноземної філології",
                  "Zno": [
                   {
                    "name": "Українська мова та література",
                    "type": "primary"
                   },
                   {
                    "name": "Історія України",
                    "type": "secondary"
                   },
                   {
                    "name": "Англійська мова",
                    "type": "custom"
                   },
                   {
                    "name": "Німецька мова",
                    "type": "custom"
                   }
                  ],
                  "MaxNumberOfStudents": "077",
                  "NumberOfApplications": 0,
                  "IndustryCoefficient": 1
                 });
             await vstup.insert(
                {
                  "_id": "5b57f5939217c730f2554a7e1d0342d4",
                  "type": "specialty",
                  "SpecialtyCode": "test",
                  "Name": "test",
                  "Faculty": "Математичний",
                  "Zno": [
                   {
                    "name": "Українська мова та література",
                    "type": "primary"
                   },
                   {
                    "name": "Математика",
                    "type": "secondary"
                   },
                   {
                    "name": "Фізика",
                    "type": "custom"
                   },
                   {
                    "name": "Англійська мова",
                    "type": "custom"
                   }
                  ],
                  "MaxNumberOfStudents": 100,
                  "NumberOfApplications": 1,
                  "IndustryCoefficient": 1
                 }
                );
             await vstup.insert(

                {
                  "_id": "5b57f5939217c730f2554a7e1d0355dc",
                  "type": "specialty",
                  "SpecialtyCode": "22",
                  "Name": "Середня освіта",
                  "Faculty": "Іноземної філології",
                  "Zno": [
                   {
                    "name": "Українська мова та література",
                    "type": "primary"
                   },
                   {
                    "name": "Історія України",
                    "type": "secondary"
                   },
                   {
                    "name": "Англійська мова",
                    "type": "custom"
                   },
                   {
                    "name": "Німецька мова",
                    "type": "custom"
                   }
                  ],
                  "MaxNumberOfStudents": 101,
                  "NumberOfApplications": 0,
                  "IndustryCoefficient": 1.1
                 });
             await vstup.insert(
                {
                  "_id": "90689d83f70630dd77e44a3186018cf1",
                  "type": "applicant",
                  "LastName": "7",
                  "FirstName": "7",
                  "Patronymic": "7",
                  "PhoneNumber": "7",
                  "Email": "q3@q.com",
                  "Score": {
                   "Zno1": {
                    "name": "Українська мова та література",
                    "score": 100
                   },
                   "Zno2": {
                    "name": "Математика",
                    "score": 100
                   },
                   "Zno3": {
                    "name": "Англійська мова",
                    "score": 100
                   },
                   "Zno4": {
                    "name": "Історія України",
                    "score": 100
                   },
                   "AverageScore": 100
                  },
                  "Documents": [
                   {
                    "Name": "d",
                    "Series": "d",
                    "Number": "11",
                    "DateOfIssue": "2021-04-01",
                    "IssuingAuthority": "d"
                   },
                   {
                    "Name": "777",
                    "Series": "77",
                    "Number": "7777",
                    "DateOfIssue": "2021-04-03",
                    "IssuingAuthority": "77"
                   }
                  ],
                  "Applications": [
                   {
                    "Specialty": "9eca0a31ca6be6383715d723b600e982",
                    "RankingScore": 100,
                    "Submitted": false
                   },
                   {
                    "Specialty": "5b57f5939217c730f2554a7e1d0342d4",
                    "RankingScore": 157.9,
                    "Submitted": false
                   }
                  ]
                 }
                );
                
                await vstup.insert(
                    {
                     "_id": "9eca0a31ca6be6383715d723b600efca",
                     "type": "specialty",
                     "SpecialtyCode": "111",
                     "Name": "Математика ",
                     "Faculty": "Математичний",
                     "Zno": [
                      {
                       "name": "Українська мова та література",
                       "type": "primary"
                      },
                      {
                       "name": "Математика",
                       "type": "secondary"
                      },
                      {
                       "name": "Фізика",
                       "type": "custom"
                      },
                      {
                       "name": "Англійська мова",
                       "type": "custom"
                      }
                     ],
                     "MaxNumberOfStudents": 15,
                     "NumberOfApplications": 26,
                     "IndustryCoefficient": 1.02
                    });
                await vstup.insert(

                    {
                      "_id": "9eca0a31ca6be6383715d723b600fcfa",
                      "type": "specialty",
                      "SpecialtyCode": "035.041",
                      "Name": "Філологія (Мова і література (англійська)",
                      "Faculty": "Іноземної філології",
                      "Zno": [
                       {
                        "name": "Українська мова та література",
                        "type": "primary"
                       },
                       {
                        "name": "Історія України",
                        "type": "secondary"
                       },
                       {
                        "name": "Німецька мова",
                        "type": "custom"
                       },
                       {
                        "name": "Англійська мова",
                        "type": "custom"
                       }
                      ],
                      "MaxNumberOfStudents": 100,
                      "NumberOfApplications": 24,
                      "IndustryCoefficient": 1
                     });


    

         
  
    const users = nano.db.use('users');
    await users.insert({
        "_id": "_design/auth",
        "views": {
         "doc_by_email": {
          "map": "function (doc) {\n  emit(doc.Email, doc);\n}"
         }
        },
        "language": "javascript"
    });

    await users.insert({
        "_id": "90689d83f70630dd77e44a3186000a7b",
        "type": "admin",
        "Email": "admin@admin.com",
        "Password": "$2y$12$oATcmHuE8lFK2jR2GaK6cOADStTI0WF9J6JM3tjAERhSeoCRE2Rxq"
       });
       await users.insert({
        "_id": "5b57f5939217c730f2554a7e1d000f1d",
        "Email": "ivan@i.com",
        "Password": "$2a$12$0GR05jDrc/h42Lwr1G08GOvhyeVKdF7mg8KwpIUdbbGsyc3ZqVek6",
        "ApplicantId": "5b57f5939217c730f2554a7e1d000143"
       }
      );
       await users.insert({
        "_id": "5b57f5939217c730f2554a7e1d023d40",
        "Email": "qw@q.com",
        "Password": "$2a$12$OSr7zg.R8Tjdzlf9pqyE/ewboCm42PlAnqGMpHT/IVo9GkTtztEny",
        "ApplicantId": "5b57f5939217c730f2554a7e1d022f8b"
       }
      );
       await users.insert(

        {
          "_id": "90689d83f70630dd77e44a3186000670",
          "type": "applicant",
          "Email": "email@e.com",
          "Password": "$2y$12$oATcmHuE8lFK2jR2GaK6cOADStTI0WF9J6JM3tjAERhSeoCRE2Rxq",
          "ApplicantId": "09217f93920419d85676e862d1004949"
         });
       await users.insert(
        {
          "_id": "90689d83f70630dd77e44a3186019989",
          "Email": "q3@q.com",
          "Password": "$2a$12$pmv7AYlEIPojMwpazatZmO6ZyQVbGLKsjFobrvGtIOiNvUrOf60TW",
          "ApplicantId": "90689d83f70630dd77e44a3186018cf1"
         });

    }catch(e){
        console.log(e);
    }
}

module.exports ={ getList}