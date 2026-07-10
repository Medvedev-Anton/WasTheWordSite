import { Resource } from '../types';
import './ResourceExtraction.css';

interface ResourceExtractionProps {
    resource: Resource;
    farmId: number;
    onExtract: (farmId: number, resourceId: number) => void;
    countExtractedResource: number;
}

export default function ResourceExtraction(
    { 
        resource, 
        farmId,
        onExtract,
        countExtractedResource
    }: ResourceExtractionProps
) {
    const onClickExtractBtn = () => {
        onExtract(farmId, resource.id);
    }

    return (
        <div className='resource-extraction-content'>
            <div className="resource-extraction__components">
                <div className="resource-extraction__component">
                    <p className='resource-extraction__component-value'>
                        {(resource.countNeedMoney / 100).toFixed(2)}
                    </p>
                    <p className="resource-extraction__component-title">
                        BFB
                    </p>
                </div>
                <div className="resource-extraction__component">
                    <p className='resource-extraction__component-value'>
                        {resource.countNeedEnergy}
                    </p>
                    <p className="resource-extraction__component-title">
                        Energy
                    </p>
                </div>
            </div>
            <div className="resource-extraction__extract">
                <div className="resource-extraction__extract-btn-wrapper">
                    <button
                        className='resource-extraction__extract-btn'
                        onClick={onClickExtractBtn}
                    >
                        Добыть
                    </button>
                </div>
                <div className="resource-extraction__extract__resource-img-wrapper">
                    <img
                        className="resource-extraction__extract__resource-img" 
                        src={resource.imageUrl} 
                        alt="resource image" 
                    />
                    <p
                        className="resource-extraction__extract__resource-title"
                    >
                        {resource.name}
                    </p>
                </div>
                <div className="resource-extraction__extract__count">
                    {countExtractedResource}
                </div>
            </div>
        </div>
    );
}