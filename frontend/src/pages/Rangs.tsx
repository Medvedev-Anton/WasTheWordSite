import { useState, useEffect } from 'react';
import axios from 'axios';

interface RangItem {
    id: number,
    name: string,
    thumbnailUrl?: string
}

export default function Rangs() {
    const [rangs, setRangs] = useState<RangItem[]>([]);

    useEffect(() => {
        // axios.delete('/api/rangs/2');

        

        const formData = new FormData();
        formData.append('name', 'testRang');
        // formData.append('thumbnailUrl', 'testUrl');

        axios.post('/api/rangs', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then(response => {
            console.log(response);
        });



        axios.get('/api/rangs').then(response => {
            setRangs(response.data.rangs);
            console.log(rangs);
        });

    }, []);

    return (
        <h1>Rangs</h1>
    );
}