import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Fetch } from "@supabase/supabase-js/dist/module/lib/types";

import { GeneratePullRequestDescriptionDto } from "./dtos/create-pull-request-description.dto";

interface ChatResponse { choices: { message: { content: string } }[] }

@Injectable()
export class PullRequestDescriptionService {
  constructor (private configService: ConfigService) {}

  private generatePrompt (
    language: string,
    maxLength: number,
    tone: string,
  ) {
    return [
      `Generate an apt github PR description written in present tense and ${tone} tone for the given code diff/commit-messages with the specifications mentioned below`,
      `Description language: ${language}`,
      `Description must be a maximum of ${maxLength} characters.`,
      "Exclude anything unnecessary such as translation. Your entire response will be passed directly into a pull request description",
    ].join("\n");
  }

  async generateDescription (options: GeneratePullRequestDescriptionDto) {
    const content = `${options.diff ? `Diff: ${options.diff}\n` : ""}${options.commitMessages ? `\nCommit Messages: ${options.commitMessages.join(",")}` : ""}`;

    try {
      // eslint-disable-next-line
      const fetcher: Fetch = typeof fetch !== 'undefined' ? fetch : require("node-fetch") as Fetch;
      const response = await fetcher(this.configService.get<string>("openai.completionsURL")!, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.configService.get<string>("openai.APIKey")!}`,
          "Content-type": "application/json",
        },
        body: JSON.stringify(
          {
            model: this.configService.get<string>("openai.modelName"),
            messages: [
              {
                role: "system",
                content: this.generatePrompt(options.language, options.length, options.tone),
              },
              {
                role: "user",
                content,
              },
            ],
            temperature: options.temperature / 10,
            n: 1,
          },
        ),
      });

      if (response.ok) {
        const data = await response.json() as ChatResponse;

        return data.choices[0]?.message.content;
      }

      throw new Error(response.statusText);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("OpenAI error: ", error.message);
      }
    }
  }
}
