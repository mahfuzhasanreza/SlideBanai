import { apiRequest } from '@/lib/queryClient';
import { 
  CanvaTemplate,
  CanvaDesign,
  CreatePresentationRequest
} from '@/models/canva.model';


export class CanvaService {
  /**
   * Fetch Canva templates based on category and limit
   * @param category The category of templates to fetch
   * @param limit The number of templates to fetch
   * @returns An array of Canva templates
   */
  static async getTemplates(category?: string, limit: number = 10): Promise<CanvaTemplate[]> {
    try {
      const params = new URLSearchParams();
      if (category) params.append('category', category);
      if (limit) params.append('limit', limit.toString());
      
      const response = await apiRequest('GET', `/api/canva/templates?${params.toString()}`);
      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Error fetching Canva templates:', error);
      throw error;
    }
  }
  
  /**
   * Create a new presentation in Canva
   * @param data Presentation creation data
   * @returns The created presentation
   */
  static async createPresentation(data: CreatePresentationRequest): Promise<CanvaDesign> {
    try {
      const response = await apiRequest('POST', '/api/canva/presentations', data);
      return await response.json();
    } catch (error) {
      console.error('Error creating Canva presentation:', error);
      throw error;
    }
  }
  
  /**
   * Get details for a specific design
   * @param designId The design ID to fetch
   * @returns Design details
   */
  static async getDesignDetails(designId: string): Promise<CanvaDesign> {
    try {
      const response = await apiRequest('GET', `/api/canva/designs/${designId}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching design details:', error);
      throw error;
    }
  }
}