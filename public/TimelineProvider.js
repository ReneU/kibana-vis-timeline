import optionsTemplate from './options_template.html';
import TimelineVisualization from './TimelineVisualization';
import { RequestHandlerProvider } from './RequestHandlerProvider';
import { handleResponse } from './ResponseHandler';

import { CATEGORY } from 'ui/vis/vis_category';
import { VisFactoryProvider } from 'ui/vis/vis_factory';
import { VisTypesRegistryProvider } from 'ui/registry/vis_types';

function TimelineProvider(Private) {
  const VisFactory = Private(VisFactoryProvider);
  const requestHandler = Private(RequestHandlerProvider);

  return VisFactory.createBaseVisualization({
    name: 'timeline',
    title: 'Timeline',
    icon: 'fa fa-line-chart',
    description: 'Timeline',
    category: CATEGORY.OTHER,
    visualization: TimelineVisualization,
    responseHandler: handleResponse,
    requestHandler: requestHandler.handle,
    visConfig: {
      defaults: {
        sessionField: 'session_id.keyword',
        actionField: 'topic',
        startAction: 'appstart',
        timeField: 'timestamp',
        maxSessionCount: 100,
        maxSessionLength: 5,
        width: 1500,
        height: 800
      },
    },
    editorConfig: {
      optionsTemplate: optionsTemplate
    }
  });
}

VisTypesRegistryProvider.register(TimelineProvider);