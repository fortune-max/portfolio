import { About } from "~/components/About";
import { Awards } from "~/components/Awards";
import { Background } from "~/components/Background";
import { Experience } from "~/components/Experience";
import { Gallery } from "~/components/Gallery";
import { Projects } from "~/components/Projects";
import { Skills } from "~/components/Skills";
import photos from "../photos.json";

export default function Index() {
  return (
    <div>
      <About/>
      <Skills />
      <Experience />
      <Awards />
      <Projects />
      <Gallery photos={photos} />
      <Background />
    </div>
  );
}
