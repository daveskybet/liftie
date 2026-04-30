import { child, findText } from './domutil.js';

function parseItem(node) {
  const iconDiv = child(node, '1');
  const textDiv = child(node, '2');

  const name = findText(child(textDiv, '0'))?.trim();
  if (!name) return;

  const iconClass = iconDiv?.attribs?.class ?? '';
  const status = iconClass.includes('lpv-list__lift-icon--is-closed') ? 'closed' : 'open';

  return { name, status };
}

export default {
  selector: '.lpvliftlistblock .lpv-list__item',
  parse: parseItem
};
