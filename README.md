[![Tests](https://github.com/yandex-praktikum/express-mesto-gha/actions/workflows/tests-13-sprint.yml/badge.svg)](https://github.com/yandex-praktikum/express-mesto-gha/actions/workflows/tests-13-sprint.yml) [![Tests](https://github.com/yandex-praktikum/express-mesto-gha/actions/workflows/tests-14-sprint.yml/badge.svg)](https://github.com/yandex-praktikum/express-mesto-gha/actions/workflows/tests-14-sprint.yml)
# Проект Mesto фронтенд + бэкенд



## Настройка бейджей статуса тестов
Перед началом работы над проектом рекомендуется исправить бейджи, отражающие статус прохождения тестов.
Для этого замените разметку бейджей на следующий фрагмент, подставив вместо `${имя_пользователя}` и `${имя_репозитория}` соответствующие значения.

```
[![Tests for sprint 13](https://github.com/${имя_пользователя}/${имя репозитория}/actions/workflows/tests-13-sprint.yml/badge.svg)](https://github.com/${имя_пользователя}/${имя репозитория}/actions/workflows/tests-13-sprint.yml) 

[![Tests for sprint 14](https://github.com/${имя_пользователя}/${имя репозитория}/actions/workflows/tests-14-sprint.yml/badge.svg)](https://github.com/${имя_пользователя}/${имя репозитория}/actions/workflows/tests-14-sprint.yml)
```


## Директории

`/routes` — папка с файлами роутера  
`/controllers` — папка с файлами контроллеров пользователя и карточки   
`/models` — папка с файлами описания схем пользователя и карточки  
  
Остальные директории вспомогательные, создаются при необходимости разработчиком

## Запуск проекта

`npm run start` — запускает сервер   
`npm run dev` — запускает сервер с hot-reload
## Функционал:

### Роуты для пользователей: 

* GET /users - возвращает всех пользователей; 
* GET /users/:userId - возвращает пользователя по переданному _id; 
* POST /users - создает пользователя с переданными в теле запроса name, about и avatar;

### Роуты для карточек:

* GET /cards - возвращает все карточки из базы данных; 
* POST /cards - создаёт карточку с переданными в теле запроса name и link. *owner проставляется посредством временного мидлвэра (добавляет в каждый запрос объект user)*; 
* DELETE /cards/:cardId - удаляет карточку по переданному _id; 

## Технологии:

* expressjs
* API REST 
* MongoDB 
* RegExp 

## Инструкция по установке:

Клонировать репозиторий:

* `git clone https://github.com/MelnikovAleksei/express-mesto.git`

В директории проекта запустить приложение в режиме разработки:

* `npm install` - устанавливает зависимости; 
* `npm run dev` - запускает сервер; 
* `npm run start` - запускает сервер с hot-reload;

## Будущая доработка проекта будет включать в себя создание роутов:

* PATCH /users/me - обновляет профиль; 
* PATCH /users/me/avatar - обновляет аватар; 
* PUT /cards/:cardId/likes - поставить лайк карточке; 
* DELETE /cards/:cardId/likes - убрать лайк с карточки; 

## Языки:

* JavaScript
* RegExp 

## Библиотеки:

* expressjs

## База данных: 

* MongoDB (сопоставитель Mongoose)
