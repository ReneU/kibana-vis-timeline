import './libs/vis.css';
import './timeline-colors.css';
import vis from './libs/vis';

const OPTIONS = {
  showMajorLabels: false,
  showMinorLabels: true,
  verticalScroll: true,
  orientation: 'top',
  zoomKey: 'ctrlKey'
};

export default class TimelineVisualization {
  constructor(el, vis) {
    this.vis = vis;
    this.el = el;
  }

  destroy() {
    this.el.innerHTML = '';
  }

  render({ items, groups }) {
    this.destroy();
    if (!items) return;
    this.container = document.createElement('div');
    this.container.style.height = '100%';
    this.container.style.width = '100%';
    this.el.appendChild(this.container);

    const timeline = new vis.Timeline(this.container);
    timeline.setOptions(Object.assign(OPTIONS, {
      start: new Date(0) - 999,
      end: 70000
    }));
    timeline.setData({ items, groups });
  }
}
