import { Project } from '@/sanity.types';
import { client } from '@/sanity/lib/client';
import { create } from 'zustand';

type ProjectsStore = {
    projects: Project[] | null;
    isLoadingProjects: boolean;
    setProjects: (projects: Project[]) => void;
    fetchProjects: () => Promise<void>;
};

const useProjectsStore = create<ProjectsStore>()((set, get) => ({
    projects: null,
    isLoadingProjects: false,
    setProjects: (projects: Project[]) => {
        set({ projects });
    },
    fetchProjects: async () => {
        set({ isLoadingProjects: true });
        const REQUEST = `
                *[_type=="project"]{
                    _id,
                    title,
                    description,
                    slug,
                    links,
                    tags,
                    mainImage,
                    publishedAt,
                    body,
                    "characterCount": length(pt::text(body)),
                    "wordCount": round(length(pt::text(body)) / 5),
                    "readingTime": round((length(pt::text(body)) / 5) / 180)
                } | order(publishedAt desc)
                `;
        const projects = await client.fetch(REQUEST);
        set({ projects });
        set({ isLoadingProjects: false });
    },
}));

export default useProjectsStore;
