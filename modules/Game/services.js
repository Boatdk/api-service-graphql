import Game from '../../models/Game'


const getGameService = ({
  input = {}
}, callback) => {
  const perPage = input.per_page || 10
  const currentPage = (input.current_page > 0 ? input.current_page : 1)
  const gameModel = Game.where('title')
  const countGameModel = Game.where('title')


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

const updateGameService = ({
  input = {}
}, callback) => {
  const game = {
    title: input.game.title,
    shortname: input.game.shortname,
    description: input.game.description,
    link: input.game.link,
    picture_path: input.game.picture_path
  }
  Game.updateOne({
    '_id': input._id
  }, {
    $set: game
  }).then(resultUpdate => {
    if (resultUpdate) {
      Game.findById({
        '_id': input._id
      }).then(dataResult => {
        const result = {
          meta: {
            status: 200,
            message: 'Update successfully'
          },
          data: [dataResult],
          errors: []
        }
        callback(result)
      })
    } else {
      const err = {
        errors: {
          message: 'can not update'
        }
      }
      callback(err)
    }
  })

}

const findGameById = ({
  input = {}
}, callback) => {
  Game.findById({
    '_id': input._id
  }).then(findResult => {
    const result = {
      meta: {
        status: 200,
        message: 'Can get by Id'
      },
      data: [findResult],
      errors: []
    }
    callback(result)
    console.log(result)
  })
}

const deleteGameService = ({
  input = {}
}, callback) => {
  console.log(input._id)
  Game.remove({
    '_id': input._id
  }).then(resultDelete => {
    if (resultDelete) {
      const result = {
        meta: {
          status: 200,
          message: 'delete successfully'
        },
        errors: []
      }
      callback(result)
    } else
        console.log("GGWP")
  })
}

export {
  getGameService,
  createGameService,
  updateGameService,
  findGameById,
  deleteGameService
}