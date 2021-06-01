const folderId = '1BLtZBeoCTxYNDqQRr3d79o90FLO2A37l';
const folder = DriveApp.getFolderById(folderId);

function initSpreadSheet(e) {
  param = JSON.parse(e);
  Logger.log(param);

  const sheetName = param.sheetName;
  const isSheetExist = getFile(sheetName);

  if (isSheetExist) {
    Logger.log('sheet name %s already exist', sheetName);
    return result('false');
  }

  // create sheet
  const sheetId = createSheet(sheetName);
  Logger.log('create spreadsheet %s:%s', sheetName, sheetId);

  // create worksheet
  createWorkSheet(sheetId);
  Logger.log('create worksheet');

  // record sheet
  recordSheet(sheetId, sheetName, param.user);
  Logger.log('record sheet');

  return result('success');
}

function createSheet(e) {
  const sheetName = e;
  const newSheet = SpreadsheetApp.create(sheetName);
  const sheetId = newSheet.getId();
  const sheet = DriveApp.getFolderById(sheetId);
  
  // move sheet to spesific folder
  sheet.moveTo(folder);

  return sheetId;
}

function createWorkSheet(e) {
  const sheetId = e;
  const sheet = SpreadsheetApp.openById(sheetId);
  const sheetNames = [ '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', 'SUM' ];

  for (i = 0; i < sheetNames.length; i++) {
    sheet.insertSheet(sheetNames[i]);
  }
}

function getFile(e) {
  const files = folder.getFiles();
  while(files.hasNext()) {
    const file = files.next();
    if (file == e) {
      return true;
    }
  }
  return false;
}

function recordSheet(id, sheetName, user) {
  const sheetId = '1yX1mrYyL87YyOruWDtegkgbz64JndXHK8sGsFRh7IPk';
  const sheet = SpreadsheetApp.openById(sheetId).getSheetByName('M_SHEET');
  
  const now = new Date();
  const data = [id, sheetName, now, user];
  sheet.appendRow(data);
}

function result(e) {
  const resp = { result: e };
  return ContentService.createTextOutput(JSON.stringify(resp)).setMimeType(ContentService.MimeType.JSON);
}

function test() {
  const param = { sheetName: '2022', user: 'usertest' };
  initSpreadSheet(JSON.stringify(param));
}
