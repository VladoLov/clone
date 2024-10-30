"use client";
import React, { useActionState, useState } from "react";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import MDEditor from "@uiw/react-md-editor";
import { Button } from "./ui/button";
import { Send } from "lucide-react";

import { formSchema } from "@/lib/validation";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { createPitch } from "@/lib/actions";

export default function StartupForm() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pitch, setPitch] = useState("");
  const { toast } = useToast();
  const router = useRouter();
  const handleFormSubmit = async (prevState: any, formData: FormData) => {
    try {
      const formValues = {
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        category: formData.get("category") as string,
        link: formData.get("link") as string,
        pitch,
      };
      await formSchema.parseAsync(formValues);
      console.log(formValues);
      const result = await createPitch(prevState, formData, pitch);
      //   console.log(formValues);
      if (result.status == "SUCCESS") {
        toast({
          title: "Success",
          description: "Your startup created successfully",
        });
        router.push(`/startup/${result._id}`);
      }
      return result;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const filedErrors = error.flatten().fieldErrors;
        setErrors(filedErrors as unknown as Record<string, string>);

        toast({
          title: "Error",
          description: "Please check your inputs and try again",
          variant: "destructive",
        });

        return { ...prevState, error: "Validation failed", status: "ERROR" };
      }
      toast({
        title: "Error",
        description: "Please check yor inputs and try again",
        variant: "destructive",
      });
      return {
        ...prevState,
        error: "An unexpected error has occurred",
        status: "ERROR",
      };
    }
  };
  const [state, formAction, isPending] = useActionState(handleFormSubmit, {
    error: "",
    status: "INITIAL",
  });

  return (
    <form action={formAction} className="startup-form">
      <div className="">
        <label htmlFor="title" className="startup-form_label">
          Title
        </label>
        <Input
          id="title"
          name="title"
          className="startup-form_input"
          placeholder="Startup Title"
          required
        />
        {errors.title && <p className="startup-form_error">{errors.title}</p>}
      </div>
      <div className="">
        <label htmlFor="description" className="startup-form_label">
          Description
        </label>
        <Textarea
          id="description"
          name="description"
          className="startup-form_textarea "
          placeholder="Startup Description"
          required
        />
        {errors.description && (
          <p className="startup-form_error">{errors.description}</p>
        )}
      </div>
      <div className="">
        <label htmlFor="category" className="startup-form_label">
          Category
        </label>
        <Input
          id="category"
          name="category"
          className="startup-form_input "
          placeholder="Startup Category (Tech, Health, Education)"
          required
        />
        {errors.category && (
          <p className="startup-form_error">{errors.category}</p>
        )}
      </div>
      <div className="">
        <label htmlFor="link" className="startup-form_label">
          Image URL
        </label>
        <Input
          id="link"
          name="link"
          className="startup-form_input "
          placeholder="Startup Image URL"
          required
        />
        {errors.link && <p className="startup-form_error">{errors.link}</p>}
      </div>
      <div data-color-mode="light" className="">
        <label htmlFor="pitch" className="startup-form_label">
          Pitch
        </label>
        <MDEditor
          value={pitch}
          onChange={(value) => setPitch(value as string)}
          id="pitch"
          preview="edit"
          height={300}
          style={{ borderRadius: 20, overflow: "hidden" }}
          textareaProps={{
            placeholder:
              "Briefly describe your idea and what problem it solves",
          }}
          previewOptions={{
            disallowedElements: ["style"],
          }}
        />
        {errors.pitch && <p className="startup-form_error">{errors.pitch}</p>}
      </div>
      <Button
        type="submit"
        className="startup-form_btn text-white"
        disabled={isPending}
      >
        {isPending ? "Submitting..." : "Submit Your Pitch"}
        <Send className="size-6 ml-2" />
      </Button>
    </form>
  );
}

/* 
"use client";

import React, { useState } from "react";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import MDEditor from "@uiw/react-md-editor";
import { Button } from "./ui/button";
import { Send } from "lucide-react";
import { formSchema } from "@/lib/validation";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { createPitch } from "@/lib/actions";
import { useFormState } from "react-dom";

export default function StartupForm() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pitch, setPitch] = useState("");
  const { toast } = useToast();
  const router = useRouter();

  const initialState = {
    error: "",
    status: "INITIAL" as const,
  };

  const handleFormSubmit = async (prevState: any, formData: FormData) => {
    try {
      const formValues = {
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        category: formData.get("category") as string,
        link: formData.get("link") as string,
        pitch,
      };

      // Validate form data
      await formSchema.parseAsync(formValues);

      // Clear previous errors
      setErrors({});

      // Submit to server
      const result = await createPitch(prevState, formData, pitch);

      if (result.status === "SUCCESS" && result._id) {
        toast({
          title: "Success",
          description: "Your startup was created successfully",
        });
        router.push(`/startup/${result._id}`);
      }

      return result;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors = error.flatten().fieldErrors;
        setErrors(fieldErrors as Record<string, string>);

        toast({
          title: "Error",
          description: "Please check your inputs and try again",
          variant: "destructive",
        });

        return { ...prevState, error: "Validation failed", status: "ERROR" };
      }

      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });

      return {
        ...prevState,
        error: "An unexpected error has occurred",
        status: "ERROR",
      };
    }
  };

  const [state, formAction] = useFormState(handleFormSubmit, initialState);
  const isPending = state.status === "PENDING";

  return (
    <form action={formAction} className="startup-form space-y-6">
      <div>
        <label
          htmlFor="title"
          className="startup-form_label block text-sm font-medium"
        >
          Title
        </label>
        <Input
          id="title"
          name="title"
          className="startup-form_input mt-1"
          placeholder="Startup Title"
          required
        />
        {errors.title && (
          <p className="startup-form_error text-red-500 text-sm mt-1">
            {errors.title}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="description"
          className="startup-form_label block text-sm font-medium"
        >
          Description
        </label>
        <Textarea
          id="description"
          name="description"
          className="startup-form_textarea mt-1"
          placeholder="Startup Description"
          required
        />
        {errors.description && (
          <p className="startup-form_error text-red-500 text-sm mt-1">
            {errors.description}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="category"
          className="startup-form_label block text-sm font-medium"
        >
          Category
        </label>
        <Input
          id="category"
          name="category"
          className="startup-form_input mt-1"
          placeholder="Startup Category (Tech, Health, Education)"
          required
        />
        {errors.category && (
          <p className="startup-form_error text-red-500 text-sm mt-1">
            {errors.category}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="link"
          className="startup-form_label block text-sm font-medium"
        >
          Image URL
        </label>
        <Input
          id="link"
          name="link"
          className="startup-form_input mt-1"
          placeholder="Startup Image URL"
          required
        />
        {errors.link && (
          <p className="startup-form_error text-red-500 text-sm mt-1">
            {errors.link}
          </p>
        )}
      </div>

      <div data-color-mode="light">
        <label
          htmlFor="pitch"
          className="startup-form_label block text-sm font-medium"
        >
          Pitch
        </label>
        <MDEditor
          value={pitch}
          onChange={(value) => setPitch(value || "")}
          id="pitch"
          preview="edit"
          height={300}
          style={{ borderRadius: 20, overflow: "hidden" }}
          textareaProps={{
            placeholder:
              "Briefly describe your idea and what problem it solves",
          }}
          previewOptions={{
            disallowedElements: ["style"],
          }}
        />
        {errors.pitch && (
          <p className="startup-form_error text-red-500 text-sm mt-1">
            {errors.pitch}
          </p>
        )}
      </div>

      <Button
        type="submit"
        className="startup-form_btn text-white w-full"
        disabled={isPending}
      >
        {isPending ? "Submitting..." : "Submit your pitch"}
        <Send className="size-6 ml-2" />
      </Button>

      {state.error && (
        <p className="text-red-500 text-sm text-center">{state.error}</p>
      )}
    </form>
  );
}
 */
