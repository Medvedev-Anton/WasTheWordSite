import { SimpleItem } from '../types';
import './SimpleItemCreation.css';

interface SimpleItemCreationProps {
    simpleItem: SimpleItem;
    workshopId: number;
    onCreate: (workshopId: number, simpleItemId: number) => void;
    countCreatedItems: number;
}

export default function SimpleItemCreation(
    {
        simpleItem,
        workshopId,
        onCreate,
        countCreatedItems
    }: SimpleItemCreationProps
) {
    const onClickCreateBtn = () => {
        onCreate(workshopId, simpleItem.id);
    }

    return (
        <div className='simple-item-creation-content'>
            <div className="simple-item-creation__components">
                <div className="simple-item-creation__component">
                    <p className='simple-item-creation__component-value'>
                        {(simpleItem.countNeedMoney / 100).toFixed(2)}
                    </p>
                    <p className="simple-item-creation__component-title">
                        BFB
                    </p>
                </div>
                <div className="simple-item-creation__component">
                    <p className='simple-item-creation__component-value'>
                        {simpleItem.countNeedEnergy}
                    </p>
                    <p className="simple-item-creation__component-title">
                        Energy
                    </p>
                </div>
            </div>
            <div className="simple-item-creation__extract">
                <div className="simple-item-creation__extract-btn-wrapper">
                    <button
                        className='simple-item-creation__extract-btn'
                        onClick={onClickCreateBtn}
                    >
                        Добыть
                    </button>
                </div>
                <div className="simple-item-creation__extract__resource-img-wrapper">
                    <img
                        className="simple-item-creation__extract__resource-img" 
                        src={simpleItem.imageUrl} 
                        alt="resource image" 
                    />
                    <p
                        className="simple-item-creation__extract__resource-title"
                    >
                        {simpleItem.name}
                    </p>
                </div>
                <div className="simple-item-creation__extract__count">
                    {countCreatedItems}
                </div>
            </div>
        </div>
    );
}