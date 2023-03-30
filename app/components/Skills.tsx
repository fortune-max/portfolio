import { Progress } from "./Progress";

export const Skills = () => {
    return (
        <div className="flex flex-col gap-4 p-4 bg-black m-12 rounded-xl text-primary opacity-90">
            <p>&gt; Skills.txt 🧐</p>
            <div className="flex gap-5 flex-col md:flex-row md:gap-24">
                <div className="text-primary flex gap-5 flex-col w-36">
                    <p>
                        <span className="text-2xl">🐍</span> Python
                        <Progress percentage={95} />
                    </p>
                    <p>
                        <span className="text-2xl">⚙️</span> C++
                        <Progress percentage={87} />
                    </p>
                    <p>
                        <span className="text-2xl">⌨️</span> TypeScript
                        <Progress percentage={78} />
                    </p>
                    <p>
                        <span className="text-2xl">🪄</span> Vue
                        <Progress percentage={83} />
                    </p>
                    <p>
                        <span className="text-2xl">😤</span> React
                        <Progress percentage={75} />
                    </p>
                    <p>
                        <span className="text-2xl">👽</span> JavaScript
                        <Progress percentage={85} />
                    </p>
                </div>
                <div className="text-primary flex gap-5 flex-col w-36">
                    <p>
                        <span className="text-2xl">🌯</span> Flask
                        <Progress percentage={93} />
                    </p>
                    <p>
                        <span className="text-2xl">⛓</span> Django
                        <Progress percentage={84} />
                    </p>
                    <p>
                        <span className="text-2xl">💨</span> Kotlin
                        <Progress percentage={75} />
                    </p>
                    <p>
                        <span className="text-2xl">⏭</span> NextJS
                        <Progress percentage={81} />
                    </p>
                    <p>
                        <span className="text-2xl">💻</span> Linux
                        <Progress percentage={90} />
                    </p>
                    <p>
                        <span className="text-2xl">🦕</span> Java
                        <Progress percentage={82} />
                    </p>
                </div>
            </div>
        </div>
    );
};
