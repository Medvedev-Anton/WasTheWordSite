import axios from "axios";
import { useEffect, useState } from "react";
import './SuborgsDashboardTable.css';

const ORG_HIERARCHY: Record<string, string> = {
    'Производственная': 'Цех',
    'Коммерческая': 'Магазин',
    'Административная': 'Отдел',
    'Образовательная': 'Факультет',
    'Правительственная': 'Департамент',
    'Банковская': 'Филиал',
    'Волонтёрская': 'Отряд',
    'Спортивная': 'Отряд',
    'Свободная': 'Группа',
    'Группа': 'Раздел',
    'Цех': 'Мастерская',
    'Магазин': 'Отдел',
    'Отдел': 'Сектор',
    'Департамент': 'Управление',
    'Филиал': 'Отделение',
    'Факультет': 'Кафедра',
    'Отряд': 'Звено',
};

export default function SuborgsDashboardTable({ orgType }) {
    const subOrgType = ORG_HIERARCHY[orgType];
    const doubleSubOrgType = ORG_HIERARCHY[subOrgType] || null;

    let SUBORGS_TYPES = [
        subOrgType
    ];

    if (doubleSubOrgType != null) {
        SUBORGS_TYPES.push(doubleSubOrgType);
    }

    const [creationPrices, setCreationPrices] = useState<Record<string, number>>({});

    useEffect(() => {
        fetchGetCreationPrices();
    }, []);

    // Получает цены создания организаций
    const fetchGetCreationPrices = async () => {
        const result = await axios.get('/api/orgs/creation-prices/all');
        const prices = result.data.prices;

        const normalized = Object.entries(prices).reduce(
            (acc, [orgType, price]: [string, any]) => ({
                ...acc,
                [orgType]: price / 100
            }),
            {} as Record<string, number>
        );

        setCreationPrices(normalized);
    } 

    // Обрабатывает изменение цены создания организации
    const handleChangeOrgCreationPrice = (e: any) => {
        const orgType = e.target.getAttribute('data-type');
        const newPrice = e.target.value;

        setCreationPrices(prev => ({ ...prev, [orgType as string]: newPrice }));
    }

    // Отправляет запрос на обновление цены создания организации
    const fetchBlurOrgCreationPrice = (e: any) => {
        const orgType = e.target.getAttribute('data-type');
        let newPrice = e.target.value;

        if (newPrice === '') {
            newPrice = 0;
            setCreationPrices(prev => ({ ...prev, [orgType as string]: newPrice }));
        }

        axios.post('/api/orgs/creation-prices', {
            orgType: orgType,
            newPrice: newPrice * 100
        });
    }

    return (
        <div className="suborgs-table-wrapper">
            <div className="resources-for-org-creation">
                <h2>
                    Ресурсы и предметы необходимые<br /> для создания подорганизаций
                </h2>
                <div className="resources-table">
                    <div className="resources-table-head">
                        <div className="resources-table-head-ceil resources-table-ceil resources-table-ceil-first">
                            <span>Тип организации</span>
                        </div>
                        <div className="resources-table-head-ceil resources-table-ceil">
                            <span>Цена создания</span>
                        </div>
                        <div className="resources-table-head-ceil resources-table-ceil">
                            <span>Энергия</span>
                        </div>
                        <div className="resources-table-head-ceil resources-table-ceil">
                            <span>Ресурсы для создания</span>
                        </div>
                        <div className="resources-table-head-ceil resources-table-ceil">
                            <span>Предметы</span>
                        </div>
                    </div>
                    <div className="resources-table-content">
                        {
                            SUBORGS_TYPES.map(type => {
                                return (
                                    <div className="resources-table-content-row">
                                        <div className="resources-table-content-ceil resources-table-ceil resources-table-ceil-first">
                                            <span>{type}</span>
                                        </div>
                                        <div className="resources-table-content-ceil resources-table-ceil">
                                            <input 
                                                type="number"
                                                className="input-with-dollar-back"
                                                value={creationPrices[type]}
                                                data-type={type}
                                                onChange={handleChangeOrgCreationPrice}
                                                onBlur={fetchBlurOrgCreationPrice}
                                            />
                                        </div>
                                        <div className="resources-table-content-ceil resources-table-ceil">
                                            <input 
                                                type="number"
                                                 
                                            />
                                        </div>
                                        <div className="resources-table-content-ceil resources-table-ceil">
                                            <input 
                                                type="number"
                                                 
                                            />
                                        </div>
                                        <div className="resources-table-content-ceil resources-table-ceil">
                                            <input 
                                                type="number"
                                                 
                                            />
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}