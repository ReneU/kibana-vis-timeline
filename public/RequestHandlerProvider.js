const getRequestBody = (params, queryFilter, timeFilter) => {
  const requestBody = {
    'size': 0,
    'query': {
      'bool': {
        'must': [
          {
            'range': {
              'timestamp': {
                'gte': timeFilter.from,
                'lte': timeFilter.to
              }
            }
          },
          {
            'bool': {}
          }
        ]
      }
    },
    'aggs': {
      'sessions': {
        'terms': {
          'field': params.sessionField,
          'size': params.maxSessionCount
        },
        'aggs': {
          'first_events': {
            'top_hits': {
              'sort': [
                {
                  [params.timeField]: {
                    'order': 'asc'
                  }
                }
              ],
              '_source': {
                'includes': [params.actionField, params.timeField]
              },
              'size': params.maxSessionLength
            }
          }
        }
      }
    }
  };
  const queries = queryFilter.getFilters();
  if (queries && queries.length) {
    queries.forEach(({ meta }) => {
      if (meta.disabled) return;
      const matchQuery = {
        match: {
          [meta.key]: meta.value
        }
      };
      addMatchQuery(requestBody, matchQuery, meta);
    });
  }
  return requestBody;
};

function addMatchQuery(request, query, { negate }) {
  let matcher;
  if (negate) {
    matcher = request.query.bool.must_not ? request.query.bool.must_not : (request.query.bool.must_not = []);
  } else{
    matcher = request.query.bool.must;
  }
  matcher.push(query);
}

export function RequestHandlerProvider(Private, es) {
  return {
    handle(vis) {
      const { timeFilter, queryFilter } = vis.API;
      return new Promise(resolve => {
        const params = vis.params;
        const requestBody = getRequestBody(params, queryFilter, timeFilter.time);
        es.search({
          index: 'analytics',
          body: requestBody
        }).then(result => resolve(result));
      });
    }
  };
}