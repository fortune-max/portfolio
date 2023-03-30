type PolaroidProps = {
    src: string;
    alt: string;
    description: string;
};

export const Polaroid = ({ src, alt, description } : PolaroidProps) => {
    return (
        <div className="inline-flex mr-12 mb-24 p-4 bg-gray-200 gap-6 flex-col items-center w-96 h-96 rounded-xl">
            <img
                src={src}
                alt={alt}
                className="rounded-xl h-4/5 object-cover"
            />
            <p className="font-kurale">{description}</p>
        </div>
    );
};
