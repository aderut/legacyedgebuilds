import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import { getBlogPosts } from "@/lib/data/db";

export const revalidate = 0;

export default async function BlogPage() {
  const blogPosts = await getBlogPosts();

  return (
    <section className="container-lg py-20">
      <div className="eyebrow mb-3">Resources</div>
      <h1 className="font-display text-4xl text-ivory mb-4">Blog</h1>
      <p className="text-slate max-w-xl mb-14">
        Guidance on choosing and living with interior finishing materials in Nigerian
        homes and commercial spaces.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {blogPosts.map((post, i) => (
          <Reveal key={post.id} delay={(i % 2) * 100}>
            <Link href={`/blog/${post.slug}`} className="group block">
              <div className="relative aspect-[16/10] overflow-hidden mb-5">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="eyebrow mb-2">
                {new Date(post.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
              </div>
              <h2 className="font-display text-xl text-ivory mb-2 group-hover:text-gold transition-colors">
                {post.title}
              </h2>
              <p className="text-sm text-slate leading-relaxed">{post.excerpt}</p>
            </Link>
          </Reveal>
        ))}
        {blogPosts.length === 0 && <p className="text-slate text-sm">No articles published yet.</p>}
      </div>
    </section>
  );
}
