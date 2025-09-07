"use client";

import { MoreVertical, Trash } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ArticleDeleteAlertDialog } from "./article-delete-alert-dialog";
import { ArticleFormDialog } from "./article-form-dialog";

import { Tables } from "@/types/database.types";

export type ArticleDisplayProps = {
  data: Tables<"articles">[];
};

export function ArticleDisplay({ data }: ArticleDisplayProps) {
  const [openDialog, setOpenDialog] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [articleSelected, setArticleSelected] = useState<
    Tables<"articles"> | undefined
  >(undefined);

  const onDelete = (article: Tables<"articles">) => {
    setArticleSelected(article);
    setOpenAlert(true);
  };

  const onShow = (article: Tables<"articles">) => {
    setArticleSelected(article);
    setOpenDialog(true);
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:flex-wrap gap-4">
        {data.map((article) => (
          <Card
            key={article.id}
            className="w-full sm:w-xs sm:h-42 h-52 overflow-hidden relative cursor-pointer"
            onClick={() => onShow(article)}
          >
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8 absolute top-2 right-2"
                >
                  <MoreVertical />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(article);
                  }}
                  onPointerDown={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <Trash />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <CardHeader>
              <CardTitle>{article.title}</CardTitle>
              <p className="text-xs text-muted-foreground">
                {new Date(article.updated_at).toLocaleDateString()}
              </p>
            </CardHeader>
            <CardContent className="overflow-hidden">
              <p className="text-sm whitespace-pre-wrap line-clamp-5 sm:line-clamp-3">
                {article.content}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      {articleSelected && (
        <>
          <ArticleFormDialog
            article={articleSelected}
            title={`Article ${articleSelected?.id}`}
            description={`Article ${articleSelected?.id}`}
            isDescriptionVisible={false}
            open={openDialog}
            setOpen={setOpenDialog}
          />
          <ArticleDeleteAlertDialog
            article_id={articleSelected!.id}
            open={openAlert}
            setOpen={setOpenAlert}
          />
        </>
      )}
    </>
  );
}
