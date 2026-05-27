import { UserTaxPercentMapperInterface } from "../mappers/user_tax_percent/user_tax_percent_mapper_interface.js";

export class OrgTaxPercentAdapter extends UserTaxPercentMapperInterface {
    constructor(orgMapper, orgType) {
        super();
        this.orgMapper = orgMapper;
        this.orgType = orgType;
    }

    getTaxPercent() {
        return this.orgMapper.getTaxPercent(this.orgType);
    }

    updateTaxPercent(newPercent) {
        return this.orgMapper.updateTaxPercent(this.orgType, newPercent);
    }
}