const COLORS = [`lightblue`, `red`, `yellow`, `purple`, `green`, `orange`, `brown`, `gray`];
import vis from './libs/vis';

export function handleResponse(kibana, response) {
  const sessions = response.aggregations.sessions.buckets.map(session => {
    const events = session.first_events.hits.hits;
    return {
      sessionKey: session.key,
      events: events.map(event => {
        return {
          name: event._source[kibana.params.actionField],
          time: event._source[kibana.params.timeField]
        };
      })
    };
  });

  const colors = COLORS.slice(0);
  const colorLookup = {};
  let lastDate = new Date(60000);
  const groups = [];
  const items = new vis.DataSet(sessions.reduce((data, { events, sessionKey }) => {
    let firstEvtTime;
    let atLeastOneEvent = false;
    events.forEach(({ time, name }, idx) => {
      if (!firstEvtTime) {
        firstEvtTime = new Date(time);
      }
      atLeastOneEvent = true;
      const timeSinceFirstEvt = new Date(new Date(time) - firstEvtTime);
      if (timeSinceFirstEvt > lastDate) lastDate = timeSinceFirstEvt;
      let className = colorLookup[name];
      if (!className) {
        className = colors.shift();
        colorLookup[name] = className;
      }
      data.push({
        id: `${sessionKey}-${idx}`,
        content: name,
        start: timeSinceFirstEvt,
        group: sessionKey,
        className
      });
    });
    atLeastOneEvent && groups.push({ id: sessionKey, content: sessionKey.substring(0, 7) });
    return data;
  }, []));
  return { items, groups, lastDate };

}