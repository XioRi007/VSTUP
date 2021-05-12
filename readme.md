# Вступ
Вступ - інформаційна система, розроблена в рамках курсової роботи з дисципліни "Бази даних".
[Текст ссылки](#Скріншоти)
### Автори
Роботу виконала студентка 2 курсу математичного факультету гр. 6.1219-1пі Барнаш Марія

Науковий керівник: Лісняк А.О.

### Предметна область 
При вступі до ВНЗ абітурієнт подає документи на певні спеціальності певних факультетів, кількість заявок обмежена. Оригінал документу на підставі якого відбувається вступ може бути покладений у діло тільки однієї спеціальності, після чого абітурієнт вже майже зможе називатися студентом. Вступ відбувається за балами сертифікатів ЗНО та середнім балом атестата, що будуть певним чином зведеними в конкурсний бал. Автоматично формуються звіти з популярності спеціальностей (за кількістю поданих заявок) та формуються рейтинги абітурієнтів (в залежності від конкурсного балу). Максимальна кількість студентів на кожній спеціальності є обмеженою. Також контролюється ЗНО абітурієнта, адже подати заяву можна лише маючи бали з предметів, визначених спеціальністю.

### У роботі було використано
* [CouchDB](https://couchdb.apache.org/)
* [Node.js](https://nodejs.org/uk/)
* [React](https://ru.reactjs.org/)
* [Docker](https://www.docker.com/)

### Інсталяція
Для початку роботи ви повинні завантажити вихідний код проекту. Для цього ви можете:
* завантажити код з GitHub (кнопка Code та Download ZIP);
* клонувати проект в необхідну директорію (`git clone https://github.com/XioRi007/VSTUP.git`).

Тепер необхідно запустити проект. Перед цим впевніться, що у вас встановлено [Docker](https://www.docker.com/).
Для управління проектом в кореневій папці використовуйте наступні команди:
* для збірки проекту: `docker-compose build`;
* для запуску: `docker-compose up`;
* для запинення: `docker-compose stop`.

Після запуску контейнера вам будуть доступні:
* база даних CouchDB на порту 5984 (для доступу до GUI перейдіть на сторінку localhost:5984/_utils)
* сервер на порту 5000
* клієнтська частина на порту 3000

### Необхідно знати перед початком роботи
* дані для роботи з базою даних: логін: admin, пароль: 1234;
* пароль до всіх акаунтів абітурієнтів та адміністраторів - 123456;
* декілька тестових акаунтів для роботи з додатком:
    * абітурієнти: email1@ukr.net, email2@ukr.net, email3@ukr.net;
    * адміністратори: admin1@ukr.net, admin2@ukr.net.

### Функції додатку
Ви зможете:
* авторизовуватися в системі як абітурієнт чи адміністратор, або залишитися гостем;
* як гість: 
    * створювати нових абітурієнтів;
    * переглядати списки факультетів та спеціальностей на цих факультетах;
    * переглядати список всіх спеціальностей за рейтингом (кількістю поданих заяв)
* як абітурієнт: 
    * змінювати персональну інформацію;
    * додавати та оновлювати бали (ЗНО та середній бал атестата);
    * додавати та видаляти документи;
    * додавати та видаляти заяви на спеціальності (при цьому контролються ЗНО), (недоступно, якщо:
        * не додані бали;
        * подано максимальну кількість заяв;
        * закрито подачу заяв);
    * підтверджувати заяви (тільки одну заяву і тільки після закриття часу подачі);
    * всі функції гостя;
* як адміністратор: 
    * змінювати максимальну кількість заяв;
    * закривати/відкривати подачу заяв;
    * додавати та оновлювати спеціальності (в рамках цього ви зможете додавати нові ЗНО та факультети);
    * всі функції гостя.
### Скріншоти
Перше, що ви побачите - це головна сторінка.
![MainPage](//placehold.it/150x100)
Сторінка авторизації
![MainPage](//placehold.it/150x100)
Створення нового абітурієнта
