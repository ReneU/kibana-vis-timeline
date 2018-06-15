const COLORS = [`lightblue`, `red`, `yellow`, `purple`, `green`, `orange`, `brown`, `gray`];
import vis from './libs/vis';

export function handleResponse(kibana, response) {
  const sessions = response.aggregations.sessions.buckets.map(session => {
    const events = session.first_events.hits.hits;
    return {
      sessionKey: session.key,
      events: events.map(event => {
        return {
          name: event._source.topic,
          timestamp: event._source.timestamp
        };
      })
    };
  });

  const colors = COLORS.slice(0);
  const colorLookup = {};
  let lastDate = new Date(60000);
  const groups = [];
  const items = new vis.DataSet(sessions.reduce((data, { events, sessionKey }) => {
    let firstEvtDate;
    let atLeastOneEvent = false;
    events.forEach(({ timestamp, name }, idx) => {
      if ((!firstEvtDate && name !== 'appstart') || (idx && name === events[idx - 1].name)) {
        return;
      } else if (name === 'appstart') {
        firstEvtDate = new Date(timestamp);
        return;
      }
      atLeastOneEvent = true;
      const timeSinceSessionStart = new Date(new Date(timestamp) - firstEvtDate);
      if (timeSinceSessionStart > lastDate) lastDate = timeSinceSessionStart;
      let className = colorLookup[name];
      if (!className) {
        className = colors.shift();
        colorLookup[name] = className;
      }
      data.push({
        id: `${sessionKey}-${idx}`,
        content: name,
        start: timeSinceSessionStart,
        group: sessionKey,
        className
      });
    });
    atLeastOneEvent && groups.push({ id: sessionKey, content: sessionKey.substring(0, 7) });
    return data;
  }, []));
  return { items, groups, lastDate };

}