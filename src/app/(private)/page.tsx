import { getAllArticles } from "@/actions/article-actions";
import { getAllUsers } from "@/actions/user-actions";

import { ChartDisplay } from "@/components/features/home/chart-display";

export default async function Home() {
  const articlesPromise = getAllArticles();
  const usersPromise = getAllUsers();
  const [articles, users] = await Promise.all([articlesPromise, usersPromise]);

  if (articles.error || users.error || !articles.data || !users.data) {
    return <div>Error: {articles.error?.message || users.error?.message}</div>;
  }

  const chartData = [
    {
      name: "articles",
      value: articles.data.length,
      fill: "var(--color-articles)",
    },
    { name: "users", value: users.data.length, fill: "var(--color-users)" },
  ];

  const chartConfig = {
    articles: {
      label: "Articles",
      color: "var(--chart-1)",
    },
    users: {
      label: "Users",
      color: "var(--chart-2)",
    },
  };

  return (
    <main className="flex flex-col items-center justify-center gap-3">
      <ChartDisplay data={chartData} config={chartConfig} />
      <p className="text-muted-foreground leading-none">
        Showing total of {articles.data.length + users.data.length} resources
      </p>
    </main>
  );
}
