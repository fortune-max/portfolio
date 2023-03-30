import { Polaroid } from "./Polaroid";

type Photo = {
    src: string;
    alt: string;
    description: string;
};

export const Gallery = ({ photos }: { photos: Photo[]}) => {
    return (
        <div className="flex flex-col p-4 bg-black gap-4 m-12 rounded-xl">
            <p className="text-primary">&gt; Gallery 📸</p>
            <div>
                {photos.map((photo, idx) => (
                    <Polaroid
                        key={idx}
                        src={photo.src}
                        alt={photo.alt}
                        description={photo.description}
                    />
                ))}
            </div>
        </div>
    );
};
