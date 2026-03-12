import { useEffect, useState } from 'react';
import api from '../api/client';
import Tasks from '../components/Tasks';
import { Shot, ShotStatus, PaginatedResponse } from '../types/api';

type ShotsProps = {
    projectId: number;
};

export default function Shots({ projectId }: ShotsProps) {
    const [shots, setShots] = useState<Shot[]>([]);

    useEffect(() => {
        api.get<PaginatedResponse<Shot>>(`shots/?project=${projectId}`).then((response) => {
            setShots(response.data.results);
        });
    }, [projectId]);

    return (
        <div>
            <h4>Shots</h4>
            <ul>
                {shots.map((shot) => (
                    <li key={shot.id} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span>{shot.name}</span>
                        <select value={shot.status}
                            onChange={async (e: React.ChangeEvent<HTMLSelectElement>) => {
                                const response = await api.patch(`shots/${shot.id}/`, { status: e.target.value as ShotStatus});
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
                <h4>Tasks</h4>
                {shots.map((shot) => (
                    <div key={shot.id}>
                        <Tasks shotId={shot.id} />
                    </div>
                ))}
            </ul>
        </div>
    );
};
