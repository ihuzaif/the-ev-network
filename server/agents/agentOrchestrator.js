// Master Agent Orchestrator: Coordinates 24/7 multi-agent autonomous workflow
import { db } from '../db.js';
import { scoutAgent } from './scoutAgent.js';
import { editorAgent } from './editorAgent.js';
import { mediaAgent } from './mediaAgent.js';
import { socialAgent } from './socialAgent.js';
import { newsletterAgent } from './newsletterAgent.js';

class AgentOrchestrator {
  constructor() {
    this.isRunning = false;
    this.timer = null;
  }

  /**
   * Run the complete autonomous publishing pipeline for one cycle
   */
  async runCycle(customPrompt = null, customCategory = null, customRegion = null) {
    if (this.isRunning) {
      db.addAgentLog("Orchestrator", "WARN", "Pipeline cycle already in progress, skipping concurrent run.");
      return { status: "already_running" };
    }

    this.isRunning = true;
    db.addAgentLog("Orchestrator", "INFO", "Initiating autonomous multi-agent publishing cycle.");

    try {
      // 1. Scout
      let signal;
      if (customPrompt) {
        signal = {
          topic: customPrompt,
          category: customCategory || "Cars",
          region: customRegion || "Global",
          tags: [customCategory || "Cars", customRegion || "Global", "EV", "Innovation"],
          angle: `Editorial analysis focusing on: ${customPrompt}`
        };
        db.addAgentLog("Scout Agent", "INFO", `Using owner prompt: "${customPrompt}"`);
      } else {
        signal = await scoutAgent.discoverSignals();
      }

      // 2. Editor
      const article = await editorAgent.writeArticle(signal);

      // 3. Media
      await mediaAgent.processArticleVisuals(article);

      // 4. Social
      await socialAgent.formatAndQueueSocials(article);

      // 5. Save to database
      const savedArticle = db.addArticle(article);

      db.addAgentLog("Orchestrator", "SUCCESS", `Publishing cycle complete! Created article "${savedArticle.title}" [ID: ${savedArticle.id}, Status: ${savedArticle.status}].`);

      return {
        status: "completed",
        article: savedArticle
      };
    } catch (err) {
      console.error("Pipeline execution error:", err);
      db.addAgentLog("Orchestrator", "ERROR", `Pipeline failure: ${err.message}`);
      return { status: "error", message: err.message };
    } finally {
      this.isRunning = false;
    }
  }

  /**
   * Start 24/7 background autonomous execution loop
   */
  startBackgroundWorker(intervalMinutes = 60) {
    if (this.timer) clearInterval(this.timer);

    const ms = Math.max(intervalMinutes, 5) * 60 * 1000;
    db.addAgentLog("Orchestrator", "INFO", `24/7 background agent scheduler started. Frequency: every ${intervalMinutes} minutes.`);

    this.timer = setInterval(() => {
      console.log(`[${new Date().toISOString()}] Background Agent Runner triggering cycle...`);
      this.runCycle();
    }, ms);
  }

  stopBackgroundWorker() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
      db.addAgentLog("Orchestrator", "INFO", "24/7 background agent scheduler paused by user.");
    }
  }
}

export const orchestrator = new AgentOrchestrator();
