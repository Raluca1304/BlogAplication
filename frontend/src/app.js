import { createRoot } from 'react-dom/client';
import { BlogApp } from './BlogApp';

document.body.innerHTML = '<div id="app"></div>';
const root = createRoot(document.getElementById('app'));
root.render(<BlogApp />);

