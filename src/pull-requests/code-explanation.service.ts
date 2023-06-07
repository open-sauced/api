import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Fetch } from "@supabase/supabase-js/dist/module/lib/types";

import { GenerateCodeExplanationDto } from "./dtos/create-code-explanation.dto";

interface ChatResponse { choices: { message: { content: string } }[] }

@Injectable()
export class CodeExplanationService {
  constructor (private configService: ConfigService) {}


  private generatePrompt (
    maxLength: number,
  ) {
    return [
      `Generate an explanation for the given code snippet with the specifications mentioned below`,
      `The explanation must be a maximum of ${maxLength} characters.`,
    ].join("\n");
  }

  async generateExplanation (options: GenerateCodeExplanationDto) {
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
