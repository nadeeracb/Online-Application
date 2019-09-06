import getDataFromSupport from './scripts/support';

function getData() {
  Logger.log('Hello world VS CODE');
}

global.getData = getData;
global.getDataFromSupport = getDataFromSupport;
