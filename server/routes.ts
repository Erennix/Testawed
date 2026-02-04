import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage.js";
import { api } from "@shared/routes";
import { z } from "zod";
import fs from "fs";
import path from "path";

// Define Config Type
interface Config {
  discordWebhookUrl: string;
  gifUrl: string;
  question: string;
}

// Read config file
const configPath = path.join(process.cwd(), "server", "config.json");
function getConfig(): Config {
  try {
    const data = fs.readFileSync(configPath, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading config.json:", err);
    return {
      discordWebhookUrl: "",
      gifUrl: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3R6b3h6b3h6b3h6b3h6b3h6b3h6b3h6b3h6b3h6b3h6/l4pTfx2qLSznW/giphy.gif",
      question: "Will you be my valentine?"
    };
  }
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  app.get(api.config.get.path, (_req, res) => {
    const config = getConfig();
    // Don't leak the webhook URL to the frontend
    res.json({
      gifUrl: config.gifUrl,
      question: config.question
    });
  });

  app.post(api.responses.create.path, async (req, res) => {
    try {
      const input = api.responses.create.input.parse(req.body);
      
      // Save to DB
      const response = await storage.createResponse(input);
      
      // Send to Discord if accepted and webhook is configured
      if (input.accepted) {
        const config = getConfig();
        if (config.discordWebhookUrl) {
          try {
             await fetch(config.discordWebhookUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                content: `💖 **${input.name}** said YES! 💖`,
                embeds: [{
                  title: "New Valentine Response! 💌",
                  description: `**${input.name}** has accepted your valentine request!`,
                  color: 0xff69b4, // Hot pink
                  timestamp: new Date().toISOString(),
                  footer: {
                    text: "Valentine's App"
                  }
                }]
              })
            });
            console.log(`Sent webhook for ${input.name}`);
          } catch (discordErr) {
            console.error("Failed to send Discord webhook:", discordErr);
            // Don't fail the request if webhook fails
          }
        } else {
          console.log("Discord webhook URL not configured, skipping notification.");
        }
      }

      res.status(201).json(response);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  return httpServer;
}
