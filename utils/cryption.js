// encryption utils
const crypto = require('crypto');

module.exports = {
    MD5_SUFFIX: 'WelcomeToNewYorkBuffalo',
    md5: function (pwd) {
        let md5 = crypto.createHash('md5');
        return md5.update(pwd).digest('hex')
    }
}