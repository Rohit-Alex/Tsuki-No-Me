import {createRoot} from 'react-dom/client';
import './index.css';
import './i18n'
import App from './App';
import "antd/dist/antd.css";
import reportWebVitals from './reportWebVitals';
import { BasicInfoProvider } from './Components/BasicInfo.js/BasicInfo';
import store from './Redux/store';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';

const rootElement = document.getElementById('root');
const root = createRoot(rootElement!);
root.render(
        <Router>
          <Provider store={store}>
            <BasicInfoProvider>
              <App />
            </BasicInfoProvider>
          </Provider>
        </Router>
);

reportWebVitals();
