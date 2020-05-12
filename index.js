const fs = require('fs')
const xlsx = require('xlsx')
const moment = require('moment')
const parse = require('csv-parse/lib/sync')
const stringify = require('csv-stringify/lib/sync')

const DATA_DIR = 'data';
const OUTPUT_DIR = 'output';
const INPUT_FILE_EXT = '.xlsx'
const OUTPUT_FILE_EXT = '.csv'

function toptal2xero(toptalRow) {
  return {
    'Date': moment(toptalRow['Transaction date'], 'MM-DD-YYYY HH:mm:ss').format('DD/MM/YYYY'),
    'Amount': toptalRow['Amount'],
    'Payee': '',
    'Description': toptalRow['Description'],
    'Reference': toptalRow['Id'],
    'Cheque Number': ''
  }
}

fs.readdirSync(DATA_DIR).forEach(filename => {
  if (filename.toLowerCase().endsWith(INPUT_FILE_EXT)) {

    // Read in file
    const file = xlsx.readFile(`${__dirname}/${DATA_DIR}/${filename}`)
    const csv = xlsx.utils.sheet_to_csv(file.Sheets[file.SheetNames[0]])
    console.log(`Discovered ${filename}`)

    // Parse the CSV
    let rows = parse(csv, {
      columns: true,
      skip_empty_lines: true
    })

    // Transform
    rows = rows.map(row => toptal2xero(row))
    console.log(`Transformed ${filename}`)

    // Output to file
    const csvString = stringify(rows, {
      header: true
    })
    const outputFilename = `${filename.substring(0, filename.length - INPUT_FILE_EXT.length)}${OUTPUT_FILE_EXT}`
    fs.writeFileSync(`${__dirname}/${OUTPUT_DIR}/${outputFilename}`, csvString)
    console.log(`Wrote ${outputFilename}`);

  }
});
