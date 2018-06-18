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
    this.container && this.el.removeChild(this.container);
    this.el.innerHTML = `
      <div class='table-vis-error'>
        <h2 aria-hidden='true'>
          <i aria-hidden='true' class='fa fa-meh-o'></i>
        </h2>
        <h4>No results found</h4>
      </div>`;
  }

  render({ items, groups }) {
    this.destroy();
    if (!items) return;
    this.el.innerHTML = '';
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
