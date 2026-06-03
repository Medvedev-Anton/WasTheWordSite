import { useParams } from 'react-router-dom';
import './TypicalSuborgDashboard.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import TransferFromOrgToSuborg from '../components/TransferFromOrgToSuborg';

interface Organization {
  id: number;
  name: string;
  orgType?: string;
}

export default function TypicalSuborgDashboard() {
    const { id } = useParams();

    useEffect(() => {
        fetchOrgData();
    }, []);

    const [org, setOrg] = useState<Organization>();

    // Получает данные об организации
    const fetchOrgData = async () => {
        const result = await axios.get(`/api/organizations/${id}/`);
        setOrg(result.data);
    }

    return (
        <div className="typical-suborg-dashboard-wrapper" id="typical-suborg-dashboard">
            <div className="org-wrapper-title">
                <h1>Управление: {org?.orgType}</h1>
            </div>

            <TransferFromOrgToSuborg orgId={id} />
        </div>
    );
}