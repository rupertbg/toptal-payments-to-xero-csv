const fs = require('fs')
const moment = require('moment')
const parse = require('csv-parse/lib/sync')
const stringify = require('csv-stringify/lib/sync')

const DATA_DIR = 'data';
const OUTPUT_DIR = 'output';
const FILE_EXT = '.csv'

function toptal2xero(toptalRow) {
  let xeroRow = {}
  xeroRow['Date'] = moment(toptalRow['Transaction date'], 'MM-DD-YYYY HH:mm:ss').format('DD/MM/YYYY')
  xeroRow['Amount'] = toptalRow['Amount']
  xeroRow['Payee'] = ''
  xeroRow['Description'] = toptalRow['Description']
  xeroRow['Reference'] = toptalRow['Id']
  xeroRow['Cheque Number'] = ''
  return xeroRow
}

fs.readdirSync(DATA_DIR).forEach(filename => {
  if (filename.toLowerCase().endsWith(FILE_EXT)) {

    // Read in file
    const file = fs.readFileSync(`${__dirname}/${DATA_DIR}/${filename}`)
    console.log(`Discovered ${filename}`)

    // Parse the CSV
    let rows = parse(file, {
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
    fs.writeFileSync(`${__dirname}/${OUTPUT_DIR}/${filename}`, csvString)
    console.log(`Wrote ${filename}`);

  }
});
