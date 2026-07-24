import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBlogPostBySlug } from "@/lib/data/db";

export const revalidate = 0;

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getBlogPostBySlug(params.slug);
  if (!post) return notFound();

  return (
    <article className="container-lg py-20 max-w-3xl mx-auto">
      <div className="text-sm text-slate mb-6">
        <Link href="/blog" className="hover:text-gold">Blog</Link> / {post.title}
      </div>

      <div className="eyebrow mb-3">
        {new Date(post.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
      </div>
      <h1 className="font-display text-3xl md:text-4xl text-ivory mb-8">{post.title}</h1>

      <div className="relative aspect-[16/9] mb-10">
        <Image src={post.image} alt={post.title} fill className="object-cover" />
      </div>

      <div className="space-y-6">
        {post.content.map((para, i) => (
          <p key={i} className="text-ivory/80 leading-relaxed">{para}</p>
        ))}
      </div>

      <div className="edge-top mt-14 pt-8 flex flex-wrap gap-4">
        <Link href="/products" className="bg-gold text-ink px-8 py-3.5 text-sm tracking-wide hover:bg-gold-bright transition-colors">
          Browse Products
        </Link>
        <Link href="/contact" className="border border-gold text-gold px-8 py-3.5 text-sm tracking-wide hover:bg-gold hover:text-ink transition-colors">
          Get a Quote
        </Link>
      </div>
    </article>
  );
}
