import BlogForm from "@/components/admin/BlogForm";

export default function NewBlogPostPage() {
  return (
    <div className="container-lg py-10">
      <div className="eyebrow mb-2">Resources</div>
      <h1 className="font-display text-3xl text-ivory mb-10">Add Post</h1>
      <BlogForm />
    </div>
  );
}
