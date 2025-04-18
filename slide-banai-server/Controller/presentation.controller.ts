import { Request, Response } from 'express';
import { storage } from '../storage';
import { requireAuth } from '../middleware/auth.middleware';
import { ZodError } from 'zod';
import { fromZodError } from 'zod-validation-error';
import { insertPresentationSchema, insertSlideSchema } from '@shared/schema';

/**
 * Controller for presentation operations
 */
export class PresentationController {
  /**
   * Handle error responses consistently
   */
  private handleError(error: unknown, res: Response, message: string) {
    console.error(`Presentation Error - ${message}:`, error);
    
    if (error instanceof ZodError) {
      return res.status(400).json({
        message: fromZodError(error).message
      });
    }
    
    const statusCode = error instanceof Error && 'status' in error ? (error as any).status : 500;
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    res.status(statusCode).json({
      error: true,
      message: `${message}: ${errorMessage}`
    });
  }
  
  /**
   * Create a new presentation
   */
  async createPresentation(req: Request, res: Response) {
    try {
      const presentationData = insertPresentationSchema.parse({
        ...req.body,
        owner_id: req.user!.id
      });
      
      const presentation = await storage.createPresentation(presentationData);
      res.status(201).json(presentation);
    } catch (error) {
      this.handleError(error, res, 'Failed to create presentation');
    }
  }
  
  /**
   * Get presentations owned by the current user
   */
  async getUserPresentations(req: Request, res: Response) {
    try {
      const presentations = await storage.getPresentationsByUserId(req.user!.id);
      res.json(presentations);
    } catch (error) {
      this.handleError(error, res, 'Failed to fetch presentations');
    }
  }
  
  /**
   * Get presentations shared with the current user
   */
  async getSharedPresentations(req: Request, res: Response) {
    try {
      const presentations = await storage.getSharedPresentations(req.user!.id);
      res.json(presentations);
    } catch (error) {
      this.handleError(error, res, 'Failed to fetch shared presentations');
    }
  }
  
  /**
   * Get a specific presentation by ID
   */
  async getPresentationById(req: Request, res: Response) {
    try {
      const presentationId = parseInt(req.params.id);
      const presentation = await storage.getPresentationById(presentationId);
      
      if (!presentation) {
        return res.status(404).json({ message: "Presentation not found" });
      }
      
      // Check if user is owner or collaborator
      if (presentation.owner_id !== req.user!.id) {
        const collaborators = await storage.getCollaborators(presentationId);
        const isCollaborator = collaborators.some(c => c.user_id === req.user!.id);
        
        if (!isCollaborator) {
          return res.status(403).json({ message: "Access denied" });
        }
      }
      
      res.json(presentation);
    } catch (error) {
      this.handleError(error, res, 'Failed to fetch presentation');
    }
  }
  
  /**
   * Update a presentation
   */
  async updatePresentation(req: Request, res: Response) {
    try {
      const presentationId = parseInt(req.params.id);
      const presentation = await storage.getPresentationById(presentationId);
      
      if (!presentation) {
        return res.status(404).json({ message: "Presentation not found" });
      }
      
      // Only owner can update presentation details
      if (presentation.owner_id !== req.user!.id) {
        return res.status(403).json({ message: "Only the owner can update presentation details" });
      }
      
      const updatedPresentation = await storage.updatePresentation(presentationId, req.body);
      res.json(updatedPresentation);
    } catch (error) {
      this.handleError(error, res, 'Failed to update presentation');
    }
  }
  
  /**
   * Delete a presentation
   */
  async deletePresentation(req: Request, res: Response) {
    try {
      const presentationId = parseInt(req.params.id);
      const presentation = await storage.getPresentationById(presentationId);
      
      if (!presentation) {
        return res.status(404).json({ message: "Presentation not found" });
      }
      
      // Only owner can delete presentation
      if (presentation.owner_id !== req.user!.id) {
        return res.status(403).json({ message: "Only the owner can delete this presentation" });
      }
      
      await storage.deletePresentation(presentationId);
      res.status(204).send();
    } catch (error) {
      this.handleError(error, res, 'Failed to delete presentation');
    }
  }
  
  /**
   * Create a new slide
   */
  async createSlide(req: Request, res: Response) {
    try {
      const slideData = insertSlideSchema.parse(req.body);
      
      // Check if user has access to the presentation
      const presentation = await storage.getPresentationById(slideData.presentation_id);
      if (!presentation) {
        return res.status(404).json({ message: "Presentation not found" });
      }
      
      if (presentation.owner_id !== req.user!.id) {
        const collaborators = await storage.getCollaborators(slideData.presentation_id);
        const isEditor = collaborators.some(c => c.user_id === req.user!.id && c.role === 'editor');
        
        if (!isEditor) {
          return res.status(403).json({ message: "You don't have permission to add slides" });
        }
      }
      
      const slide = await storage.createSlide(slideData);
      res.status(201).json(slide);
    } catch (error) {
      this.handleError(error, res, 'Failed to create slide');
    }
  }
  
  /**
   * Get slides for a presentation
   */
  async getPresentationSlides(req: Request, res: Response) {
    try {
      const presentationId = parseInt(req.params.id);
      const presentation = await storage.getPresentationById(presentationId);
      
      if (!presentation) {
        return res.status(404).json({ message: "Presentation not found" });
      }
      
      // Check if user has access
      if (presentation.owner_id !== req.user!.id) {
        const collaborators = await storage.getCollaborators(presentationId);
        const isCollaborator = collaborators.some(c => c.user_id === req.user!.id);
        
        if (!isCollaborator) {
          return res.status(403).json({ message: "Access denied" });
        }
      }
      
      const slides = await storage.getSlidesByPresentationId(presentationId);
      res.json(slides);
    } catch (error) {
      this.handleError(error, res, 'Failed to fetch slides');
    }
  }
  
  /**
   * Update a slide
   */
  async updateSlide(req: Request, res: Response) {
    try {
      const slideId = parseInt(req.params.id);
      
      // Get slide by ID
      const slides = await storage.getSlidesByPresentationId(req.body.presentation_id);
      const slide = slides.find(s => s.id === slideId);
      
      if (!slide) {
        // If slide not found by ID, try to get it by slide_number
        const slideByNumber = slides.find(s => s.slide_number === parseInt(req.params.id));
        if (slideByNumber) {
          const updatedSlide = await storage.updateSlide(slideByNumber.id, req.body);
          return res.json(updatedSlide);
        }
        return res.status(404).json({ message: "Slide not found" });
      }
      
      // Check if user has access to edit
      const presentation = await storage.getPresentationById(slide.presentation_id);
      if (!presentation) {
        return res.status(404).json({ message: "Presentation not found" });
      }
      
      if (presentation.owner_id !== req.user?.id) {
        const collaborators = await storage.getCollaborators(slide.presentation_id);
        const isEditor = collaborators.some(c => c.user_id === req.user?.id && c.role === 'editor');
        
        if (!isEditor) {
          return res.status(403).json({ message: "You don't have permission to edit slides" });
        }
      }
      
      const updatedSlide = await storage.updateSlide(slideId, req.body);
      res.json(updatedSlide);
    } catch (error) {
      this.handleError(error, res, 'Failed to update slide');
    }
  }
  
  /**
   * Register all routes
   */
  registerRoutes(app: any) {
    // Bind methods to the instance
    const createPresentation = this.createPresentation.bind(this);
    const getUserPresentations = this.getUserPresentations.bind(this);
    const getSharedPresentations = this.getSharedPresentations.bind(this);
    const getPresentationById = this.getPresentationById.bind(this);
    const updatePresentation = this.updatePresentation.bind(this);
    const deletePresentation = this.deletePresentation.bind(this);
    const createSlide = this.createSlide.bind(this);
    const getPresentationSlides = this.getPresentationSlides.bind(this);
    const updateSlide = this.updateSlide.bind(this);
    
    // Register presentation routes
    app.post("/api/presentations", requireAuth, createPresentation);
    app.get("/api/presentations", requireAuth, getUserPresentations);
    app.get("/api/presentations/shared", requireAuth, getSharedPresentations);
    app.get("/api/presentations/:id", requireAuth, getPresentationById);
    app.put("/api/presentations/:id", requireAuth, updatePresentation);
    app.delete("/api/presentations/:id", requireAuth, deletePresentation);
    
    // Register slide routes
    app.post("/api/slides", requireAuth, createSlide);
    app.get("/api/presentations/:id/slides", requireAuth, getPresentationSlides);
    app.put("/api/slides/:id", requireAuth, updateSlide);
  }
}