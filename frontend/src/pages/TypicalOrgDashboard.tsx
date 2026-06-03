import { useParams } from "react-router-dom";
import OrgSalaryDashboard from "../components/OrgSalaryDashboard";
import axios from "axios";
import { useEffect, useState } from "react";
import './TypicalOrgDashboard.css';
import TransferOrgBalance from "../components/TransferOrgBalance";
import SuborgsDashboardTable from "../components/SuborgsDashboardTable";
import OrgBalanceDiagram from "../components/OrgBalanceDiagram";
import TransferFromOrgToSuborg from "../components/TransferFromOrgToSuborg";

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

            <div className="typical-org-balance">
                <OrgBalanceDiagram orgId={id} />
            </div>

            <div className="org-salaries">
                <OrgSalaryDashboard orgId={id} />
            </div>

            <TransferFromOrgToSuborg orgId={id} />

            <div className="transfer-wrapper">
                <TransferOrgBalance orgId={id} />
            </div>

            <div className="suborgs-resources">
                <SuborgsDashboardTable orgType={org?.orgType} />
            </div>
            
        </div>
    );
}