export const About = () => {
    return (
        <div className="flex p-4 bg-black items-center m-12 rounded-xl opacity-90">
            <div className="text-primary flex gap-5 flex-col">
                <p>&gt; About.txt 🤓</p>
                <p>Hi, I’m Fortune.</p>
                <p>I enjoy writing beautiful code, and sometimes... building beautiful interfaces.</p>
                <p>I’m a lot of things (including a Linux command :p) but at present, I am currently improving my frontend and design skills.</p>
                <p>I enjoy reading (mostly sci-fi) in my spare time, playing vidya gaems, discovering memes, biking, and going on long walks.</p>
                <p>PS: The background of the page is procedurally generated (<a href="http://mrl.nyu.edu/~perlin/noise/" className="hover:underline">sauce</a>) and changes on each refresh. This may make it less responsive on lower-powered mobile devices, but that's a tradeoff I can live with - it still looks hella cool 😎.</p>
            </div>
        </div>
    );
};
