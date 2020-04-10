export function collectIdsandDocs(doc) {
  return {id: doc.id, ...doc.data()};
}
