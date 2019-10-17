const {
  retrieveStudentProperty,
  writeStudentProperty,
  removeStudentProperty
} = require('./studentDB')
const _ = require('lodash')

module.exports = {
  getHealth,
  getStudentProperty,
  putStudentProperty,
  deleteStudentProperty
}

async function getHealth (req, res, next) {
  res.json({ success: true })
}

function getStudentProperty(req, res, next) {
  const studentID = req.params.studentID
  const propertyPath = req.params[0].split('/').filter(p => p !== '').join('.')

  retrieveStudentProperty(studentID, propertyPath, (err, property) => {
      if(err === 404 || property === undefined) return next()
      if(err) return next(err)
      res.status(200).json(property)
  })
}

function putStudentProperty(req, res, next) {
  const studentID = req.params.studentID
  const urlPath = req.params[0] || ''
  const propertyPath = urlPath.split('/').filter(p => p !== '').join('.')
  
  if(_.isEmpty(req.body)) return res.status(400).send()

  writeStudentProperty( studentID, propertyPath, req.body, (err) => {
      if(err) return next(err)
      res.status(204).send()
  })
}

function deleteStudentProperty(req, res, next) {
  const studentID = req.params.studentID
  const propertyPath = req.params[0].split('/').filter(p => p !== '').join('.')

  removeStudentProperty(studentID, propertyPath, (err) => {
      if(err === 404) return next()
      if(err) return next(err)
      res.status(204).send()
  })
}