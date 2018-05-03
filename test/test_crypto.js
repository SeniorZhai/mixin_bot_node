const config = require('../config')
const networkUtil = require('../api/NetworkUtil')

console.log(networkUtil.getAesKey(config.privateKey, config.pin_token, config.session_id))