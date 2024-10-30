import { z } from "zod";

const isImageUrl = (url: string) => {
  try {
    const parsed = new URL(url);
    const pathname = parsed.pathname.toLowerCase();
    return [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg", ".avif"].some(
      (ext) => pathname.endsWith(ext)
    );
  } catch {
    return false;
  }
};

export const formSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().min(20).max(500),
  category: z.string().min(3).max(20),
  link: z
    .string()
    .url("Please enter a valid URL")
    .refine(
      (url) => isImageUrl(url),
      "URL must point to an image file (jpg, jpeg, png, gif, webp, svg, or avif)"
    ),

  /*  .refine(async (url) => {
      try {
        const res = await fetch(url, { method: "HEAD" });
        const contentType = res.headers.get("content-type");
        return contentType?.startsWith("image/");
      } catch {
        return false;
      }
    }), */ pitch: z.string().min(10),
});
