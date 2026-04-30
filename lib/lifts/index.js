import Debug from 'debug';
import getParseFn from './parse.js';
import pipe from './pipe.js';
import rest from './rest.js';
import stats from './stats.js';

const debug = Debug('liftie:lifts');

const shortInterval = 60 * 1000; // once a minute - fetch status if there were requests
const longInterval = 30 * shortInterval; // once every 30 minutes - fetch even if there wasn't any requests

fetch.interval = {
  active: shortInterval,
  inactive: longInterval
};

function getRequestFnAndUrl(resort) {
  if (resort.api) {
    return {
      fn: rest,
      url: resort.api
    };
  }
  if (resort.dataUrl) {
    return {
      fn: pipe,
      url: resort.dataUrl
    };
  }
  if (typeof resort.getUrl === 'function') {
    return {
      fn: pipe,
      url: resort.getUrl()
    };
  }
  return {
    fn: pipe,
    url: resort.url
  };
}

function fetchOne(url, parseFn) {
  return new Promise(resolve => pipe(url, parseFn, (_err, data) => resolve(data ?? {})));
}

export default async function fetch(resort, fn) {
  if (!resort._parseFn) {
    resort._parseFn = await getParseFn(resort.id);
  }
  debug('Fetch lift status for %s', resort.id);

  if (resort.dataUrls) {
    const results = await Promise.all(resort.dataUrls.map(url => fetchOne(url, resort._parseFn)));
    const status = Object.assign({}, ...results);
    fn(null, { status, stats: stats(status) });
    return;
  }

  if (!resort._rfau) {
    resort._rfau = getRequestFnAndUrl(resort);
  }
  const rfau = resort._rfau;
  rfau.fn(rfau.url, resort._parseFn, (_err, data) => {
    Promise.resolve(data).then((data, err) => {
      if (err || !data) {
        data = {};
      }
      fn(null, {
        status: data,
        stats: stats(data)
      });
    });
  });
}
