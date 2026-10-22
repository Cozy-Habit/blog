import { Journey } from '../../timeline';

const Page = () => {
    return (
        <div className="flex flex-col items-center mt-16 gap-8">
            <div className="badge badge-dash badge-primary">
                <div className="status status-info animate-bounce"></div> My
                journey started here
            </div>

            <ul className="timeline timeline-vertical">
                {Journey.map(({ descr, time, title, completed }, index) => {
                    const isOdd = index % 2 === 0;
                    const nextSectionExists = !!Journey[index + 1];
                    const nextSectionIsCompleted =
                        nextSectionExists && Journey[index + 1].completed;
                    const isLastSection = Journey.length - 1 === index;

                    return (
                        <li key={index}>
                            {completed ? <hr className="bg-primary" /> : <hr />}
                            {isOdd && (
                                <>
                                    <div className="timeline-start timeline-box max-w-100">
                                        <div className="text-right font-extrabold text-sm">
                                            {title}
                                        </div>
                                        <div className="text-right italic text-neutral-500 mb-2">
                                            {time}
                                        </div>
                                        <div className="text-right">
                                            {descr}
                                        </div>
                                    </div>
                                </>
                            )}
                            <div className="timeline-middle">
                                {completed ? (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                        className={
                                            completed
                                                ? 'text-primary h-5 w-5'
                                                : 'text-neutral-400 h-5 w-5'
                                        }
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                ) : (
                                    <div className="inline-grid *:[grid-area:1/1]">
                                        <div className="status status-xl status-info animate-ping"></div>
                                        <div className="status status-xl status-info"></div>
                                    </div>
                                )}
                            </div>
                            {!isOdd && (
                                <>
                                    <div className="timeline-end timeline-box max-w-100">
                                        <div className="font-extrabold text-sm">
                                            {title}{' '}
                                        </div>
                                        <div className="text-neutral-500 italic mb-2">
                                            {time}
                                        </div>
                                        <div>{descr}</div>
                                    </div>
                                </>
                            )}
                            {!isLastSection &&
                            nextSectionExists &&
                            nextSectionIsCompleted ? (
                                <hr className="bg-primary" />
                            ) : (
                                <hr />
                            )}
                        </li>
                    );
                })}
            </ul>
            <div className="flex justify-center mt-8 mb-16">
                <div className="alert alert-info">
                    <span>
                        My journey is just beginning. Stay tuned for more ✨
                    </span>
                </div>
            </div>
        </div>
    );
};

export default Page;
