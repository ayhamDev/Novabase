module.exports = (obj) => {
  let newObj = obj;
  newObj.where = obj.where || "{}";
  for (const key in obj) {
    if (Object.hasOwnProperty.call(obj, key)) {
      if (/\d/.test(obj[key])) {
        newObj[key] = parseInt(obj[key]);
      }
    }
  }
  newObj.where = JSON.parse(obj.where);
  return newObj;
};
