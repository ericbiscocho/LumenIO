import { useEffect, useState } from 'react';
import api from '../api/client';

export default function Shots({ projectId }) {
    const [shots, setShots] = useState([]);

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
                    <li style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span>{shot.name}</span>
                        <select value={shot.status}
                            onChange={async (e) => {
                                const response = await api.patch(`shots/${shot.id}/`, { status: e.target.value });
                                setShots((prevStatus) => prevStatus.map((test) => test.id === shot.id ? response.data : test));
                            }}>
                            <option value='not_started'>Not Started</option>
                            <option value='in_progress'>In Progress</option>
                            <option value='completed'>Completed</option>
                            <option value='approved'>Approved</option>
                            <option value='on_hold'>On Hold</option>
                        </select>
                    </li>
                ))}
            </ul>
        </div>
    );
};
