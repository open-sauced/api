import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Fetch } from "@supabase/supabase-js/dist/module/lib/types";

import { GenerateCodeTestSuggestionDto } from "./dtos/create-code-test-suggestion.dto";

interface ChatResponse { choices: { message: { content: string } }[] }

@Injectable()
export class CodeTestSuggestionService {
  constructor (private configService: ConfigService) {}


  private generatePrompt (
    maxLength: number,
  ) {
    return [
      `Generate a test for a given code snippet with the specifications mentioned below`,
      `The code snippet must be a maximum of ${maxLength} characters.`,
      "Exclude anything unnecessary such as translation and instructions. The code snippet you suggest should start with \"```suggestion\" and end with ``` to create a valid GitHub suggestion codeblock. All non-code text or description should be outside of the codeblock.",
    ].join("\n");
  }

  async generateTestSuggestion (options: GenerateCodeTestSuggestionDto) {
    const content = `Code: ${options.code}\n`;

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
                content: this.generatePrompt(options.descriptionLength),
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
