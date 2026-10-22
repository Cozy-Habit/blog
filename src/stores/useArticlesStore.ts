import { Article } from '@/sanity.types';
import { client } from '@/sanity/lib/client';
import { create } from 'zustand';

type ArticlesStore = {
    articles: Article[] | null;
    isLoadingArticles: boolean;
    setArticles: (articles: Article[]) => void;
    fetchArticles: () => Promise<void>;
};

const useArticlesStore = create<ArticlesStore>()((set, get) => ({
    articles: null,
    isLoadingArticles: false,
    setArticles: async (articles: Article[]) => {
        set({ articles });
    },
    fetchArticles: async () => {
        set({ isLoadingArticles: true });
        const REQUEST = `
            *[_type=="article"]{
                _id,
                title,
                description,
                slug,
                mainImage,
                publishedAt,
                body,
                "characterCount": length(pt::text(body)),
                "wordCount": round(length(pt::text(body)) / 5),
                "readingTime": round((length(pt::text(body)) / 5) / 180)
            }
            `;
        const articles = await client.fetch(REQUEST);
        set({ articles });
        set({ isLoadingArticles: false });
    },
}));

export default useArticlesStore;
