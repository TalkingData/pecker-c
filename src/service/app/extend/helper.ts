'use strict';

const validateId = str => {
  return /^[a-zA-Z0-9\-_\u4e00-\u9fa5]+$/i.test(str);
};

export { validateId };
