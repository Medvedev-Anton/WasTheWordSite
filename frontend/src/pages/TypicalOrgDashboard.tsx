import { useParams } from "react-router-dom";
import OrgSalaryDashboard from "../components/OrgSalaryDashboard";
import axios from "axios";
import { useEffect, useState } from "react";
import './TypicalOrgDashboard.css';
import TransferOrgBalance from "../components/TransferOrgBalance";
import SuborgsDashboardTable from "../components/SuborgsDashboardTable";
import OrgBalanceDiagram from "../components/OrgBalanceDiagram";
import TransferFromOrgToSuborg from "../components/TransferFromOrgToSuborg";
import GoBackFromOrgDashboard from "../components/GoBackFromOrgDashboard";
import OrgBuyEnergy from "../components/OrgBuyEnergy";
import { Organization } from "../types";
import EnergyTranfserToFromSuborgs from "../components/EnergyTranfserToFromSuborgs";

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
            <div className="typical-org-wrapper-title">
                <h1>Управление: {org?.orgType} организация</h1>
            </div>

            <div className="go-back-wrapper">
                <GoBackFromOrgDashboard orgId={id} />
            </div>

            <div className="typical-org-balance">
                <OrgBalanceDiagram orgId={id} />
            </div>

            <div className="org-salaries">
                <OrgSalaryDashboard orgId={id} />
            </div>

            <TransferFromOrgToSuborg orgId={id} />

            {org?.id !== undefined && org?.id !== null && (
                <div className="buy-energy-wrapper">
                    <OrgBuyEnergy 
                        orgId={org.id}
                        orgEnergy={org.energy}
                    />
                </div>
            )}  

            {org?.id !== undefined && org?.id !== null && (
                <div className="energy-transfer-to-from-suborgs-wrapper">
                    <EnergyTranfserToFromSuborgs 
                        orgId={org.id}
                        suborgs={org.subOrganizations}
                        orgEnergy={org.energy}
                    />
                </div>
            )}  

            <div className="transfer-wrapper">
                <TransferOrgBalance orgId={id} />
            </div>

            <div className="suborgs-resources">
                <SuborgsDashboardTable orgType={org?.orgType} />
            </div>
            
        </div>
    );
}