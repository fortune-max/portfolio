import { Polaroid } from "./Polaroid";
import type { Photo } from "./Polaroid";

export const Gallery = ({ photos }: { photos: Photo[]}) => {
    return (
        <div className="flex flex-col p-4 bg-black gap-4 m-12 rounded-xl opacity-90">
            <p className="text-primary">&gt; Gallery 📸</p>
            <div className="max-[768px]:flex max-[768px]:items-center max-[768px]:flex-col">
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
