import RequestContainer from './modules/RequestContainer';

import React from 'react';
import { createRoot } from 'react-dom/client';
import { store } from '@store';
import { Provider } from 'react-redux';

const menu = document.getElementById('top_right_menu');
const app = document.createElement('div');
app.id = 'root';

menu.prepend(app);

const root = createRoot(app);

root.render(
  <Provider store={store}>
    <React.StrictMode>
      <RequestContainer />
    </React.StrictMode>
  </Provider>
);
