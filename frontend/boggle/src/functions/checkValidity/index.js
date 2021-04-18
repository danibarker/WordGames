const csw = require("./csw.json");

export default function checkValidity(word) {
  return word.toUpperCase() in csw;
}
