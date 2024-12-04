import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import 'swiper/css';
import 'swiper/css/navigation';
import 'react-datepicker/dist/react-datepicker.css';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.css';

import App from './App';
import { Amplify } from 'aws-amplify';
import awsExports from './aws-exports';
import './index.css';

Amplify.configure(awsExports);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(<App user={undefined} />);

reportWebVitals();
