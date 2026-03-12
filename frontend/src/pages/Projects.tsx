import { useEffect, useState } from 'react';
import api from '../api/client';
import CreateProject from '../components/CreateProject';
import Shots from '../components/Shots';
import { Project, PaginatedResponse } from '../types/api';

export default function Projects() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        api.get<PaginatedResponse<Project>>('projects/')
            .then((response) => setProjects(response.data.results))
            .catch((error) => {
                console.error(error);
                setError('Failed to load projects.');
            })
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <p>Loading projects...</p>;

    if (error) return <p>{error}</p>;

    return (
        <div>
            <h2>Projects</h2>
            <CreateProject onCreated={(project) => setProjects((prev) => [...prev, project])} />
            <ul>
                {projects.map((project) => (
                    <div key={project.id}>
                        <h3>{project.name}</h3>
                        <Shots projectId={project.id} />
                    </div>
                ))}
            </ul>
        </div>
    );
}
