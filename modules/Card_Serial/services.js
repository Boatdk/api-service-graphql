import Card_serial from '../../models/Card_serial'
import Card from '../../models/Card';

const getSerialService = ({
  input = {}
}, callback) => {
  const perPage = input.per_page || 10
  const currentPage = (input.current_page > 0 ? input.current_page : 1)
  const cardSerialModel = Card_serial.where('title')
  const countcardSerialModel = Card_serial.where('title')


  if (input.keyword && input.keyword !== '') {
    const words = input.keyword.split(' ')
    if (words.length <= 1) {
      cardSerialModel.regex(new RegExp(words[0], 'i'))
      countcardSerialModel.regex(new RegExp(words[0], 'i'))
    } else {
      let regxPattern = words.map(word => `(?=.*${word})`).join('')
      regxPattern += '.*'
      cardSerialModel.regex(new RegExp(regxPattern, 'i'))
      countcardSerialModel.regex(new RegExp(regxPattern, 'i'))
    }
  }

  Promise.all([
    cardSerialModel.skip(perPage * (currentPage - 1))
    .sort({
      title: 'asc'
    })
    .limit(perPage)
    .exec(),
    countcardSerialModel.count(),
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

const createSerialService = ({
  input = {}
}, callback) => {
  const serial = new Card_serial({
    serial: input.serial.serial,
    pin: input.serial.pin,
    price: input.serial.price
  })
  Card_serial.findOne({
    'serial': serial.serial
  }, {
    'pin': serial.pin
  }).then(cardSerialExisted => {
    if (cardSerialExisted) {
      if (cardSerialExisted.serial == serial.serial) {
        const err = {
          errors: [{
            message: 'This serial is already in database'
          }]
        }
        callback(err)
      } else if (cardSerialExisted.pin == serial.pin) {
        const err = {
          errors: [{
            message: 'This pin is already in database'
          }]
        }
        callback(err)
      }
    } else {
      serial.save((saveErr, saveResult) => {
        if (saveResult) {
          const result = {
            meta: {
              status: 201,
              message: 'Create Card_Serial successfully'
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

const updateSerialService = ({ input = {}}, callback) => {
  var serial_data 
  var serial = input.serial.serial
  var pin = input.serial.pin
  var price = input.serial.price

  if(serial == undefined && pin == undefined && price == undefined){
    console.log("bad input")
  }else if(pin == undefined && price == undefined){
    serial_data = {
      serial: serial
    }
  } else if(serial == undefined && price == undefined){
    serial_data = {
      pin: pin
    }
  } else if(serial == undefined && pin == undefined){
    serial_data = {
      price: price
    }
  } else {
    serial_data = {
      serial: serial,
      pin: pin,
      price: price
    }
  }
  
  Card_serial.updateOne({'_id': input._id}, {$set: serial_data}).then(updateResult => {
    if(updateResult){
      Card_serial.findById({
        '_id': input._id
      }).then(dataResult => {
        console.log(dataResult)
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
          message: "Can not update"
        }]
      }
      callback(err)
    }
  })
}

export {
  getSerialService,
  createSerialService,
  updateSerialService
}