"use client";
import { X } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function SearchFormReset() {
  function reset() {
    const form = document.querySelector(".search-form") as HTMLFormElement;
    if (form) {
      form.reset();
    }
  }
  return (
    <button type="reset" onClick={reset} className="">
      <Link href="/" className="search-btn text-white">
        <X className="size-5" />
      </Link>
    </button>
  );
}
