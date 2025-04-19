import { User, Presentation, Slide, Collaborator, CoachSession } from "@shared/schema";

// Template type
export interface Template {
  id: number;
  name: string;
  description: string;
  thumbnail_url: string;
  category: string;
  created_at: Date;
}

// Stats type for dashboard
export interface DashboardStats {
  totalPresentations: number;
  availableCredits: number;
  collaborators: number;
}

// Presentation with additional frontend properties
export interface PresentationWithMeta extends Presentation {
  collaborators?: User[];
  lastEditedAgo?: string;
}

// Enhanced slide content with additional design information (based on presentations.ai)
export interface GeneratedSlideContent {
  slide_number: number;
  slide_type: 'title' | 'section' | 'content' | 'quote' | 'conclusion';
  title: string;
  content: string;
  background_color: string;
  suggested_visuals?: string;
  layout_type?: string;
}

// Design variant type for multiple presentation styles
export interface DesignVariant {
  variant_id: number;
  style_name: string;
  color_palette: string[];
  slides: GeneratedSlideContent[];
}

// Brand guidelines type
export interface BrandGuidelines {
  brandColors?: string[];
  logoUrl?: string;
  fontFamily?: string;
  visualStyle?: string;
}

// Presentation analysis from AI coach
export interface PresentationAnalysis {
  content_coverage: number;
  pace_score: number;
  clarity_score: number;
  eye_contact_score: number;
  feedback: string;
  improvement_tips: string[];
}

// Subscription types
export type SubscriptionType = 'free' | 'pro' | 'single_purchase';

export interface SubscriptionDetails {
  type: SubscriptionType;
  expiryDate?: Date;
  features: string[];
  credits: number;
  price: string;
}

// Type for presentation creation (following presentations.ai workflow)
export interface CreatePresentationData {
  // Input Phase
  title: string;
  creationMethod: 'prompt' | 'upload' | 'template' | 'integration';
  prompt?: string;
  templateId?: number;
  numberOfSlides?: number;
  designVariants?: number;
  
  // Content Input Options
  uploadedDocumentText?: string;
  integrationSource?: 'google_slides' | 'powerpoint';
  
  // Brand Guidelines
  brandGuidelines?: BrandGuidelines;
  
  // AI Processing Parameters
  stylePreference?: 'professional' | 'creative' | 'minimalist' | 'bold' | 'academic';
  audience?: 'general' | 'executive' | 'technical' | 'sales' | 'educational';
  presentationGoal?: 'inform' | 'persuade' | 'train' | 'entertain';
}

// OCR data
export interface OcrResult {
  text: string;
  sourceType?: 'pdf' | 'image';
}

// Export options for the Output & Delivery phase
export interface ExportOptions {
  format: 'pptx' | 'pdf' | 'html' | 'png';
  includeNotes?: boolean;
  highResolution?: boolean;
  downloadUrl?: string;
}

// AI-assisted refinement options for Editing phase
export interface AIRefinementOptions {
  action: 'make_professional' | 'simplify' | 'better_visuals' | 'optimize_text' | 'add_citations';
  slideId?: number; // If not provided, applies to whole presentation
  intensity?: 'light' | 'medium' | 'strong';
}

// Tracking presentation revisions
export interface PresentationRevision {
  id: number;
  presentationId: number;
  timestamp: Date;
  changedBy: User;
  description: string;
}

// Chart configuration for data visualization
export interface ChartConfig {
  type: string;
  data: {
    labels: string[];
    datasets: any[];
  };
  options: any;
}

// Enhanced slide with visual elements, stock images, and chart data
export interface EnhancedSlide {
  enhancedContent: string;
  visualElements: {
    type: string;
    description: string;
  }[];
  layoutType: string;
  colorScheme: string[];
  stockImages?: {
    description: string;
    keywords: string[];
  }[];
  chartData?: ChartConfig;
}

// Table data structure for chart generation
export interface TableData {
  headers: string[];
  rows: any[][];
}

// Chart generation options
export interface ChartGenerationOptions {
  tabularData: string | TableData;
  chartType?: 'bar' | 'line' | 'pie' | 'radar' | 'doughnut' | 'auto';
  title?: string;
}

// Slide Element for Canva-like editing
export interface SlideElement {
  id: string;
  type: 'text' | 'image' | 'shape' | 'chart' | 'line' | 'video';
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  content: string;
  style?: {
    fontFamily?: string;
    fontSize?: string;
    fontWeight?: string;
    fontStyle?: string;
    color?: string;
    backgroundColor?: string;
    textAlign?: 'left' | 'center' | 'right' | 'justify';
    opacity?: number;
    borderWidth?: string;
    borderColor?: string;
    borderStyle?: string;
    borderRadius?: string;
    padding?: string;
  };
  // For charts
  chartConfig?: ChartConfig;
  chartType?: string;
  data?: any;
  options?: any;
  // For images
  src?: string;
  alt?: string;
  filter?: string;
  // For shapes
  shape?: 'rectangle' | 'circle' | 'triangle' | 'arrow' | 'line' | 'star';
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
}

// Slide data with canvas elements
export interface SlideData {
  id: number;
  title: string;
  elements: SlideElement[];
  background: {
    type: 'color' | 'image' | 'gradient';
    value: string;
  };
  transition?: 'fade' | 'slide' | 'zoom' | 'flip' | 'none';
}

// Theme data for consistent styling
export interface SlideTheme {
  id: string;
  name: string;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  fontFamily: string;
  headingFont: string;
  bodyFont: string;
  colorPalette: string[];
}

// Design variant with specific elements
export interface SlideDesignVariant {
  id: string;
  name: string;
  thumbnail: string;
  layouts: {
    title: SlideData;
    content: SlideData;
    twoColumn: SlideData;
    image: SlideData;
    quote: SlideData;
    chart: SlideData;
    conclusion: SlideData;
  };
}
