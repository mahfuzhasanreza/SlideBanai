import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useLocation } from "wouter";
import { Template } from "@/lib/types";
import { Loader2, FileText, Upload, Lightbulb, Globe, Users, Clock } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CreatePresentationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  templates?: Template[];
}

// Prompt step form schema
const promptFormSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  numberOfSlides: z.number().min(1).max(30).default(10),
  language: z.string().default("english"),
  templateId: z.string().optional(),
  prompt: z.string().min(1, { message: "Please describe your presentation" }),
});

// Upload step form schema
const uploadFormSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  numberOfSlides: z.number().min(1).max(30).default(10),
  language: z.string().default("english"),
});

// Refine step form schema
const refineFormSchema = z.object({
  timePeriod: z.string().optional(),
  audienceKnowledge: z.string().default("general"),
  projectType: z.string().default("business"),
});

type PromptFormValues = z.infer<typeof promptFormSchema>;
type UploadFormValues = z.infer<typeof uploadFormSchema>;
type RefineFormValues = z.infer<typeof refineFormSchema>;

// Main creation steps
const STEPS = {
  SELECT_METHOD: 'select-method',
  PROMPT_INPUT: 'prompt-input',
  FILE_UPLOAD: 'file-upload',
  REFINE: 'refine',
  EDIT_OUTLINE: 'edit-outline',
};

export default function CreatePresentationModal({ 
  open, 
  onOpenChange,
  templates = [] 
}: CreatePresentationModalProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedText, setUploadedText] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(STEPS.SELECT_METHOD);
  const [generatedOutline, setGeneratedOutline] = useState<any>(null);
  const [creationMethod, setCreationMethod] = useState<'idea' | 'upload'>('idea');

  // Form for AI-based creation from prompt
  const promptForm = useForm<PromptFormValues>({
    resolver: zodResolver(promptFormSchema),
    defaultValues: {
      title: "",
      numberOfSlides: 10,
      language: "english",
      prompt: "",
    },
  });

  // Form for file upload creation
  const uploadForm = useForm<UploadFormValues>({
    resolver: zodResolver(uploadFormSchema),
    defaultValues: {
      title: "",
      numberOfSlides: 10,
      language: "english",
    },
  });

  // Form for refining presentation settings
  const refineForm = useForm<RefineFormValues>({
    resolver: zodResolver(refineFormSchema),
    defaultValues: {
      timePeriod: "",
      audienceKnowledge: "general",
      projectType: "business",
    },
  });

  // First create the presentation
  const createPresentationMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/presentations", {
        title: data.title,
        owner_id: user?.id,
        status: "draft",
      });
      return await res.json();
    },
    onSuccess: (presentation) => {
      queryClient.invalidateQueries({ queryKey: ["/api/presentations"] });
      
      // After creating the presentation, generate slides based on the method and outline
      const numberOfSlides = 
        creationMethod === 'idea' 
          ? promptForm.getValues('numberOfSlides') 
          : uploadForm.getValues('numberOfSlides');
      
      // If we have a generated outline, use that for slide generation
      if (generatedOutline) {
        generateSlidesFromOutlineMutation.mutate({
          presentationId: presentation.id,
          outline: generatedOutline,
          designVariants: 3
        });
      } else {
        // Otherwise use the prompt or uploaded text
        const prompt = creationMethod === 'idea' 
          ? promptForm.getValues('prompt') 
          : uploadedText || `Create a presentation titled ${uploadForm.getValues('title')}`;
          
        generateSlidesMutation.mutate({
          presentationId: presentation.id,
          prompt,
          numberOfSlides,
          sourceType: creationMethod === 'idea' ? 'prompt' : 'upload',
          designVariants: 3
        });
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to create presentation",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Generate slides using the outline
  const generateSlidesFromOutlineMutation = useMutation({
    mutationFn: async (data: {
      presentationId: number;
      outline: any;
      designVariants?: number;
    }) => {
      // Generate slides based on the outline
      const generateRes = await apiRequest("POST", "/api/generate-slides-from-outline", {
        presentationId: data.presentationId,
        outline: data.outline,
        designVariants: data.designVariants || 3
      });
      
      return await generateRes.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/presentations"] });
      
      // Navigate to the editor with the new presentation
      const presentationId = data.presentationId;
      navigate(`/editor/${presentationId}`);
      
      toast({
        title: "Presentation created",
        description: "Your new presentation has been created based on your outline.",
      });
      
      // Close the modal
      onOpenChange(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to generate slides from outline",
        description: error.message,
        variant: "destructive",
      });
      
      // Still navigate to the editor, they can edit manually
      const presentationId = createPresentationMutation.data?.id;
      if (presentationId) {
        navigate(`/editor/${presentationId}`);
        onOpenChange(false);
      }
    },
  });

  // Generate slides using AI
  const generateSlidesMutation = useMutation({
    mutationFn: async (data: {
      presentationId: number;
      prompt: string;
      numberOfSlides: number;
      sourceType: string;
      designVariants?: number;
    }) => {
      // First, generate slide content with AI
      const generateRes = await apiRequest("POST", "/api/generate-slides", {
        prompt: data.prompt,
        numberOfSlides: data.numberOfSlides,
        designVariants: data.designVariants || 3,
        sourceType: data.sourceType
      });
      
      const slidesData = await generateRes.json();
      
      // Then create slides in the presentation
      if (slidesData.variants && slidesData.variants.length > 0) {
        // We'll use the first variant by default
        const variant = slidesData.variants[0];
        
        // Create each slide in the presentation
        for (const slide of variant.slides) {
          await apiRequest("POST", "/api/slides", {
            presentation_id: data.presentationId,
            slide_number: slide.slide_number,
            title: slide.title,
            content: slide.content,
            slide_type: slide.slide_type,
            status: "draft",
            background_color: slide.background_color,
            layout_type: slide.layout_type || "standard"
          });
        }
      }
      
      return data.presentationId;
    },
    onSuccess: (presentationId) => {
      queryClient.invalidateQueries({ queryKey: ["/api/presentations"] });
      
      // Navigate to the editor with the new presentation
      navigate(`/editor/${presentationId}`);
      
      toast({
        title: "Presentation created",
        description: "Your new presentation has been created with AI-generated slides.",
      });
      
      // Close the modal
      onOpenChange(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to generate slides",
        description: "The presentation was created but we couldn't generate slides. You can add them manually.",
        variant: "destructive",
      });
      
      // Still navigate to the editor, but they'll need to add slides manually
      const presentationId = createPresentationMutation.data?.id;
      if (presentationId) {
        navigate(`/editor/${presentationId}`);
        onOpenChange(false);
      }
    },
  });

  // Generate outline mutation
  const generateOutlineMutation = useMutation({
    mutationFn: async (data: any) => {
      // The extra parameters for refinement
      const refinementParams = refineForm.getValues();
      
      // Create the proper API payload
      const payload = {
        prompt: creationMethod === 'idea' ? promptForm.getValues('prompt') : uploadedText,
        numberOfSlides: creationMethod === 'idea' 
          ? promptForm.getValues('numberOfSlides') 
          : uploadForm.getValues('numberOfSlides'),
        sourceType: creationMethod === 'idea' ? 'prompt' : 'upload',
        language: creationMethod === 'idea' 
          ? promptForm.getValues('language') 
          : uploadForm.getValues('language'),
        ...refinementParams
      };
      
      const res = await apiRequest("POST", "/api/generate-outline", payload);
      return await res.json();
    },
    onSuccess: (data) => {
      setGeneratedOutline(data);
      setCurrentStep(STEPS.EDIT_OUTLINE);
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to generate outline",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadedFile(file);
    
    // Auto-fill title from filename if not set
    if (!uploadForm.getValues('title')) {
      const fileName = file.name.replace(/\.[^/.]+$/, ""); // Remove extension
      uploadForm.setValue('title', fileName);
    }
    
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/ocr", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to process the file");
      }

      const data = await response.json();
      setUploadedText(data.text);
      
      toast({
        title: "File processed successfully",
        description: "We've extracted the content from your file.",
      });
      
    } catch (error) {
      toast({
        title: "OCR Processing Failed",
        description: "Unable to extract text from the uploaded file",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Method selection handlers
  const handleMethodSelect = (method: 'idea' | 'upload') => {
    setCreationMethod(method);
    setCurrentStep(method === 'idea' ? STEPS.PROMPT_INPUT : STEPS.FILE_UPLOAD);
  };

  // Create presentation from refined data
  const handleCreatePresentation = () => {
    const data = {
      title: creationMethod === 'idea' 
        ? promptForm.getValues('title') 
        : uploadForm.getValues('title'),
    };
    
    createPresentationMutation.mutate(data);
  };

  // Handle back navigation between steps
  const handleBack = () => {
    if (currentStep === STEPS.PROMPT_INPUT || currentStep === STEPS.FILE_UPLOAD) {
      setCurrentStep(STEPS.SELECT_METHOD);
    } else if (currentStep === STEPS.REFINE) {
      setCurrentStep(creationMethod === 'idea' ? STEPS.PROMPT_INPUT : STEPS.FILE_UPLOAD);
    } else if (currentStep === STEPS.EDIT_OUTLINE) {
      setCurrentStep(STEPS.REFINE);
    }
  };

  // Handle next/continue between steps
  const handleNext = async () => {
    if (currentStep === STEPS.PROMPT_INPUT) {
      const valid = await promptForm.trigger();
      if (valid) {
        setCurrentStep(STEPS.REFINE);
      }
    } else if (currentStep === STEPS.FILE_UPLOAD) {
      const valid = await uploadForm.trigger();
      if (valid && uploadedText) {
        setCurrentStep(STEPS.REFINE);
      } else if (valid) {
        toast({
          title: "Missing file content",
          description: "Please upload and process a file before continuing",
          variant: "destructive"
        });
      }
    } else if (currentStep === STEPS.REFINE) {
      const valid = await refineForm.trigger();
      if (valid) {
        // Generate outline based on prompt/file + refinements
        generateOutlineMutation.mutate({});
      }
    }
  };

  // Render different step content
  const renderStepContent = () => {
    switch (currentStep) {
      case STEPS.SELECT_METHOD:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <Card className="cursor-pointer hover:border-primary transition-colors" onClick={() => handleMethodSelect('idea')}>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lightbulb className="h-5 w-5 mr-2 text-primary" />
                  Start from an idea
                </CardTitle>
                <CardDescription>
                  Create a presentation by describing what you need
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">
                  Our AI will generate a complete presentation based on your description
                </p>
              </CardContent>
            </Card>
            
            <Card className="cursor-pointer hover:border-primary transition-colors" onClick={() => handleMethodSelect('upload')}>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Upload className="h-5 w-5 mr-2 text-primary" />
                  Upload a file
                </CardTitle>
                <CardDescription>
                  Create from PDF, images, DOCX, or TXT
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">
                  We'll extract content from your file and create slides
                </p>
              </CardContent>
            </Card>
          </div>
        );
        
      case STEPS.PROMPT_INPUT:
        return (
          <Form {...promptForm}>
            <form className="space-y-4 py-4">
              <FormField
                control={promptForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Presentation Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter a title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={promptForm.control}
                name="prompt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Describe your presentation</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="E.g., A marketing presentation for our new product launch targeting young professionals"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Be specific about the purpose, audience, and key points you want to cover
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={promptForm.control}
                  name="numberOfSlides"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number of Slides</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          max={30}
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value, 10))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={promptForm.control}
                  name="language"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preferred Language</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select language" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="english">English</SelectItem>
                          <SelectItem value="spanish">Spanish</SelectItem>
                          <SelectItem value="french">French</SelectItem>
                          <SelectItem value="german">German</SelectItem>
                          <SelectItem value="chinese">Chinese</SelectItem>
                          <SelectItem value="japanese">Japanese</SelectItem>
                          <SelectItem value="hindi">Hindi</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={promptForm.control}
                name="templateId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Template (Optional)</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a template" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {templates.map((template) => (
                          <SelectItem
                            key={template.id}
                            value={template.id.toString()}
                          >
                            {template.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        );
        
      case STEPS.FILE_UPLOAD:
        return (
          <Form {...uploadForm}>
            <form className="space-y-4 py-4">
              <FormField
                control={uploadForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Presentation Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter a title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="space-y-2">
                <FormLabel>Upload Document</FormLabel>
                <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
                  <Input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png,.docx,.txt"
                    className="hidden"
                    id="file-upload"
                    onChange={handleFileUpload}
                    disabled={isUploading}
                  />
                  <Label 
                    htmlFor="file-upload"
                    className="cursor-pointer flex flex-col items-center justify-center text-gray-500 hover:text-primary"
                  >
                    <FileText className="h-10 w-10 mb-2" />
                    <span className="text-sm font-medium">
                      {uploadedFile ? uploadedFile.name : "Choose a file or drag & drop"}
                    </span>
                    <span className="text-xs mt-1">
                      PDF, DOCX, JPG, PNG, or TXT (max 10MB)
                    </span>
                  </Label>
                </div>
                
                {isUploading && (
                  <div className="flex items-center justify-center text-sm text-primary-600 mt-2">
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processing document...
                  </div>
                )}
                
                {uploadedText && (
                  <div className="text-sm text-green-600 mt-2 flex items-center">
                    <div className="h-2 w-2 rounded-full bg-green-600 mr-2" />
                    Document processed successfully!
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={uploadForm.control}
                  name="numberOfSlides"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number of Slides</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          max={30}
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value, 10))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={uploadForm.control}
                  name="language"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preferred Language</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select language" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="english">English</SelectItem>
                          <SelectItem value="spanish">Spanish</SelectItem>
                          <SelectItem value="french">French</SelectItem>
                          <SelectItem value="german">German</SelectItem>
                          <SelectItem value="chinese">Chinese</SelectItem>
                          <SelectItem value="japanese">Japanese</SelectItem>
                          <SelectItem value="hindi">Hindi</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </form>
          </Form>
        );
        
      case STEPS.REFINE:
        return (
          <Form {...refineForm}>
            <form className="space-y-4 py-4">
              <h3 className="text-lg font-medium">Refine Your Presentation</h3>
              <p className="text-sm text-gray-500 mb-4">
                Add additional details to make your presentation more tailored
              </p>

              <FormField
                control={refineForm.control}
                name="timePeriod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-gray-400" />
                      Time Period (Optional)
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g., 2024 Q2, Last 5 years, Historical" 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Specify a time frame if your presentation covers a specific period
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={refineForm.control}
                name="audienceKnowledge"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      <Users className="h-4 w-4 mr-2 text-gray-400" />
                      Audience Knowledge
                    </FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="novice" id="audience-novice" />
                          <Label htmlFor="audience-novice">Novice - Explain concepts in simple terms</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="general" id="audience-general" />
                          <Label htmlFor="audience-general">General - Assume basic familiarity</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="expert" id="audience-expert" />
                          <Label htmlFor="audience-expert">Expert - Use technical language and concepts</Label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={refineForm.control}
                name="projectType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      <Globe className="h-4 w-4 mr-2 text-gray-400" />
                      Project Type
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select project type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="business">Business / Corporate</SelectItem>
                        <SelectItem value="academic">Academic / Educational</SelectItem>
                        <SelectItem value="marketing">Marketing / Sales</SelectItem>
                        <SelectItem value="technical">Technical / Engineering</SelectItem>
                        <SelectItem value="creative">Creative / Design</SelectItem>
                        <SelectItem value="research">Research / Scientific</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        );
        
      case STEPS.EDIT_OUTLINE:
        // Show the generated outline with editable fields
        return generatedOutline ? (
          <div className="py-4 space-y-4">
            <h3 className="text-lg font-medium">Edit Your Presentation Outline</h3>
            <p className="text-sm text-gray-500 mb-4">
              Review and edit the generated outline before creating your presentation
            </p>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Presentation Title</Label>
                <Input 
                  value={
                    creationMethod === 'idea' 
                      ? promptForm.getValues('title') 
                      : uploadForm.getValues('title')
                  } 
                  onChange={(e) => {
                    if (creationMethod === 'idea') {
                      promptForm.setValue('title', e.target.value);
                    } else {
                      uploadForm.setValue('title', e.target.value);
                    }
                  }}
                  className="font-medium"
                />
              </div>
              
              <div className="border rounded-md overflow-hidden">
                <div className="bg-gray-50 p-3 border-b">
                  <h4 className="font-medium">Slide Outline</h4>
                </div>
                
                <div className="p-3 space-y-4 max-h-[300px] overflow-y-auto">
                  {generatedOutline.slides?.map((slide: any, index: number) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center">
                        <div className="bg-primary text-white w-6 h-6 rounded-full flex items-center justify-center mr-2 flex-shrink-0">
                          {index + 1}
                        </div>
                        <Input 
                          value={slide.title} 
                          onChange={(e) => {
                            const newOutline = {...generatedOutline};
                            newOutline.slides[index].title = e.target.value;
                            setGeneratedOutline(newOutline);
                          }}
                          className="font-medium"
                        />
                      </div>
                      
                      <div className="pl-8">
                        <Textarea 
                          value={slide.content} 
                          onChange={(e) => {
                            const newOutline = {...generatedOutline};
                            newOutline.slides[index].content = e.target.value;
                            setGeneratedOutline(newOutline);
                          }}
                          className="min-h-[80px] text-sm"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-10 flex flex-col items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p>Generating your presentation outline...</p>
          </div>
        );
      
      default:
        return null;
    }
  };

  // Modal header based on current step
  const renderModalHeader = () => {
    let title = "Create New Presentation";
    let description = "Create a presentation using AI or uploaded content.";
    
    switch (currentStep) {
      case STEPS.SELECT_METHOD:
        title = "Create New Presentation";
        description = "Choose how you want to create your presentation";
        break;
      case STEPS.PROMPT_INPUT:
        title = "Start from an idea";
        description = "Describe the goal of your presentation";
        break;
      case STEPS.FILE_UPLOAD:
        title = "Upload a file";
        description = "Create a presentation from your document";
        break;
      case STEPS.REFINE:
        title = "Refine your presentation";
        description = "Add additional details to enhance your presentation";
        break;
      case STEPS.EDIT_OUTLINE:
        title = "Edit Outline";
        description = "Review and edit before creating your presentation";
        break;
    }
    
    return (
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>
    );
  };

  // Modal footer based on current step
  const renderModalFooter = () => {
    const isPending = createPresentationMutation.isPending || 
                      generateSlidesMutation.isPending || 
                      generateOutlineMutation.isPending ||
                      generateSlidesFromOutlineMutation.isPending;
    
    return (
      <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-between sm:space-x-2">
        {currentStep !== STEPS.SELECT_METHOD && (
          <Button
            type="button"
            variant="outline"
            onClick={handleBack}
            disabled={isPending}
          >
            Back
          </Button>
        )}
        
        <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
          <DialogClose asChild>
            <Button type="button" variant="ghost">
              Cancel
            </Button>
          </DialogClose>
          
          {currentStep !== STEPS.EDIT_OUTLINE ? (
            <Button
              type="button"
              onClick={handleNext}
              disabled={
                isPending || 
                (currentStep === STEPS.FILE_UPLOAD && isUploading)
              }
            >
              {generateOutlineMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                "Continue"
              )}
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleCreatePresentation}
              disabled={isPending}
            >
              {createPresentationMutation.isPending || generateSlidesFromOutlineMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create my presentation"
              )}
            </Button>
          )}
        </div>
      </DialogFooter>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        {renderModalHeader()}
        {renderStepContent()}
        {renderModalFooter()}
      </DialogContent>
    </Dialog>
  );
}
