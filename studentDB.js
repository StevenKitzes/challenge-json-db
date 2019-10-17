const fs = require('fs')
const _ = require('lodash')

module.exports = {
    retrieveStudentProperty,
    writeStudentProperty,
    removeStudentProperty
}

function retrieveStudentProperty(studentID, propertyPath, callback) {
    const filePath = `./data/${studentID}.json`
    fs.readFile(filePath, (err, data) => {
        if(err && err.code && err.code === 'ENOENT') {
            return callback(404)
        }

        const student = JSON.parse(data)
        const property = _.get(student, propertyPath)
        callback(null, property)
    })
}

function writeStudentProperty(studentID, propertyPath, updatedProperty, callback) {
    const filePath = `./data/${studentID}.json`
    fs.readFile(filePath, (err, data) => {
        if(err.code !== 'ENOENT') return callback(err)

        const student = JSON.parse(data || '{}')

        if(propertyPath === '') {       // Case for root level modification
            _.assign(student, updatedProperty)
            writeStudentFile(filePath, student, callback)
            return
        }

        const destinationObject = _.get(student, propertyPath)
        if(destinationObject === undefined) {   // Case for new property level
            _.set(student, propertyPath, updatedProperty)
        }
        else {  // Case for adding or modifying at existing property level
            const key = Object.keys(updatedProperty)
                .filter(key => updatedProperty.hasOwnProperty(key))[0]
            destinationObject[key] = updatedProperty[key]
        }
        writeStudentFile(filePath, student, callback)    })
}

function removeStudentProperty(studentID, propertyPath, callback) {
    const filePath = `./data/${studentID}.json`
    fs.readFile(filePath, (err, data) => {
        if(err && err.code && err.code === 'ENOENT') {
            return callback(404)
        }

        const student = JSON.parse(data)
        if(_.get(student, propertyPath) === undefined) {
            return callback(404)
        }
        _.unset(student, propertyPath)
        writeStudentFile(filePath, student, callback)
    })
}

function writeStudentFile(filePath, student, callback) {
    fs.writeFile(filePath, JSON.stringify(student), (err) => {
        if(err) return callback(err)
        return callback(null)
    })
}