import Socials from '../Socials/Socials';

const Hero = () => {
    return (
        <div className="p-8">
            <h1 className="underline decoration-sky-200/60 decoration-6">
                Hi, I&apos;m Sophia 👋🏻✨
            </h1>
            <div className="w-40 rounded-xl"></div>
            <p>
                I'm a curious Computer Science student on a quest for my
                Bachelor's degree and the perfect cup of coffee ☕. I’m
                especially into frontend development, web wizardry, and making
                the internet a more accessible place for everyone—because good
                design should include everyone, not just the lucky few.
                <br />
                <br />
                👩🏼‍💻 Working on UX, React, Typescript and Web Accessibility
                <br />
                🧠 Currently learning Advanced Typescript and peaking into
                Backend technologies
                <br />
                👀 Looking forward to improving my knowledge on automization and
                performance optimization
                <br />
                ✨ Fun fact: I love a well-made flat white coffee and summer
                night strolls
                <br />
                <br />
                Current focus:
                <br />
                🎨 Revamping my portfolio
                <br />
                👩🏼‍💻 Personal projects
                <br />
                🧹 Brushing up on fundamentals
                <br />
                🔮 Losing track of my exponentially growing Obsidian wiki
                <br />
            </p>

            <Socials />
        </div>
    );
};

export default Hero;
