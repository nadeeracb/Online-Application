const ERROR_EMAIL = 'youremail@sci.pdn.ac.lk';
const TIME_ZONE = 'Asia/Colombo';
const DATE_FORMAT = 'MM/dd/yyyy HH:mm:ss';
const UUID_FORMAT = 'MMddyyyyHHmmss';
const APP_NAME = 'Sample App Name';
const ALIASMAIL = 'nadeerab@sci.pdn.ac.lk';
const UUID_CODE = 'LM';

const DBID = '1bQnEJqblQ5U4hwq-QdFDjNXqtrLzBWjeVrTqtPwfNMk';
const SHEET = 'leave-logs';
const APP_ROLE = 'roles';

let cKey = null;
let chunks = [];

class Utils {
  static ChunkyCache(cache, chunkSize) {
    return {
      put(key, value, timeout) {
        const json = JSON.stringify(value);
        const cSize = Math.floor(chunkSize / 2);
        let index = 0;
        while (index < json.length) {
          cKey = `${key}_${index}`;
          chunks.push(cKey);
          cache.put(cKey, json.substr(index, cSize), timeout + 5);
          index += cSize;
        }

        const superBlk = {
          chunkSize,
          chunks,
          length: json.length
        };
        cache.put(key, JSON.stringify(superBlk), timeout);
      },
      get(key) {
        const superBlkCache = cache.get(key);
        if (superBlkCache != null) {
          const superBlk = JSON.parse(superBlkCache);
          chunks = superBlk.chunks.map(function(cKey2) {
            return cache.get(cKey2);
          });
          if (
            chunks.every(function(c) {
              return c != null;
            })
          ) {
            return JSON.parse(chunks.join(''));
          }
        }
        return null;
      }
    };
  }

  static getDateFormat() {
    return DATE_FORMAT;
  }

  static getCurrentDate() {
    const date = Utilities.formatDate(new Date(), TIME_ZONE, DATE_FORMAT);
    return date;
  }

  static generateUUID() {
    const date = Utilities.formatDate(new Date(), TIME_ZONE, UUID_FORMAT);
    return `${UUID_CODE}_${date}`;
  }

  static parseDate(dateValue) {
    const date = Utilities.formatDate(new Date(dateValue), TIME_ZONE, DATE_FORMAT);
    return date;
  }

  static getCurrentUser() {
    return Session.getActiveUser().getEmail();
  }

  static getAppName() {
    return APP_NAME;
  }

  static getScriptUrl() {
    const url = ScriptApp.getService().getUrl();
    return url;
  }

  static getALIASMAIL() {
    return ALIASMAIL;
  }

  static getMainDBID() {
    return DBID;
  }

  static getMainSheetName() {
    return SHEET;
  }

  static getAppRoleSheetName() {
    return APP_ROLE;
  }

  static errHandler(e, strFunc) {
    let message = `${e.message}\n in file: ${e.fileName} on line: ${e.lineNumber}`;
    const subject = `${APP_NAME} ERROR OCCURED | FOS APPS |  ${strFunc}`;
    const errProps = JSON.stringify(this.onError);
    message = `${subject}\n${message}\n onError: ${errProps}`;
    GmailApp.sendEmail(ERROR_EMAIL, subject, message);
  }
}
export default Utils;
