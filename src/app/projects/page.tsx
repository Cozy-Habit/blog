'use client';

import { ProjectFeed } from '@/components';
import useProjectsStore from '@/stores/useProjectsStore';
import { useEffect } from 'react';

const Page = () => {
    const projects = useProjectsStore((s) => s.projects);
    const isLoadingProjects = useProjectsStore((s) => s.isLoadingProjects);
    const fetchProjects = useProjectsStore((s) => s.fetchProjects);

    useEffect(() => {
        fetchProjects();
    }, []);

    if (isLoadingProjects) return <p>Loading data...</p>;

    if (projects)
        return (
            <div className="p-8 prose">
                <h1>All Projects</h1>
                <ProjectFeed projects={projects} />
            </div>
        );

    return <p>Couldn't load projects</p>;
};

export default Page;
