import { useNavigate } from 'react-router-dom';
import './GoBackFromOrgDashboard.css';

export default function GoBackFromOrgDashboard({ orgId }) {
    const navigate = useNavigate();

    // Обрабатывает переход на страницу организации
    const handleGoBackClick = () => {
        navigate(`/organizations?id=${orgId}`);
    }

    return (
        <button 
            className="go-back-from-org-dashboard-btn"
            onClick={handleGoBackClick}
        >
            Назад
        </button>
    )
}