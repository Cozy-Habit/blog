'use client';

import { AssetType } from '@/app/[...slug]/page';
import { CommentSection } from '@/components';
import { Article, Project } from '@/sanity.types';
import { urlFor } from '@/sanity/lib/image';
import useArticlesStore from '@/stores/useArticlesStore';
import useProjectsStore from '@/stores/useProjectsStore';
import { PortableText, PortableTextComponents } from 'next-sanity';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface CodeBlockProps {
  value: {
    code: string;
    language?: string;
    filename?: string;
  };
}

export const SanityCodeBlock = ({ value }: CodeBlockProps) => {
  if (!value?.code) return null;

  return (
    <div className="my-6 overflow-hidden rounded-lg bg-zinc-900 border border-zinc-800">
      {value.filename && (
        <div className="bg-zinc-800 px-4 py-1.5 text-xs text-zinc-400 border-b border-zinc-700 font-mono">
          {value.filename}
        </div>
      )}
      <div className="p-4 overflow-x-auto text-sm">
        <SyntaxHighlighter
          language={value.language || 'javascript'}
          style={vscDarkPlus}
          customStyle={{ margin: 0, padding: 0, background: 'transparent' }}
        >
          {value.code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};

const portableTextComponents: PortableTextComponents = {
  types: {
    // Map the '_type: "code"' from your Sanity schema to your custom component
    code: SanityCodeBlock,
  },
};

export default function DetailPage({
    postType,
    slug,
}: {
    postType: AssetType;
    slug: string;
}) {
    const [post, setPost] = useState<Article | Project | null>(null);
    const projects = useProjectsStore((s) => s.projects);
    const articles = useArticlesStore((s) => s.articles);
    const isLoadingProjects = useProjectsStore((s) => s.isLoadingProjects);
    const isLoadingArticles = useArticlesStore((s) => s.isLoadingArticles);
    const fetchProjects = useProjectsStore((s) => s.fetchProjects);
    const fetchArticles = useArticlesStore((s) => s.fetchArticles);

    useEffect(() => {
        fetchArticles();
        fetchProjects();
    }, []);

    useEffect(() => {
        switch (postType) {
            case 'projects': {
                const filteredPost = projects?.find(
                    (project) => project.slug?.current === slug
                );

                if (filteredPost) setPost(filteredPost);
                break;
            }
            case 'articles': {
                const filteredPost = articles?.find(
                    (article) => article.slug?.current === slug
                );

                if (filteredPost) setPost(filteredPost);
                break;
            }
        }
    }, [slug, postType, articles, projects]);

    if (isLoadingProjects || isLoadingArticles) return <p>Loading post...</p>;

    console.log(post?.body);
    if (post)
        return (
            <div className="pt-8 prose">
                 {post.mainImage ? <Image
                    className="w-full h-full sm:w-full sm:h-80 object-cover rounded-box m-0! motion-image"                                      
                    src={urlFor(post.mainImage ?? "").url()}
                    alt={post.mainImage?.alt ?? ""}
                    width={post.mainImage?.hotspot?.width ?? 500}
                    height={post.mainImage?.hotspot?.height ?? 400}
                /> : <Image
                    className="w-full h-full sm:w-full sm:h-80 object-cover rounded-box m-0! motion-image"                                      
                    src={""}
                    alt={""}
                    width={500}
                    height={400}
                />}
                <br/>
                <PortableText value={post.body} components={portableTextComponents} />
                <hr />

                <CommentSection />
            </div>
        );
}
