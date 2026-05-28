import { useParams } from "react-router-dom";
import OrgSalaryDashboard from "../components/OrgSalaryDashboard";

export default function TypicalOrgDashboard() {
    const { id } = useParams();

    return (
        <div className="typical-dashboard-wrapper">
            <OrgSalaryDashboard orgId={id} />
        </div>
    );
}