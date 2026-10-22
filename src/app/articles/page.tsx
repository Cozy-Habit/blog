'use client';

import { ArticleFeed } from '@/components';
import useArticlesStore from '@/stores/useArticlesStore';
import { useEffect } from 'react';

const Page = () => {
    const articles = useArticlesStore((s) => s.articles);
    const isLoadingArticles = useArticlesStore((s) => s.isLoadingArticles);
    const fetchArticles = useArticlesStore((s) => s.fetchArticles);

    useEffect(() => {
        fetchArticles();
    }, []);

    if (isLoadingArticles) return <p>Loading data...</p>;

    if (articles)
        return (
            <div className="p-8 prose">
                <h1>All Articles</h1>
                <ArticleFeed articles={articles} />
            </div>
        );

    return <p>Couldn't load articles</p>;
};

export default Page;
