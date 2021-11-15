const ERROR_EMAIL = 'youremail@sci.pdn.ac.lk';
const TIME_ZONE = 'Asia/Colombo';
const DATE_FORMAT = 'MM/dd/yyyy HH:mm:ss';
const UUID_FORMAT = 'MMddyyyyHHmmss';
const APP_NAME = 'ONLINE APPLICATION';
const APP_DESCRIPTION = 'Academic Establishment. University of Peradeniya.';
const APP_URL =
  'https://script.google.com/a/macros/sci.pdn.ac.lk/s/AKfycbx3Y5wNMavas0qXsMMWxHYDdsnHEEt1EXg1wZ8LVVZPZmddxciU/exec';
const ALIASMAIL = 'nadeerab@sci.pdn.ac.lk';
const UUID_CODE = 'OA';

const DBID = '1zEOhUssIPEro_3vXTB_x6U7fqJXZetYCr8QT8fpEqkk';
const SHEET = 'mainsheet';
const APP_ROLE_SHEET = 'roles';
const VACANCY_SHEET = 'vacancies';

const PROCESSING_EMAILS = 'test@sci.pdn.ac.lk';

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

  static getAppDescription() {
    return APP_DESCRIPTION;
  }

  static getAppRedirectURL() {
    return APP_URL;
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
    return APP_ROLE_SHEET;
  }

  static getVacanciesSheetName() {
    return VACANCY_SHEET;
  }

  static getProcessingEmails() {
    return PROCESSING_EMAILS;
  }

  static sendMail(heading, description, emailAddress, name, email, post, VacancyID, faculty, department) {
    try {
      const htmlOutput = HtmlService.createHtmlOutputFromFile('email_template');
      let message = htmlOutput.getContent();
      message = message.replace('%heading', heading);
      message = message.replace('%description', description);

      message = message.replace('%param1', name);
      message = message.replace('%param2', email);
      message = message.replace('%param3', post);
      message = message.replace('%param4', VacancyID);
      message = message.replace('%param5', `${department} - ${faculty}`);
      message = message.replace('%appURL', APP_URL);

      const subject = 'Online Application -  University of Peradeniya';
      GmailApp.sendEmail(emailAddress, subject, '', {
        from: ALIASMAIL,
        replyTo: ALIASMAIL,
        name: 'University of Peradeniya',
        htmlBody: message
      });
    } catch (e) {
      console.error('Error ocuured while Send Mail in Utils', e);
      throw new Error(`Error ocuured while Send Mail in Utils`);
    }
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
