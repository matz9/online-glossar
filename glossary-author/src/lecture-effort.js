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
    lectures.push(parsedData)
    renderTable()
  }

  renderSumLectureEffort()

}

let evaluateData = (inputData) => {
  const parsedData = {}
  parsedData['is_valid'] = true
  parsedData['lecture_name'] = inputData.get('lecture_name')
  parsedData['ects'] = Number.parseInt(inputData.get('ects'))
  parsedData['amount_weeks'] = Number.parseInt(inputData.get('amount_weeks'))

  if (isNaN(parsedData["ects"])) {
    console.log("field ects not valid")
    parsedData['is_valid'] = false
  } else if (isNaN(parsedData["amount_weeks"])) {
    console.log("field 'amount weeks' not valid")
    parsedData['is_valid'] = false
  } else if (typeof parsedData['lecture_name']  !== 'string') {
    console.log("field 'lecture_name' not valid")
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
    row.insertCell().innerText = lecture['lecture_name']
    row.insertCell().innerText = lecture['ects']
    row.insertCell().innerText = lecture['amount_weeks']
    row.insertCell().innerText = calcTime(lecture["ects"], lecture["amount_weeks"], 1)

  })
}

let clearTable = () => {
  var tableHeaderRowCount = 1
  var table = document.getElementById('table')
  var rowCount = table.rows.length
  for (var i = tableHeaderRowCount; i < rowCount; i++) {
    table.deleteRow(tableHeaderRowCount)
  }
}

let deleteTable = () => {
  lectures = []
  clearTable()
}

let renderSumLectureEffort = (result) => {
  let sumEcts = lectures.reduce((x,y) => x + y["ects"], 0)
  let maxAmountWeeks = lectures.reduce((x,y) => Math.max(x, y["amount_weeks"]), 0)
  console.log(sumEcts, maxAmountWeeks)
  let sumLectureEffort = calcTime(sumEcts, maxAmountWeeks, lectures.length)

  let text = document.getElementById('result')
  text.innerText = "Aufwand pro Woche: " + sumLectureEffort
}


const form = document.querySelector('form')
form.addEventListener('submit', parseInput)

document.getElementById('clearButton').addEventListener('click', deleteTable)
