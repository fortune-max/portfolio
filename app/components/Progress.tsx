export const Progress = ({ percentage, width=30 } : { percentage: number, width?: number }) => {
    const equalCount = Math.round(percentage / 100 * width) - 1;
    const spaceCount = width - equalCount;

    return (
        <div className="text-primary">
            <span>{`[${'='.repeat(equalCount)}>`}</span>
            {Array.from({ length: spaceCount }).map((_, i) => <span key={i}>&nbsp;</span>)}
            <span>{`${percentage}%]`}</span>
        </div>
    )
};
