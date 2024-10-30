/* "use server";

import { auth } from "@/auth";

import { parseServerActionResponse } from "./utils";
import slugify from "slugify";
import { writeClient } from "@/sanity/lib/write-client";

export const createPitch = async (
  state: any,
  form: FormData,
  pitch: string
) => {
  const session = await auth();

  if (!session)
    return parseServerActionResponse({
      error: "Not signed in",
      status: "ERROR",
    });
  const { title, description, category, link } = Object.fromEntries(
    Array.from(form).filter(([key]) => key === "pitch")
  );
  const slug = slugify(title as string, { lower: true, strict: true });

  try {
    const startup = {
      title,
      description,
      category,
      image: link,
      slug: { _type: slug, current: slug },
      author: {
        _type: "reference",
        _ref: session?.id,
      },
      pitch,
    };
    const result = await writeClient.create({ _type: "startup", ...startup });
    return parseServerActionResponse({
      ...result,
      error: "",
      status: "SUCCESS",
    });
  } catch (error) {
    console.log(error);
    return parseServerActionResponse({
      error: JSON.stringify(error),
      status: "ERROR",
    });
  }
};
 */
"use server";

import { auth } from "@/auth";
import { writeClient } from "@/sanity/lib/write-client";
import slugify from "slugify";

interface ActionState {
  error: string;
  status: "INITIAL" | "SUCCESS" | "ERROR";
  _id?: string;
}

export const createPitch = async (
  prevState: ActionState,
  formData: FormData,
  pitch: string
): Promise<ActionState> => {
  try {
    const session = await auth();

    if (!session) {
      return {
        error: "Not signed in",
        status: "ERROR",
      };
    }

    // Get all form data
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const category = formData.get("category") as string;
    const link = formData.get("link") as string;

    const slug = slugify(title, { lower: true, strict: true });

    const startup = {
      _type: "startup",
      title,
      description,
      category,
      image: link,
      slug: { _type: "slug", current: slug },
      author: {
        _type: "reference",
        _ref: session.id,
      },
      pitch,
    };

    const result = await writeClient.create(startup);

    return {
      error: "",
      status: "SUCCESS",
      _id: result._id,
    };
  } catch (error) {
    console.error(error);
    return {
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
      status: "ERROR",
    };
  }
};
