const computeDifficulty = function (pattern, isChecksum) {
  const ret = Math.pow(16, pattern.length);
  return isChecksum ? (ret * Math.pow(2, pattern.replace(/[^a-f]/, '').length)) : ret;

  // return isChecksum ? (ret * Math.pow(2, pattern.replace(/[^a-f]/gi, '').length)) : ret;
}

const computeProbability = function (difficulty, attempts) {
  return 1 - Math.pow(1 - (1 / difficulty), attempts);
}

module.exports = {
  computeDifficulty,
  computeProbability
}