import { createRoot } from 'react-dom/client';
import './dashboard.scss';
import App from './Components/App';
import { dashboardInfo } from './utils/data';

document.addEventListener('DOMContentLoaded', () => {
	const dashboardElbptb = document.getElementById('bpivbDashboard');
	const info = JSON.parse(dashboardElbptb.dataset.info);

	createRoot(dashboardElbptb).render(<App {...dashboardInfo(info)} />);
});

