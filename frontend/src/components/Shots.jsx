import { useEffect, useState } from 'react';
import api from '../api/client';

export default function Shots({ projectId }) {
    const [shots, setShots] = useState([]);
    const test_nums = [1, 3, 5];
    console.log(shots);

    useEffect(() => {
        api.get(`shots/?project=${projectId}`).then((response) => {
            setShots(response.data.results);
        });
    }, [projectId]);

    return (
        <div>
            <h3>Shots</h3>
            <ul>
                {shots.map((shot) => (
                    <li key={shot.id}>{shot.name}</li>
                ))}
            </ul>
        </div>
    );
};
