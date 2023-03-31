import { WorkEntry } from "./WorkEntry";
import type { WorkEntryProps } from "./WorkEntry";

export const Experience = ({ workEntries }: { workEntries: WorkEntryProps[] }) => {
    return (
        <div className="flex p-4 bg-black items-center m-12 rounded-xl opacity-90 text-primary">
            <div className="flex gap-2 flex-col">
                <p>&gt; XP Farmed 👾</p>
                <div className="flex gap-4 flex-col p-4">
                    {workEntries.map((workEntry, idx) => (
                        <WorkEntry
                            key={idx}
                            workEntry={workEntry}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};
