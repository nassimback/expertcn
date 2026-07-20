import path from 'node:path'
import { FileBlob, SpreadsheetFile } from '@oai/artifact-tool'

const workspace = 'C:/Users/Nassim/Documents/expertcn 5.6'
const inputPath = path.join(workspace, 'Categorisation_Produits_ExpertCN_v4.xlsx')
const input = await FileBlob.load(inputPath)
const workbook = await SpreadsheetFile.importXlsx(input)

const overview = await workbook.inspect({
  kind: 'table',
  range: "'Produits variables — Specs'!A4:D50",
  maxChars: 12000,
  tableMaxRows: 50,
  tableMaxCols: 4,
  tableMaxCellChars: 200,
})
console.log('VARIANTES')
console.log(overview.ndjson)
