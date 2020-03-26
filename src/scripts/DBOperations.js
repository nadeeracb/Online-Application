import Utils from './utils';

class DatabaseOperations {
  // initialize the database using Id only. Because if we open the sheet it will be an extra cost
  static initilizeDatabase(databaseId) {
    this.DBID = databaseId;
    this.CACHE_TIMEOUT = 600;
    this.CACHE_KEY = `DB${this.sheetName}`;
  }

  static openDatabaseConnection(sheetName) {
    this.sheetName = sheetName;
    if (!this.DBID) {
      console.error(`Database Id is not defined. When trying to open the sheet :${sheetName}`);
      throw new Error('Database Id is not defined');
    }

    if (!sheetName) {
      console.error(`Database sheetName is not defined. When trying to open the sheet :${sheetName}`);
      throw new Error('Database sheetName is not defined');
    }

    try {
      const spreadSheet = SpreadsheetApp.openById(this.DBID);
      this.connectedDatabse = spreadSheet.getSheetByName(sheetName);
    } catch (e) {
      console.error(`Error occured while opening the sheet. When trying to open the sheet :${sheetName}error : `, e);
      throw new Error(`Error occured while opening the sheet : ${sheetName}`, e);
    }
  }

  static saveItem(newObject) {
    let retVal = '';
    try {
      const spArray = [];
      if (newObject) {
        Object.entries(newObject).forEach(([, value]) => {
          spArray.push(value);
        });
      }
      if (spArray.length > 0) {
        this.connectedDatabse.appendRow(spArray);
        SpreadsheetApp.flush();
        retVal = true;
        if (this.cacheEnabled) {
          CacheService.getScriptCache().remove(this.CACHE_KEY);
        }
        console.info('save successfull.', JSON.stringify(spArray));
      } else {
        console.error(`No data inside array for saving`);
        throw new Error(`Error ocuured whilesave data as an array`);
      }

      return retVal;
    } catch (e) {
      console.error(`Error ocuured while saving new Request in DBOperations${e.lineNumber}`, e);
      throw new Error(`Error ocuured while SaveRequest in DBOperations${e}`);
    }
  }

  static updateItem(oldObject, newObject) {
    const retVal = '';
    try {
      const spArray = [];
      if (newObject) {
        Object.entries(newObject).forEach(([, value]) => {
          spArray.push(value);
        });
      }
      const oldArray = [];
      if (oldObject) {
        Object.entries(oldObject).forEach(([, value]) => {
          oldArray.push(value);
        });
      }

      if (spArray.length > 0) {
        const foundRow = this.findObjectRow(oldArray);
        const outerArray = [];
        outerArray.push(spArray);
        this.connectedDatabse.getRange(foundRow + 1, 1, 1, spArray.length).setValues(outerArray);
        if (this.cacheEnabled) {
          CacheService.getScriptCache().remove(this.CACHE_KEY);
        }
      } else {
        console.error(`No data inside array for updating`);
        throw new Error(`Error ocuured while updating data as an array`);
      }

      return retVal;
    } catch (e) {
      console.error(`Error ocuured while updating new Request in DBOperations${e.lineNumber}`, e);
      throw new Error(`Error ocuured while updating in DBOperations${e}`);
    }
  }

  static deleteItem(oldObject) {
    let retVal = 0;
    try {
      const oldArray = [];
      if (oldObject) {
        Object.entries(oldObject).forEach(([, value]) => {
          oldArray.push(value);
        });
      }

      if (oldArray.length > 0) {
        const foundRow = this.findObjectRow(oldArray);
        this.connectedDatabse.deleteRow(foundRow + 1);
        retVal = 1;
        if (this.cacheEnabled) {
          CacheService.getScriptCache().remove(this.CACHE_KEY);
        }
      } else {
        console.error(`No data for delete`);
        throw new Error(`Error ocuured while deleting data as an array`);
      }

      return retVal;
    } catch (e) {
      console.error(`Error ocuured while deleting new Request in DBOperations${e.lineNumber}`, e);
      throw new Error(`Error ocuured while deleting in DBOperations${e}`);
    }
  }

  static findObjectRow(oldObject) {
    const allData = this.readDatabaseCache();
    let foundItem = -1;
    if (oldObject) {
      allData.filter((r, i) => {
        if (JSON.stringify(r) === JSON.stringify(oldObject)) {
          foundItem = i;
        }
        return null;
      });
    }
    return foundItem;
  }

  static readDatabaseCache() {
    if (this.cacheEnabled) {
      const chunky1 = Utils.ChunkyCache(CacheService.getScriptCache(), 1024 * 90);
      let cached = null;
      let allData = [];
      cached = chunky1.get(this.CACHE_KEY);
      if (chunky1 && cached) {
        allData = JSON.parse(cached);
      } else {
        allData = this.connectedDatabse.getDataRange().getValues();
        const chunky = Utils.ChunkyCache(CacheService.getScriptCache(), 1024 * 90);
        chunky.put(this.CACHE_KEY, JSON.stringify(allData), this.CACHE_TIMEOUT);
      }
      return allData;
    }
    return this.connectedDatabse.getDataRange().getValues();
  }

  static queryDatabase(query) {
    const allData = this.readDatabaseCache();
    const operatorsArray = query.split(' ');
    const queryKeyArray = [];
    let operatorKeyArray = [];

    operatorsArray.filter(r => {
      if (r.indexOf('KEY:') > -1) {
        queryKeyArray.push(r.slice(4));
      }
      return null;
    });

    const keyArray = [];
    this.dataArray = [];

    if (allData && allData.length > 0) {
      allData[0].forEach(function(item) {
        keyArray.push(item);
      });

      if (operatorsArray.length > 1) {
        const results = allData.filter(r => {
          operatorKeyArray = [];
          operatorsArray.filter(k => {
            if (k.indexOf('KEY:') > -1) {
              const varVal = `"${r[keyArray.indexOf(k.slice(4))]}"`;
              operatorKeyArray.push(varVal);
            } else {
              operatorKeyArray.push(k);
            }
            return null;
          });
          const queryString = operatorKeyArray.join(' ');
          return eval(queryString);
        });

        for (let i = 0; i < results.length; i += 1) {
          const newObject = {};
          for (let j = 0; j < keyArray.length; j += 1) {
            newObject[keyArray[j]] = results[i][j];
          }
          this.dataArray.push(newObject);
        }
      } else {
        for (let i = 1; i < allData.length; i += 1) {
          const newObject = {};
          for (let j = 0; j < keyArray.length; j += 1) {
            newObject[keyArray[j]] = allData[i][j];
          }
          this.dataArray.push(newObject);
        }
      }
    }
    return this.dataArray.length > 1 ? this.dataArray : this.dataArray[0];
  }

  static cloneObject(object) {
    const newObject = {};
    Object.entries(object).forEach(([key, value]) => {
      newObject[key] = value;
    });

    return newObject;
  }
}

export default DatabaseOperations;
