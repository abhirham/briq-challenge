const fs = require('fs');
const {CustomError} = require('./utils');

module.exports = {
    writeToFile(json) {
        let data = JSON.stringify(json);
        fs.writeFile('topicsCache.json', data, err => {
            if(err) {
                console.log(err.message);
                throw err;
            }
        });
    },
    readFromFile() {
        try {
            let data = fs.readFileSync('topicsCache.json');
            return JSON.parse(data);
        } catch {
            return {};
        }
    }
}