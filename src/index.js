// ---------------------------------- IMPORT ------------------------------------------
// --------------------------- React and Bootstrap --------------------------------
import React from 'react';
import { createRoot } from 'react-dom/client';

// ---------------------------------  styles --------------------------------------
import './styles/index.css';

// -------------------------------  components ------------------------------------
import App from './components/App.js';

// --------------------------------- RENDER ------------------------------------------
const container = document.getElementById('root');
const root = createRoot(container); 
root.render(<App />)
