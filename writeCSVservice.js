const fs = require('fs');
const dir = 'employees'
const files = fs.readdirSync(dir)
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const tasks = []


const csvWriter = createCsvWriter({
    path: 'Employees_Report.csv',
    header: [
        { id: 'name', title: 'Name' },
        { id: 'date', title: 'Date' },
        { id: 'exit', title: 'Exit' },
        { id: 'entrance', title: 'Entrance' },
        { id: 'total', title: 'Total' }
    ],
    append: true
});

getDoc()

function getDoc() {
    for (const file of files) {
        let task = (function (file) {
            return getJSONFileData('./employees/' + file)
        })(file)

        tasks.push(task)
    }

    while (tasks.length > 0) {
        writeToFile(tasks[0])
        tasks.shift()
    }

}

async function writeToFile(res) {

    await csvWriter.writeRecords(res)
    console.log('The CSV file was written successfully');
}


function getJSONFileData(filename) {
    const fileData = fs.readFileSync(filename, 'utf-8').split('\n')
    fileData.shift()
    fileData.pop()
    let arr = []

    let employeeName = filename.slice(12, -4)

    fileData.forEach(str => {
        let access = str.slice(20, -2)
        if (access === 'Access granted') {
            let date = str.slice(0, 10)
            let time = str.slice(11, 19)

            arr.push({ name: employeeName, date, time, access })
        }

    })

    return getReport(arr, employeeName)
}



function getReport(data, employeeName) {
    const newarr = {}
    data.forEach(el => {
        if (newarr[el.date]) newarr[el.date].push(el.time)
        else {
            newarr[el.date] = []
            newarr[el.date].push(el.time)
        }
    }
    )

    let dates = Object.keys(newarr)
    let table = []


    dates.forEach(date => {
        let entrance = newarr[date][0]
        let exit = newarr[date][newarr[date].length - 1]
        let diffSec = (toSeconds(exit) - toSeconds(entrance))
        if (diffSec > 2700) diffSec -= 2700
        let HH = Math.floor(diffSec / 3600);
        let MM = Math.floor(Math.floor((diffSec - (HH * 3600)) / 60));
        MM = MM >= 10 ? MM : '0' + MM
        let time = `${HH}:${MM}`
        table.push({ name: employeeName, date, entrance, exit, total: time })

    });

    return table
}

function toSeconds(time_str) {

    var parts = time_str.split(':');

    return parts[0] * 3600 +
        parts[1] * 60

}


