import Image from "next/image";
import Reveal from "@/components/Reveal";

const values = [
  { title: "Mission", text: "To supply premium, dependable interior finishing materials that make quality spaces achievable for every Nigerian home and business." },
  { title: "Vision", text: "To be the most trusted name in interior materials supply across Nigeria — known as much for reliability as for finish quality." },
  { title: "Core Values", text: "Quality without compromise, honest guidance for every client, and delivery that respects your project timeline." },
];

export default function AboutPage() {
  return (
    <section className="container-lg py-20">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-14 items-center mb-24">
        <Reveal>
          <div className="eyebrow mb-3">Our Story</div>
          <h1 className="font-display text-4xl text-ivory mb-6">About Legacy Edge Builds</h1>
          <p className="text-slate leading-relaxed">
            Legacy Edge Builds supplies premium interior finishing materials designed to
            help homeowners, contractors, architects, and designers create beautiful
            spaces that stand the test of time. From flooring to wall finishes and
            hardware, every product we carry is chosen for how it performs long after
            installation — not just how it looks on day one.
          </p>
        </Reveal>
        <Reveal delay={150}>
          <div className="relative aspect-[4/3]">
            <Image
              src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200"
              alt="Legacy Edge Builds office"
              fill
              className="object-cover"
            />
          </div>
        </Reveal>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {values.map((v, i) => (
          <Reveal key={v.title} delay={i * 100}>
            <div className="edge-top pt-6">
              <h2 className="font-display text-xl text-gold mb-3">{v.title}</h2>
              <p className="text-sm text-ivory/80 leading-relaxed">{v.text}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
