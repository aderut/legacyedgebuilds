import ReviewForm from "@/components/ReviewForm";
import Reveal from "@/components/Reveal";
import { getApprovedReviews } from "@/lib/data/db";

export const revalidate = 0;

export default async function ReviewsPage() {
  const reviews = await getApprovedReviews();

  return (
    <section className="container-lg py-20">
      <div className="eyebrow mb-3">Testimonials</div>
      <h1 className="font-display text-4xl text-ivory mb-4">Reviews</h1>
      <p className="text-slate max-w-xl mb-14">
        Real feedback from clients we've supplied. Worked with us? We'd love to hear
        about it.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-14">
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {reviews.map((r, i) => (
              <Reveal key={r.id} delay={(i % 4) * 80}>
                <div className="edge-top pt-6 bg-charcoal p-6">
                  <div className="text-gold mb-3 text-sm">{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</div>
                  <p className="text-sm text-ivory/80 leading-relaxed mb-4">&ldquo;{r.message}&rdquo;</p>
                  <div className="text-xs text-slate">— {r.name}</div>
                </div>
              </Reveal>
            ))}
            {reviews.length === 0 && (
              <p className="text-slate text-sm col-span-full">No reviews yet — be the first to leave one.</p>
            )}
          </div>
        </div>

        <div>
          <h2 className="font-display text-xl text-ivory mb-6">Leave a Review</h2>
          <ReviewForm />
        </div>
      </div>
    </section>
  );
}
