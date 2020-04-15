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
