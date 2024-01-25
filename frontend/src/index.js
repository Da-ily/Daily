import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import GlobalStyles from './styles/GlobalStyle';
import App from './App';
import { worker } from './mocks/worker';

if (process.env.NODE_ENV === 'development') {
  await worker.start();
}

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <GlobalStyles />
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
