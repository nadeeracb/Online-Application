import DatabaseOperations from './DBOperations';
import Utils from './utils';

class Resources {
  static initialLoading() {
    const rtnObj = {};
    try {
      rtnObj.appUser = this.resolveAppUser();
      rtnObj.scriptUrl = Utils.getScriptUrl();
      rtnObj.data = null;

      return rtnObj;
    } catch (error) {
      console.error('Error occurred while saveLeave in Resources', error);
      throw new Error(`Error occurred while initialLoading`);
    }
  }

  static resolveAppUser() {
    try {
      const retObj = {};

      if (Utils.getCurrentUser()) {
        const email = Utils.getCurrentUser();

        DatabaseOperations.cacheEnabled = false;
        DatabaseOperations.initilizeDatabase(Utils.getMainDBID());
        DatabaseOperations.openDatabaseConnection(Utils.getAppRoleSheetName());
        const foundObj = DatabaseOperations.queryDatabase(`KEY:Email === "${email}"`);

        if (foundObj && typeof foundObj !== 'undefined') {
          retObj.data = foundObj;
          return retObj;
        }
        const facCode = Utils.getCurrentUser()
          .split('@')[1]
          .split('.')[0];
        let faculty = '';
        switch (facCode) {
          case 'agri':
            faculty = 'Faculty of Agriculture';
            break;
          case 'ahs':
            faculty = 'Faculty of Allied Health Sciences';
            break;
          case 'arts':
            faculty = 'Faculty of Arts';
            break;
          case 'dental':
            faculty = 'Faculty of Dental Sciences';
            break;
          case 'eng':
            faculty = 'Faculty of Engineering';
            break;
          case 'mgt':
            faculty = 'Faculty of Management';
            break;
          case 'med':
            faculty = 'Faculty of Medicine';
            break;
          case 'sci':
            faculty = 'Faculty of Science';
            break;
          case 'vet':
            faculty = 'Faculty of Veterinary Medicine and Animal Science';
            break;
          default:
            faculty = 'UNIVERSITY OF PERADENIYA';
            break;
        }

        const guestUser = {
          Name: 'INTERNAL_USER',
          Email: email,
          Faculty: faculty,
          Department: '',
          Role: 'USER_UOP'
        };

        const outerArray = [];
        outerArray.push(guestUser);
        retObj.data = outerArray;

        return retObj;
      }
      const guestUser = {
        Name: 'Guest',
        Email: '',
        Faculty: '',
        Department: '',
        Role: 'GUEST'
      };

      const outerArray = [];
      outerArray.push(guestUser);
      retObj.data = outerArray;

      return retObj;
    } catch (error) {
      console.error('Error occurred while resolveAppUser in Resources', error);
      throw new Error(`Error occurred while resolveAppUser`);
    }
  }

  /*
  static getData() {
    try {
      DatabaseOperations.cacheEnabled = false;
      DatabaseOperations.initilizeDatabase(Utils.getMainDBID());
      DatabaseOperations.openDatabaseConnection(Utils.getAppRoleSheetName());
      const foundObj = DatabaseOperations.queryDatabase(`KEY:Email === "${email}"`);
    } catch (error) {
      console.error('Error occurred while getData in Resources', error);
      throw new Error(`Error occurred while getData`);
    }
  }
  */
}

export default Resources;
