import toTitleCase from 'to-title-case';
import { collect } from './domutil.js';

const v3 = {
  selector: '.POI_title:contains(Lifts) + .liaisons .POI_info',
  parse: {
    name: {
      child: '1/0/0',
      fn: toTitleCase
    },
    status: {
      child: '2/1',
      attribute: 'src',
      regex: /lp_runway_trail_(\w+)\.svg$/
    }
  }
};

const v1 = {
  selector: '.text:contains(Lifts) + .prl_affichage .prl_group',
  parse: {
    name: {
      child: '1/0',
      fn: toTitleCase
    },
    status: {
      child: '4/0',
      attribute: 'src',
      regex: /(.)\.svg$/,
      fn: statusLetter => {
        switch (statusLetter) {
          case 'O':
            return 'open';
          case 'P':
            return 'scheduled';
          default:
            return 'closed';
        }
      }
    }
  }
};

export default function (dom) {
  const result = collect(dom, v3.selector, v3.parse);
  if (Object.keys(result).length > 0) return result;
  return collect(dom, v1.selector, v1.parse);
}
