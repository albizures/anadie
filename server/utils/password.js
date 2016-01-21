'use strict';

const crypto = require("crypto");

function str_rot13 (str) {
		return (str + '')
				.replace(/[a-z]/gi, function(s) {
						return String.fromCharCode(s.charCodeAt(0) + (s.toLowerCase() < 'n' ? 13 : -13));
				});
}

function secret() {
	return '$2a$10$' + crypto.createHash('sha1')
												.update(randomInt(0,10).toString())
												.digest('hex')
												.substr(0,22);
}

function randomInt (low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}
function generateHash (password) {
	return crypto.createHash('sha1', secret())
													.update(password)
													.digest('hex');
}
function checkPassword (hash, password) {
	const fullStalt = hash.substr(0, 29),
				newHash = generateHash(password);
	return newHash == hash;
}
module.exports = {
	checkPassword,
	generateHash,
	str_rot13
};
