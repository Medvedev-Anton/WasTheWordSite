import { useParams } from 'react-router-dom';
import './TypicalSuborgDashboard.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import TransferFromOrgToSuborg from '../components/TransferFromOrgToSuborg';
import OrgBalanceDiagram from '../components/OrgBalanceDiagram';
import GoBackFromOrgDashboard from '../components/GoBackFromOrgDashboard';
import OrgBuyEnergy from '../components/OrgBuyEnergy';

interface Organization {
  id: number;
  name: string;
  orgType?: string;
  energy: number;
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

            <div className="go-back-wrapper">
                <GoBackFromOrgDashboard orgId={id} />
            </div>

            {id !== undefined && id !== null && (
                <div className="typical-suborg-balance">
                    <OrgBalanceDiagram orgId={parseInt(id)} />
                </div>
            )}
            
            {org?.id !== undefined && org?.id !== null && (
                <div className="buy-energy-wrapper">
                    <OrgBuyEnergy 
                        orgId={org.id}
                        orgEnergy={org.energy}
                    />
                </div>
            )} 

            <TransferFromOrgToSuborg orgId={id} />
        </div>
    );
}