export function collectIdsandDocs(doc) {
  return {id: doc.id, ...doc.data()};
}

export function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

export function setRoomParam({room = ''}) {
  const searchParams = new URLSearchParams();
  searchParams.set('room', room);
  return searchParams.toString();
}

export function getRoomParam() {
  const searchParams = new URLSearchParams(
    document.location.search.substring(1)
  );
  return searchParams.get('room');
}

export function isCodebreaker(gameDoc, user) {
  return gameDoc.roundArr[gameDoc.currentRound].codebreaker.uid === user.uid;
}

export function copyToClipboard(inputSelector) {
  var copyText = document.querySelector(inputSelector);
  copyText.select();
  document.execCommand('copy');
}

/** Returns a multipled array in its size by the factor. */
export function multiplyArrSize(arr, factor) {
  if (factor <= 0) return;

  let multiplied = [...arr];
  for (let i = 1; i < factor; i++) {
    multiplied = [...multiplied.concat(arr)];
  }
  return multiplied;
}

/**
 * Returns a position(integer) of a number in the given range.
 *
 * @param {number} n - a number between 0 and 1.
 * @param {number} min - a starting position integer for the range.
 * @param {number} max - an ending position integer for the range.
 */
export function valInRange(n, min, max) {
  const range = max - min;
  return parseInt(range * n, 10) + min;
}

export function coordsInRange(xMin, xMax, yMin, yMax) {
  const randX = Math.random();
  const randY = Math.random();

  const x = valInRange(randX, xMin, xMax);
  const y = valInRange(randY, yMin, yMax);
  return {
    x: x - xMin,
    y: y - yMin,
  };
}
