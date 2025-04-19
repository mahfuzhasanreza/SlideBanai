import { Express } from 'express';
import { createServer, Server } from 'http';
import { WebSocketServer } from 'ws';
import { setupCanvaRoutes } from './canva.routes';
import { setupPresentationRoutes } from './presentation.routes';
import { setupAiRoutes } from './ai.routes';
import { setupOcrRoutes } from './ocr.routes';
import { setupAuth } from '../auth';
import { log } from '../vite';
import { storage } from '../storage';

/**
 * Master route registration function
 * @param app Express application
 * @returns HTTP server
 */
export function registerAllRoutes(app: Express): Server {
  // Set up authentication routes
  setupAuth(app);
  
  // Set up feature routes
  setupPresentationRoutes(app);
  setupCanvaRoutes(app);
  setupAiRoutes(app);
  setupOcrRoutes(app);
  
  // Special route for templates
  app.get('/api/templates', async (req, res) => {
    try {
      const templates = await storage.getTemplates();
      res.json(templates);
    } catch (error) {
      console.error('Error fetching templates:', error);
      res.status(500).json({ message: 'Failed to fetch templates' });
    }
  });
  
  // Create HTTP server
  const httpServer = createServer(app);
  
  // Set up WebSocket server (on a distinct path to avoid conflicts with Vite HMR)
  const wss = new WebSocketServer({ 
    server: httpServer, 
    path: '/ws'
  });
  
  // WebSocket connection handling
  wss.on('connection', (ws) => {
    log('WebSocket connected');
    
    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message.toString());
        log(`Received WebSocket message: ${data.type}`);
        
        // Handle different message types
        switch (data.type) {
          case 'ping':
            ws.send(JSON.stringify({ type: 'pong', timestamp: Date.now() }));
            break;
            
          default:
            log(`Unknown WebSocket message type: ${data.type}`);
        }
      } catch (error) {
        log(`WebSocket error: ${error}`);
      }
    });
    
    ws.on('close', () => {
      log('WebSocket disconnected');
    });
  });
  
  return httpServer;
}