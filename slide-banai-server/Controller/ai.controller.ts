import { Request, Response } from 'express';
import { AiService } from '../services/ai.service';
import { requireAuth } from '../middleware/auth.middleware';

/**
 * Controller for AI operations
 */
export class AiController {
  private aiService: AiService;
  
  /**
   * Creates a new instance of AiController
   */
  constructor() {
    this.aiService = new AiService();
  }
  
  /**
   * Handle error responses consistently
   */
  private handleError(error: unknown, res: Response, message: string) {
    console.error(`AI Error - ${message}:`, error);
    const statusCode = error instanceof Error && 'status' in error ? (error as any).status : 500;
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    res.status(statusCode).json({
      error: true,
      message: `${message}: ${errorMessage}`
    });
  }
  
  /**
   * Generate a summary from OCR extracted text
   */
  async summarizeText(req: Request, res: Response) {
    try {
      const { text } = req.body;
      
      if (!text) {
        return res.status(400).json({ 
          error: true, 
          message: 'Text is required' 
        });
      }
      
      const summary = await this.aiService.summarizeText(text);
      res.json({ summary });
    } catch (error) {
      this.handleError(error, res, 'Failed to summarize text');
    }
  }
  
  /**
   * Generate presentation slides
   */
  async generateSlides(req: Request, res: Response) {
    try {
      const { prompt, numberOfSlides, style } = req.body;
      
      if (!prompt) {
        return res.status(400).json({ 
          error: true, 
          message: 'Prompt is required' 
        });
      }
      
      const slides = await this.aiService.generatePresentationSlides(
        prompt,
        numberOfSlides,
        style
      );
      
      res.json(slides);
    } catch (error) {
      this.handleError(error, res, 'Failed to generate slides');
    }
  }
  
  /**
   * Register all routes
   */
  registerRoutes(app: any) {
    // Bind methods to the instance
    const summarizeText = this.summarizeText.bind(this);
    const generateSlides = this.generateSlides.bind(this);
    
    // Register routes
    app.post('/api/ai/summarize', requireAuth, summarizeText);
    app.post('/api/ai/generate-slides', requireAuth, generateSlides);
  }
}