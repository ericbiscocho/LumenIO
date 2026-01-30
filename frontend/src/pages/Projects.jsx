import { useEffect, useState } from 'react';
import api from '../api/client';
import CreateProject from '../components/CreateProject';
import Shots from '../components/Shots';

export default function Projects() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        api.get('projects/')
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
                        <h4>{project.name}</h4>
                        <Shots projectId={project.id} />
                    </div>
                ))}
            </ul>
        </div>
    );
}
