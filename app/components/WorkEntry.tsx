import type { WorkExperience } from "~/generated/graphql";

type Work = Pick<WorkExperience, "title" | "position" | "duration" | "description"> & { technologies?: string[] };

export const WorkEntry = ({ workEntry }: { workEntry: Work }) => {
    return (
        <div className="flex flex-col gap-4">
            <div className="flex justify-between">
                <div className="flex flex-col">
                    <p className="font-bold">{workEntry.title}</p>
                    <p className="text-gray-400">{workEntry.position}</p>
                </div>
                <p className="text-gray-400">{`(${workEntry.duration})`}</p>
            </div>
            <div className="flex flex-col gap-2">
                <p>{workEntry.description}</p>
                <div className="flex flex-wrap gap-2">
                    <ul>
                        {workEntry.technologies?.map((technology, idx) => (
                            <li 
                                className="list-disc"
                                key={idx}>{technology}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};
