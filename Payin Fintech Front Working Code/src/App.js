// styles
import 'antd/dist/antd.less';
import 'assets/styles/index.scss';
import 'assets/styles/authentication.scss';
// redux
import { Provider } from 'react-redux';
import store from 'redux/store';
// components
import { ConfigProvider } from 'antd';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from 'routes';
import { ToastContainer } from 'react-toast'
import 'bootstrap/dist/css/bootstrap.min.css';

// customize ant design
const validateMessages = {
  required: 'Required',
  pattern: {
    mismatch: 'Invalid format'
  }
};


const App = () => {
  return (
    <Provider store={store}>
      <ConfigProvider form={{ validateMessages }}>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </ConfigProvider>
      <ToastContainer delay={3000} position='top-right' />
    </Provider>
  )
}

export default App;
