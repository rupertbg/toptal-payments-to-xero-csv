const fs = require('fs')
const xlsx = require('xlsx')
const moment = require('moment')
const parse = require('csv-parse/lib/sync')
const stringify = require('csv-stringify/lib/sync')

const DATA_DIR = 'data';
const OUTPUT_DIR = 'output';
const INPUT_FILE_EXT = '.xlsx'
const OUTPUT_FILE_EXT = '.csv'

function convertRow(row, amount, description) {
  return {
    'Date': moment(row['Transaction date'], 'MM-DD-YYYY HH:mm:ss').format('DD/MM/YYYY'),
    'Amount': amount,
    'Payee': '',
    'Description': description,
    'Reference': row['Id'],
    'Cheque Number': ''
  }
}

function toptal2xero(rows) {
  let xeroRows = []
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i]
    // Ignore zero-rated items
    if (!parseFloat(row['Fee']) && !parseFloat(row['Amount']) && !parseFloat(row['Total'])) continue

    // Transactions with fees
    if (parseFloat(row['Amount']) && parseFloat(row['Fee'])) {
      xeroRows.push(convertRow(row, row['Amount'], row['Description']))
      xeroRows.push(convertRow(row, row['Fee'], `${row['Description']} - Fee`))
    }

    // Transactions without fees
    if (parseFloat(row['Amount']) && !parseFloat(row['Fee'])) xeroRows.push(convertRow(row, row['Amount'], row['Description']))

    // Standalone fees
    if (!parseFloat(row['Amount']) && parseFloat(row['Fee'])) xeroRows.push(convertRow(row, row['Fee'], row['Description']))
  }

  return xeroRows
}

fs.readdirSync(DATA_DIR).forEach(filename => {
  if (filename.toLowerCase().endsWith(INPUT_FILE_EXT)) {
    console.log(`----------------------`)
    console.log(`${filename}`)

    try {
      // Read in file
      const file = xlsx.readFile(`${__dirname}/${DATA_DIR}/${filename}`)
      const csv = xlsx.utils.sheet_to_csv(file.Sheets[file.SheetNames[0]])

      // Parse the CSV
      let rows = parse(csv, {
        columns: true,
        skip_empty_lines: true
      })

      // Transform
      rows = toptal2xero(rows)
      console.log(`  - Transformed`)

      // Output to file
      const csvString = stringify(rows, {
        header: true
      })
      const outputFilename = `${filename.substring(0, filename.length - INPUT_FILE_EXT.length)}${OUTPUT_FILE_EXT}`
      fs.writeFileSync(`${__dirname}/${OUTPUT_DIR}/${outputFilename}`, csvString)
      console.log(`  - Wrote CSV`);
    } catch (e) {
      console.error('  - Error')
      if (e.message) console.error(`  - ${e.message}`)
    }
  }
});

console.log(`----------------------`)
