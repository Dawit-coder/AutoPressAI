import { inngest } from "../client";
import { fetchArticles } from "@/lib/news";

  export default inngest.createFunction({id: "newsletter/scheduled"}, {event: "newsletter.schedule"},
    async ({event, step, runId}) => {

      const categories = ["technology", "business", "politics"];
        const allArticles = await step.run("fetch-news", async () => {
            

            return fetchArticles(categories);
        });

        const summery = await step.ai.infer("summerize-news", {
          model: step.ai.models.openai({model: "gpt-4o"}),
          body: {
            messages: [
              {
                role: "system",
                content: `You are an expert newsletter editor creating a personalized newsletter. 
                Write a concise, engaging summary that:
                - Highlights the most important stories
                - Provides context and insights
                - Uses a friendly, conversational tone
                - Is well-structured with clear sections
                - Keeps the reader informed and engaged
                Format the response as a proper newsletter with a title and organized content.
                Make it email-friendly with clear sections and engaging subject lines.`,
              },
              {
                role: "user",
                content: `create a newsletter summery for these articles from the past week. Categories requested: ${categories.join(", ")}
                Articles:
                ${allArticles.map((article: any, idx: number)=> `${idx + 1}.${article.title}\n  ${
                  articles.descriptioon
                  }\n Source: ${article.url}\n`).join("\n")}
                `
              }
            ]
          }
        });
        console.log(summery.choices[0].message.content)
    }
  );