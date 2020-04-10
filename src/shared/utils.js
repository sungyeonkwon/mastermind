export function collectIdsandDocs(doc) {
  return {id: doc.id, ...doc.data()};
}

export function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}
