import { Injectable } from "@nestjs/common";
import { Fetch } from "@supabase/supabase-js/dist/module/lib/types";
import { ConfigService } from "@nestjs/config";

interface ChatResponse {
  choices: { message: { content: string } }[];
}

@Injectable()
export class OpenAiService {
  constructor(private configService: ConfigService) {}

  async generateCompletion(systemMessage: string, userMessage: string, temperature: number) {
    // eslint-disable-next-line
    const fetcher: Fetch = typeof fetch !== "undefined" ? fetch : (require("node-fetch") as Fetch);
    const response = await fetcher(this.configService.get<string>("openai.completionsURL")!, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.configService.get<string>("openai.APIKey")!}`,
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        model: this.configService.get<string>("openai.modelName"),
        messages: [
          {
            role: "system",
            content: systemMessage,
          },
          {
            role: "user",
            content: userMessage,
          },
        ],
        temperature: temperature / 10,
        n: 1,
      }),
    });

    if (response.ok) {
      const data = (await response.json()) as ChatResponse;

      return data.choices[0]?.message.content;
    }

    throw new Error(response.statusText);
  }
}
