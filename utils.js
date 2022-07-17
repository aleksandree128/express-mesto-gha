// по каким-то причинам линтер ложно срабатывает на escape последовательности, что ломает регулярку.
// eslint-disable-next-line
const urlRegex = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;
module.exports.urlRegex = urlRegex;
