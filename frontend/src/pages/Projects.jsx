import { useEffect, useState } from 'react';
import api from '../api/client';
import CreateProject from '../components/CreateProject';

export default function Projects() {
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        api.get('projects/')
          .then((response) => setProjects(response.data.results))
          .catch(console.error);
    }, []);

    return (
        <div>
            <h2>Projects</h2>
            <CreateProject onCreated={(project) => setProjects((prev) => [...prev, project])} />
            <ul>
                {projects.map((project) => (
                    <li key={project.id}>{project.name}</li>
                ))}
            </ul>
        </div>
    );
}
