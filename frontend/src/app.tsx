import { createRoot } from 'react-dom/client';
import { BlogApp } from './BlogApp';

document.body.innerHTML = '<div id="app"></div>';
const rootElement = document.getElementById('app');

if (!rootElement) {
  throw new Error('Root element not found');
}

const root = createRoot(rootElement);
root.render(<BlogApp />); 