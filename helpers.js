const isEmpty = require('lodash/isEmpty');
const isUndefined = require('lodash/isUndefined');
const isNull = require('lodash/isNull');

const isValid = el => !(isUndefined(el) || isEmpty(el) || isNull(el));

const getShortCodeFromElement = el => {
  if (isValid(el) && isValid(el.firstChild))
    return el.firstChild.pathname.split('/')[2];
  return null;
};

module.exports = {
  isValid,
  getShortCodeFromElement
};
