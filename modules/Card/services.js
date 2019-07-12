import Card from '../../models/Card'

const getCardService = ({
  input = {}
}, callback) => {
  const perPage = input.per_page || 10
  const currentPage = (input.current_page > 0 ? input.current_page : 1)
  const cardModel = Card.where('title')
  const countCardModel = Card.where('title')


  if (input.keyword && input.keyword !== '') {
    const words = input.keyword.split(' ')
    if (words.length <= 1) {
      cardModel.regex(new RegExp(words[0], 'i'))
      countCardModel.regex(new RegExp(words[0], 'i'))
    } else {
      let regxPattern = words.map(word => `(?=.*${word})`).join('')
      regxPattern += '.*'
      cardModel.regex(new RegExp(regxPattern, 'i'))
      countCardModel.regex(new RegExp(regxPattern, 'i'))
    }
  }

  Promise.all([
    cardModel.skip(perPage * (currentPage - 1))
    .sort({
      title: 'asc'
    })
    .limit(perPage)
    .exec(),
    countCardModel.count(),
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

const createCardService = ({
  input = {}
}, callback) => {
  const card = new Card({
    name: input.card.name,
    description: input.card.description,
    price: input.card.price
  })
  Card.findOne({
    'name': card.name
  }).then((cardExisted) => {
    if (cardExisted) {
      const err = {
        errors: [{
          message: 'This card is already on website'
        }]
      }
      callback(err)
    } else {
      card.save((saveErr, saveResult) => {
        console.log(saveResult)
        if (saveResult) {
          const result = {
            meta: {
              status: 201,
              message: 'Create Card Successfully'
            },
            data: [saveResult],
            errors: []
          }
          callback(result)
        } else {
          const err = {
            errors: [{
              code: saveErr.status,
              message: saveErr.message
            }]
          }
          callback(err)
        }
      })
    }
  })


}

const updateCardService = ({
  input = {}
}, callback) => {
  var card
  var name = input.card.name
  var description = input.card.description
  var price = input.card.price

  if (name == undefined && description == undefined && price == undefined) {
    console.log("BAD")
  } else if (description == undefined && price == undefined) {
    card = {
      name: name
    }
  } else if (name == undefined && price == undefined) {
    card = {
      description: description
    }
  } else if (name == undefined && description == undefined) {
    card = {
      price: price
    }
  } else {
    card = {
      name: name,
      description: description,
      price: price
    }
  }
  Card.updateOne({
    '_id': input._id
  }, {
    $set: card
  }).then(resultUpdate => {
    if (resultUpdate) {
      Card.findById({
        '_id': input._id
      }).then(dataResult => {
        const result = {
          meta: {
            status: 201,
            message: 'Update successfully'
          },
          data: [dataResult],
          err: []
        }
        callback(result)
      })
    } else {
      const err = {
        errors: [{
          message: 'Can not update'
        }]
      }
      callback(err)
    }
  })
}

const findCardById = ({
  input = {}
}, callback) => {
  Card.findById({
    '_id': input._id
  }).then(findResult => {
    if (findResult) {
      const result = {
        meta: {
          status: 200,
          message: 'Can get by Id'
        },
        data: [findResult],
        errors: []
      }
      callback(result)
    } else {
      const err = [{
        errors: {
          message: 'Can not get by Id',
          code: 404
        }
      }]
      callback(err)
    }
  })
}

const deleteCardService = ({ input = {} }, callback) => {
    Card.remove({ '_id': input._id }).then(resultDelete => {
      if(resultDelete){
        const result = {
          meta: {
            status: 200,
            message: 'Delete successfully'
          },
          errors: []
        }
        callback(result)
      }else {
        console.log("GGWP")
      }
    })
}


export {
  getCardService,
  createCardService,
  findCardById,
  updateCardService,
  deleteCardService
}