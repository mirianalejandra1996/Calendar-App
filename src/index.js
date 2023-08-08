import React from 'react';
import ReactDOM from 'react-dom/client';

import { CalendarApp } from './CalendarApp';
import './styles.css';


import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <CalendarApp/>
  </React.StrictMode>
);

reportWebVitals();
