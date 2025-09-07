"use client";

import { Plus } from "lucide-react";
import { useState } from "react";

import { Button } from "../../ui/button";
import { ArticleFormDialog } from "./article-form-dialog";

export function ArticleAddButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setOpen(true)}
        className="max-sm:size-8 sm:flex sm:flex-row sm:items-center sm:gap-2"
      >
        <Plus />
        <span className="hidden sm:block">Add Article</span>
      </Button>
      <ArticleFormDialog
        title="Add Article"
        description="Add a new article to the system"
        open={open}
        setOpen={setOpen}
      />
    </>
  );
}
