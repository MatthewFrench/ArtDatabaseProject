/*
This loads the configuration from the configuration file.
 */

let FileSystem = require('fs');
let ConfigurationPath = './Configuration.json';

//Loaded configuration
let LoadedConfigurationJSON = {};
let HOST_KEY = 'Host';
let DB_PORT = 'Port';
let DATABASE = 'Database';
let DB_USERNAME = 'Database Username';
let DB_PASSWORD = 'Database Password';

export class Configuration {
  static Initialize() {
    if (!FileSystem.existsSync(ConfigurationPath)) {
      throw new Error('Please create configuration file.');
    }
    let data = FileSystem.readFileSync(ConfigurationPath, 'utf8');
    LoadedConfigurationJSON = JSON.parse(data);
    console.log('Loaded the configuration.');
  }
  static GetHost() {
    return LoadedConfigurationJSON[HOST_KEY];
  }
  static GetPort() {
    return LoadedConfigurationJSON[DB_PORT];
  }
  static GetDatabase() {
    return LoadedConfigurationJSON[DATABASE];
  }
  static GetDBUsername() {
    return LoadedConfigurationJSON[DB_USERNAME];
  }
  static GETDBPassword() {
    return LoadedConfigurationJSON[DB_PASSWORD];
  }
}