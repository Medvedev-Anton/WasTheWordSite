import { useEffect, useState } from 'react';
import { CompoundItemPartRow, SimpleItem } from '../types';
import './CompoundItemParts.css';

interface CompoundItemPartsProps {
    compoundItemId?: number;
    allSimpleItems: SimpleItem[];
    compoundItemsPartsRows?: CompoundItemPartRow[]
    onChangeNeedCountCreated?: (compoundId: number | undefined, partId: number | undefined, newValue: number) => void;
    onChangePartItemIdCreated?: (compoundId: number | undefined, partId: number | undefined, newValue: number) => void;
    onAppendingPartItem?: (compoundItemId: number | undefined, partItemId: number, countNeed: number) => void;
    onDeletePartItem?: (compoundItemId: number | undefined, partId: number | undefined) => void;
    onChangeRows?: (rows: CompoundItemPartRow[] | undefined) => void;
}

export default function CompoundItemParts(
    {
        compoundItemId,
        allSimpleItems,
        compoundItemsPartsRows,
        onChangeNeedCountCreated,
        onChangePartItemIdCreated,
        onAppendingPartItem,
        onDeletePartItem,
        onChangeRows
    }: CompoundItemPartsProps
) {
    const [countNeedSimpleItemInputAppendingValue, setCountNeedSimpleItemInputAppendingValue] = useState<number>(0);
    const [appendingSimplePartId, setAppendingSimplePartId] = useState<number | undefined>(undefined);
    const [createdPartsRows, setCreatedPartsRows] = useState<CompoundItemPartRow[] | undefined>([]);

    useEffect(() => {
        setCreatedPartsRows(compoundItemsPartsRows);
    }, [compoundItemsPartsRows]);

    useEffect(() => {
        onChangeRows?.(createdPartsRows);
    }, [createdPartsRows]);

    // Изменение состава уже созданной части
    const onChangePartItemIdCreatedSelect = (partId: number | undefined, newValue: number) => {
        setCreatedPartsRows(prev => prev?.map(item => {
            if (item.id === partId) {
                return {
                    ...item,
                    partItemId: newValue
                }
            }

            return item;
        }));

        onChangePartItemIdCreated?.(compoundItemId, partId, newValue);
    }

    // Изменение поля количества уже созданной части предмета
    const onChangeNeedCountCreatedInput = (partId: number | undefined, e: any) => {
        setCreatedPartsRows(prev => prev?.map(item => {
            if (item.id === partId) {
                return {
                    ...item,
                    countNeed: e.target.value
                }
            }

            return item;
        }));
    }

    // Изменение поля количества для новой части предмета
    const onChangeNeedCountAppendingInput = (e: any) => {
        setCountNeedSimpleItemInputAppendingValue(e.target.value);
    }

    // Клик на кнопку добавления новой части
    const handleClickAddNewPartBtn = (compoundItemId: number | undefined, partItemId: number | undefined, countNeed: number) => {
        if (partItemId === undefined) {
            alert('Выберите простой предмет');
            return;
        }

        setCreatedPartsRows(prev => [
            ...prev || [],
            {
                compoundItemId: compoundItemId,
                partItemId: partItemId,
                countNeed: countNeed,
            }
        ]);

        onAppendingPartItem?.(compoundItemId, partItemId, countNeed);
    }

    // Клик на кнопку удаления части предмета
    const handleClickDeleteAddingPartBtn = (partId: number | undefined, index: number) => {
        setCreatedPartsRows(prev => prev?.filter((r, i) => i !== index));
        onDeletePartItem?.(compoundItemId, partId);
    }

    return (
        <div className="compound-item-part-wrapper">
            <div className="compound-item-part-wrapper__creation-row">
                <div className="compound-item-part-wrapper__creation-row__select-simple-item">
                    <select
                        value={appendingSimplePartId}
                        onChange={(e) => setAppendingSimplePartId(parseInt(e.target.value))}
                    >
                        <option>
                            Не выбрано
                        </option>
                        {allSimpleItems.map((item) => (
                            <option key={item.id} value={item.id}>
                                {item.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="compound-item-part-wrapper__creation-row__count-simple-item">
                    <input 
                        type="number" 
                        value={countNeedSimpleItemInputAppendingValue}
                        onChange={onChangeNeedCountAppendingInput}
                    />
                </div>
                <div className="compound-item-part-wrapper__creation-row__create-btn">
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            handleClickAddNewPartBtn(compoundItemId, appendingSimplePartId, countNeedSimpleItemInputAppendingValue)
                        }}
                    >
                        Добавить
                    </button>
                </div>
            </div>
            {createdPartsRows?.map((itemPart, index) => (
                <div key={index} className="compound-item-part-wrapper__row">
                    <div className="compound-item-part-wrapper__row__select-simple-item">
                        <select
                            value={itemPart.partItemId}
                            onChange={(e) => onChangePartItemIdCreatedSelect(itemPart.id, parseInt(e.target.value))}
                        >
                            {allSimpleItems.map(item => (
                                <option key={item.id} value={item.id}>
                                    {item.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="compound-item-part-wrapper__row__count-simple-item">
                        <input 
                            type="number" 
                            value={itemPart.countNeed}
                            onChange={(e) => onChangeNeedCountCreatedInput(itemPart.id, e)}
                            onBlur={(e) => onChangeNeedCountCreated?.(compoundItemId, itemPart.id, parseInt(e.target.value))}
                        />
                    </div>
                    <div className="compound-item-part-wrapper__row__delete-btn">
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                handleClickDeleteAddingPartBtn(itemPart.id, index);
                            }}
                        >
                            Удалить
                        </button>
                    </div>
                </div>
            ))}
        </div>
    )
}