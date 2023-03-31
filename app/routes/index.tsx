import { About } from "~/components/About";
import { Awards } from "~/components/Awards";
import { Background } from "~/components/Background";
import { Experience } from "~/components/Experience";
import { Gallery } from "~/components/Gallery";
import { Projects } from "~/components/Projects";
import { Skills } from "~/components/Skills";
import { sdk } from '~/libs/client';
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export async function loader() {
  const { photos } = await sdk.Photos();
  const { photos: nextPhotos } = await sdk.PhotosSecond({ skip: 10 });
  photos.push(...nextPhotos);

  const { workExperiences } = await sdk.WorkExperiences();

  return json({ photos, workExperiences });
}

export default function Index() {
  const { photos, workExperiences } = useLoaderData<typeof loader>();

  return (
    <div>
      <About/>
      <Skills />
      <Experience workEntries={workExperiences} />
      <Awards />
      <Projects />
      <Gallery photos={photos} />
      <Background />
    </div>
  );
}
