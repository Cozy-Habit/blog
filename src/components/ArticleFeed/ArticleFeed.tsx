import { Article } from '@/sanity.types';
import { calculateReadingTime } from '@/utils';
import Image from 'next/image';
import Link from 'next/link';
import { urlFor } from '@/sanity/lib/image';

const ArticleFeed = ({ articles }: { articles: Article[] }) => {
    return (
        <ul className="list pl-0 mt-0">
            {articles.map((article, index) => {
                const readingTime = calculateReadingTime(article.body);

                return (
                    <li key={index} className="list-row px-8 motion-item">
                        <Link
                            href={`/articles/${article.slug?.current}`}
                            className="no-underline"
                        >
                            <div className="flex  gap-4">
                                {article.mainImage ? (
                                    <Image
                                        className="size-24 rounded-box m-0! motion-image"
                                        src={urlFor(
                                            article.mainImage ?? ''
                                        ).url()}
                                        alt={article.mainImage?.alt ?? ''}
                                        width={
                                            article.mainImage?.hotspot?.width ??
                                            500
                                        }
                                        height={
                                            article.mainImage?.hotspot
                                                ?.height ?? 400
                                        }
                                    />
                                ) : (
                                    <Image
                                        className="w-full h-full sm:w-full sm:h-80 object-cover rounded-box m-0! motion-image"
                                        src={''}
                                        alt={''}
                                        width={500}
                                        height={400}
                                    />
                                )}
                                <div>
                                    <h3 className="card-title mt-0 mb-0">
                                        {article.title}
                                    </h3>
                                    <p className="font-normal">
                                        {article.description}
                                    </p>
                                    <div className="flex gap-4 items-center">
                                        <p className=" font-light">
                                            {new Date(
                                                article.publishedAt ?? ''
                                            ).toLocaleDateString('en-EN', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                            })}
                                        </p>
                                        <div className="badge badge-soft badge-primary badge-sm">
                                            {readingTime} min
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </li>
                );
            })}
        </ul>
    );
};

export default ArticleFeed;
