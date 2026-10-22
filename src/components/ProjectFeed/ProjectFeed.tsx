import { Project } from '@/sanity.types';
import { urlFor } from '@/sanity/lib/image';
import { calculateReadingTime } from '@/utils';
import Link from 'next/link';
import Image from 'next/image';
const ProjectFeed = ({ projects }: { projects: Project[] }) => {
    return (
        <ul className="list pl-0 mt-0 list-none">
            {projects.map((project, index) => {
                const readingTime = calculateReadingTime(project.body);

                return (
                    <li key={index} className="p-8 motion-item">
                        <Link
                            href={`/projects/${project.slug?.current}`}
                            className="no-underline"
                        >
                            <div className="flex flex-col gap-4">
                                <div className="flex gap-4 relative">
                                    {project.mainImage ? (
                                        <Image
                                            className="w-full h-full sm:w-full sm:h-80 object-cover rounded-box m-0! motion-image"
                                            src={urlFor(
                                                project.mainImage ?? ''
                                            ).url()}
                                            alt={project.mainImage?.alt ?? ''}
                                            width={
                                                project.mainImage?.hotspot
                                                    ?.width ?? 500
                                            }
                                            height={
                                                project.mainImage?.hotspot
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
                                </div>
                            </div>
                        </Link>
                        <div>
                            <h3 className="card-title">{project.title}</h3>
                            <p className="font-normal">{project.description}</p>
                            <p className=" font-light">
                                {project.tags?.join(', ')}
                            </p>
                            <div className="flex gap-4 items-center flex-row justify-between">
                                <div className="flex gap-4 items-center flex-row justify-between">
                                    <p className=" font-light">
                                        {new Date(
                                            project.publishedAt ?? ''
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
                                <div className="flex gap-4 p-4">
                                    {
                                        <Link
                                            href={`projects/${project.slug?.current}`}
                                        >
                                            <Image
                                                src={'./docs.svg'}
                                                alt=""
                                                height={24}
                                                width={24}
                                                className="btn p-0 m-0!"
                                            />
                                        </Link>
                                    }
                                    {project.links?.map((link) => {
                                        if (link._type === 'repoLink')
                                            return (
                                                <Link href={link.url ?? ''}>
                                                    <Image
                                                        src={'./github.svg'}
                                                        alt=""
                                                        height={16}
                                                        width={16}
                                                        className="btn p-0 m-0!"
                                                    />
                                                </Link>
                                            );

                                        if (link._type === 'websiteLink')
                                            return (
                                                <Link href={link.url ?? ''}>
                                                    <Image
                                                        src={'./external.svg'}
                                                        alt=""
                                                        height={24}
                                                        width={24}
                                                        className="btn p-0 m-0!"
                                                    />
                                                </Link>
                                            );
                                    })}
                                </div>
                            </div>
                        </div>
                    </li>
                );
            })}
        </ul>
    );
};

export default ProjectFeed;
