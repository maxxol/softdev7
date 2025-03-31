const FS = require('fs');
const JSON_FILE = FS.readFileSync('config/intersection_data.json', 'utf8')

const INTERSECTION_DATA = JSON.parse(JSON_FILE.toString());
module.exports = INTERSECTION_DATA