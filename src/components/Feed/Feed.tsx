'use client';

import Link from 'next/link';
import ArticleFeed from '../ArticleFeed/ArticleFeed';
import ProjectFeed from '../ProjectFeed/ProjectFeed';
import useArticlesStore from '@/stores/useArticlesStore';
import useProjectsStore from '@/stores/useProjectsStore';
import { useEffect } from 'react';

const Feed = () => {
    const projects = useProjectsStore((s) => s.projects);
    const isLoadingProjects = useProjectsStore((s) => s.isLoadingProjects);
    const fetchProjects = useProjectsStore((s) => s.fetchProjects);
    const articles = useArticlesStore((s) => s.articles);
    const isLoadingArticles = useArticlesStore((s) => s.isLoadingArticles);
    const fetchArticles = useArticlesStore((s) => s.fetchArticles);

    useEffect(() => {
        fetchArticles();
        fetchProjects();
    }, []);

    if (isLoadingProjects || isLoadingArticles) return <p>Loading data...</p>;

    return (
        <>
            {articles && (
                <div className="pt-8 pb-8">
                    <h2 className="p-8 pb-2 h-1 tracking-wide text-3xl mb-12 mt-0 k">
                        Latest Articles...
                    </h2>
                    <ArticleFeed articles={articles?.slice(0, 5)} />
                    {articles.length > 5 && (
                        <Link
                            className="btn flex justify-center"
                            href="/articles"
                        >
                            See all articles
                        </Link>
                    )}
                </div>
            )}
            {projects && (
                <div className="pt-8 pb-8">
                    <h2 className="p-8 pb-2 h-1 tracking-wide text-3xl mb-12 mt-0 k">
                        Latest Projects...
                    </h2>
                    <ProjectFeed projects={projects.slice(0, 3)} />
                    {projects.length > 3 && (
                        <Link
                            className="btn flex justify-center"
                            href="/projects"
                        >
                            See all projects
                        </Link>
                    )}
                </div>
            )}
            {/* <h2>Helpful resources...</h2>
            npm caching:
            https://medium.com/@ruben.alapont/npm-caching-speeding-up-your-development-process-340dcdc554b3 */}
        </>
    );
};

export default Feed;
