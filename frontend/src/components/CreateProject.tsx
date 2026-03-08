import { useState } from 'react';
import api from '../api/client';
import type { Project } from '../types/api';

type CreateProjectProps = {
    onCreated: (project: Project) => void;
};

export default function CreateProject({ onCreated }: CreateProjectProps) {
    const [name, setName] = useState('');

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        const response = await api.post('projects/', { name });
        onCreated(response.data);
        setName('');
    };

    return (
        <form onSubmit={submit}>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder='Project Name'
            />
            <button type='submit'>Create</button>
        </form>
    );
};
