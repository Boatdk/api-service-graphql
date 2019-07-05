import Game from '../../models/Game'


const getGameService = ({
  input = {}
}, callback) => {
  const perPage = input.per_page || 10
  const currentPage = (input.current_page > 0 ? input.current_page : 1)
  const gameModel = Game.where('title')
  const countGameModel = Game.where('title')
  console.log(gameModel)

  if (input.keyword && input.keyword !== '') {
    const words = input.keyword.split(' ')
    if (words.length <= 1) {
      gameModel.regex(new RegExp(words[0], 'i'))
      countGameModel.regex(new RegExp(words[0], 'i'))
    } else {
      let regxPattern = words.map(word => `(?=.*${word})`).join('')
      regxPattern += '.*'
      gameModel.regex(new RegExp(regxPattern, 'i'))
      countGameModel.regex(new RegExp(regxPattern, 'i'))
    }
  }

  Promise.all([
    gameModel.skip(perPage * (currentPage - 1))
    .sort({
      title: 'asc'
    })
    .limit(perPage)
    .exec(),
    countGameModel.count(),
  ]).then((values) => {
    const docs = values[0]
    const totalDocs = values[1]
    const lastPage = Math.ceil(totalDocs / perPage)
    const result = {
      meta: {
        status: 200,
        message: 'Success',
        total: totalDocs,
        current_page: currentPage,
        per_page: perPage,
        last_page: lastPage,
      },
      data: docs,
      errors: [],
    }
    callback(result)
  }, (errors) => {
    const err = {
      errors: [{
          code: 500,
          message: 'Internal Server Error',
        },
        errors,
      ],
    }
    callback(err)
  })
}


const createGameService = ({
  input = {}
}, callback) => {
  const game = new Game({
    title: input.game.title,
    shortname: input.game.shortname,
    description: input.game.description,
    link: input.game.link,
    picture_path: input.game.picture_path
  })
  Game.findOne({
    'title': game.title,
  }, {
    'shortname': game.shortname
  }).then((gameExisted) => {
    console.log(gameExisted)
    if (gameExisted) {
      if (gameExisted.title == game.title) {
        const err = {
          errors: [{
            code: 203,
            message: 'This Game is on this website'
          }]
        }
        callback(err)
      } else if (gameExisted.shortname == game.shortname) {
        const err = {
          errors: [{
            code: 203,
            message: 'This shortname is already used'
          }]
        }
        callback(err)
      }
    } else {
      game.save((saveErr, saveResult) => {
        if (saveResult) {
          const result = {
            meta: {
              status: 201,
              message: 'Create Game Successfully.',
            },
            data: [saveResult],
            errors: [],
          }
          callback(result)
        } else {
          const err = {
            errors: [{
              code: saveErr.status,
              message: saveErr.message,
            }, ],
          }
          callback(err)
        }
      })
    }
  })

}

export {
  getGameService,
  createGameService,
}