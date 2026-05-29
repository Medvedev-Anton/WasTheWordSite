import { useParams } from "react-router-dom";
import OrgSalaryDashboard from "../components/OrgSalaryDashboard";
import axios from "axios";
import { useEffect, useState } from "react";
import './TypicalOrgDashboard.css';
import TransferFromAdminToOrg from "../components/TransferFromAdminToOrg";

interface Organization {
  id: number;
  name: string;
  orgType?: string;
}

export default function TypicalOrgDashboard() {
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
        <div className="typical-dashboard-wrapper" id="typical-dashboard">
            <div className="org-salary-wrapper-title">
                <h1>Управление: {org?.orgType} организация</h1>
            </div>

            <div className="org-salaries">
                <OrgSalaryDashboard orgId={id} />
            </div>

            <div className="transfer-wrapper">
                <TransferFromAdminToOrg orgId={id} />
            </div>
            
        </div>
    );
}