import { context } from './context'

console.log('text')

let lectures = []

let parseInput = (e) => {
  e.preventDefault()
  const data = new FormData(e.target)
  console.log(data)

  const parsedData = evaluateData(data)
  console.log(parsedData)
  if (parsedData['is_valid']) {
    lectures.push(data)
    renderTable()
  }

}

let evaluateData = (inputData) => {
  const parsedData = {}
  parsedData['is_valid'] = true
  parsedData['lecture_name'] = inputData.get('lecture_name')
  parsedData['ects'] = Number.parseInt(inputData.get('ects'))
  parsedData['amount_weeks'] = Number.parseInt(inputData.get('amount_weeks'))

  if (isNaN(parsedData["ects"])) {
    console.log("1 not valid")
    parsedData['is_valid'] = false
  } else if (isNaN(parsedData["amount_weeks"])) {
    console.log("2 not valid")
    parsedData['is_valid'] = false
  } else if (typeof parsedData['lecture_name']  !== 'string') {
    console.log("3 not valid")
    parsedData['is_valid'] = false
  }

  return parsedData
}

let calcTime = (ects, amount_weeks, amount_lectures, expense_per_ects = 30) => {
  let amount_time_for_lectures = amount_lectures * 90
  return ((ects * expense_per_ects / amount_weeks) * 60 - amount_time_for_lectures) / 60
}

let renderTable = () => {
  clearTable()
  let table = document.getElementById('table')
  lectures.forEach(lecture => {
    let row = table.insertRow(-1)
    row.insertCell().innerText = lecture.get('lecture_name')
    row.insertCell().innerText = lecture.get('ects')
    row.insertCell().innerText = lecture.get('amount_weeks')
    row.insertCell().innerText = 0

  })
}

let deleteTable = () => clearTable(true)

let clearTable = (deleteItems = false) => {
  var tableHeaderRowCount = 1
  var table = document.getElementById('table')
  var rowCount = table.rows.length
  for (var i = tableHeaderRowCount; i < rowCount; i++) {
    table.deleteRow(tableHeaderRowCount)
  }
  if (deleteItems) {
    lectures = []
  }
}

const form = document.querySelector('form')
form.addEventListener('submit', parseInput)

document.getElementById('clearButton').addEventListener('click', deleteTable)
