## GRAPHQL 
* [General info](#general-info)
* [Technologies](#Technologies)
* [Installation](#installation)
* [Features](#features)

## General info
This is graphql api with mongodb.We can use basic api in this code.

## Technologies
Project is created with:
* node version: 10.15.3
* npm  version: 6.4.1

## Installation
install modules using npm
```
$ npm install 
```
run project using this command
```
$ npm run dev
```

## Features
#### Type this in your graphql
Query data from database using
```js
query{
  games{
    data{
      _id
      title
      shortname
      description
      link
      picture_path
      created_at
    }
    meta{
      status
      message
    }
    errors{
      message
    }
  }
}
```
Mutation data into database using
```js
mutation{
  createGame(
    input:{
      game:{
        title: "Ragnarok xx Online Mobile Ethernal Lovesx55111",
      	shortname: "ROM",
        description: "Good game to play",
        link: "www.rom.in.th",
        picture_path: "sa13swqe13Weqs12"
      }
    }
  ) {
    data{
      _id
      title
      shortname
      description
      link
      picture_path
      created_at
    }
    errors{
      message
    }
    meta{
      status
      message
    }
  }
}
```