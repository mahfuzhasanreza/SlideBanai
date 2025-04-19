import OpenAI from 'openai';

/**
 * Service for AI operations using OpenAI
 */
export class AiService {
  private openai: OpenAI;
  
  /**
   * Creates a new instance of AiService
   */
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  
  /**
   * Generate a summary from OCR extracted text
   * @param text The OCR extracted text to summarize
   * @returns Summarized text
   */
  async summarizeText(text: string): Promise<string> {
    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant that summarizes text clearly and concisely."
          },
          {
            role: "user", 
            content: `Please summarize the following text extracted from a document:\n\n${text}`
          }
        ]
      });
      
      return response.choices[0].message.content || "No summary generated";
    } catch (error) {
      console.error("Error summarizing text:", error);
      throw new Error("Failed to generate summary: " + (error as Error).message);
    }
  }
  
  /**
   * Generate presentation slides based on content
   * @param prompt Description of the presentation to generate
   * @param numberOfSlides Number of slides to generate
   * @param style Visual style preference
   * @returns Generated slides content
   */
  async generatePresentationSlides(
    prompt: string,
    numberOfSlides: number = 5,
    style: string = 'professional'
  ): Promise<any> {
    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [
          {
            role: "system",
            content: `You are a presentation design expert. Generate a coherent ${numberOfSlides}-slide presentation in ${style} style based on the following prompt.`
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" }
      });
      
      return JSON.parse(response.choices[0].message.content || "{}");
    } catch (error) {
      console.error("Error generating presentation slides:", error);
      throw new Error("Failed to generate presentation: " + (error as Error).message);
    }
  }
}