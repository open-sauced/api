import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { map } from "rxjs/operators";
import { lastValueFrom } from "rxjs";
import { HttpService } from "@nestjs/axios";
import { AxiosResponse } from "@nestjs/terminus/dist/health-indicator/http/axios.interfaces";

interface ChatResponse {
  choices: { message: { content: string } }[];
}

@Injectable()
export class OpenAiService {
  private readonly apiKey: string;
  private readonly modelName: string;
  private readonly completionsURL: string;

  constructor(private readonly configService: ConfigService, private readonly httpService: HttpService) {
    this.apiKey = this.configService.get<string>("openai.APIKey")!;
    this.modelName = this.configService.get<string>("openai.modelName")!;
    this.completionsURL = this.configService.get<string>("openai.completionsURL")!;
  }

  async generateCompletion(systemMessage: string, userMessage: string, temperature: number): Promise<string> {
    const body = {
      model: this.modelName,
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: userMessage },
      ],
      temperature: temperature / 10,
      n: 1,
    };

    return lastValueFrom(
      this.httpService
        .post(this.completionsURL, body, {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            "Content-type": "application/json",
          },
        })
        .pipe(
          map((response: AxiosResponse<ChatResponse>) => {
            const chatResponse: ChatResponse = response.data;

            return chatResponse.choices[0]?.message.content;
          })
        )
    );
  }
}
