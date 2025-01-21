import RequestContainer from './modules/RequestContainer';

import React from 'react';
import { createRoot } from 'react-dom/client';
console.log('Content script works!');

const menu = document.getElementById('top_right_menu');

const app = document.createElement('div');
app.id = 'root';

menu.prepend(app);

const root = createRoot(app);

root.render(
  <React.StrictMode>
    <RequestContainer />
  </React.StrictMode>
);
