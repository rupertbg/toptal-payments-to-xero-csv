# Toptal Payments XLSX -> Xero CSV
Quickly convert your Toptal Payments transaction files into Xero format so you can do your accounting.

## Setup
Needs [Node.js](https://nodejs.org/) then run `npm i` to install the dependencies, which are:
  - [moment](https://momentjs.com/)
  - [xlsx](https://github.com/SheetJS/sheetjs)
  - [csv-parse](https://csv.js.org/parse/)
  - [csv-stringify](https://csv.js.org/stringify/)

## Usage
  1. Put your XLSX files from Toptal Payments in the `data` directory
  2. Run `node index.js`
  3. Import the files in the `output` directory into Xero!
