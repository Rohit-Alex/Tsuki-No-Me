import {createRoot} from 'react-dom/client';
// import './index.css';
import './i18n'
import App from './App';
import "antd/dist/antd.css";
import reportWebVitals from './reportWebVitals';
import AllTheProviders from './Providers/AllProviders';
import { StyledEngineProvider } from '@mui/material/styles';

const rootElement = document.getElementById('root');
const root = createRoot(rootElement!); 
root.render(
  <StyledEngineProvider injectFirst>
    <AllTheProviders>
      <App />
    </AllTheProviders>
    </StyledEngineProvider>
);

reportWebVitals();
