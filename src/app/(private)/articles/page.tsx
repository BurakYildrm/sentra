import { getAllArticles } from "@/actions/article-actions";

import { ArticleAddButton } from "@/components/features/article/article-add-button";
import { ArticleDisplay } from "@/components/features/article/article-display";
import { ErrorPage } from "@/components/layout/error-page";

export default async function ArticlesPage() {
  const { data, error } = await getAllArticles();

  if (error || !data) {
    return <ErrorPage error={error ?? "Unknown error"} />;
  }

  return (
    <div className="flex flex-col gap-4 mt-4">
      <div className="flex flex-row justify-between">
        <h1 className="text-2xl font-bold">Articles</h1>
        <ArticleAddButton />
      </div>
      <ArticleDisplay data={data} />
      <p className="text-muted-foreground text-sm">
        Total articles: {data.length}
      </p>
    </div>
  );
}
