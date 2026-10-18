// Comparison tables often leave the top-left header cell empty ("| | A | B |").
// An empty <th> is announced as a header with no name, so turn it into a plain <td>.
const text = (node) => (node.type === 'text' ? node.value : (node.children ?? []).map(text).join(''));

function walk(node, inHead) {
  if (node.type === 'element' && node.tagName === 'th' && inHead && !text(node).trim()) node.tagName = 'td';
  const head = inHead || (node.type === 'element' && node.tagName === 'thead');
  for (const child of node.children ?? []) walk(child, head);
}

export default function rehypeTableCorner() {
  return (tree) => walk(tree, false);
}
