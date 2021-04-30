docker build -t couchdb .
docker run --name couch  --rm  -v path/couchdb/data:/opt/couchdb/data -d -p 5984:5984 couchdb
path - ваш путь к этой !скопированной! папке (например D:/Univer), предполагается что в папку Univer вы скопировали эту папку couchdb
не удаляйте файлы с папки couchdb - тут содержатся настройки
если меняете порт, меняйте его и в проекте, папка db файл db.config
