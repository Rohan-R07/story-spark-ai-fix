import express from "express";
import { AiModelController } from "./ai_model.controller";
import validateRequest from "../../middleware/validate.request";
import { AIModelValidator } from "./ai_model.validation";
import checkRequestLimit from "../../middleware/check.request.limit";
import auth from "../../middleware/auth.middleware";
import freeAiRateLimiter from "../../middleware/free-ai.rate-limiter";
import { aiGenerationRateLimiter } from "../../middleware/ip.rate-limiter";
import storyGenerationRateLimiter from "../../middleware/story.rate-limiter";

const router = express.Router();

// GENERATE STORIES
router.post("/generate-model", auth(), storyGenerationRateLimiter, validateRequest(AIModelValidator.aiModel), checkRequestLimit(), AiModelController.aiModelGenerate);

router.post("/generate-free-model", validateRequest(AIModelValidator.aiModel), freeAiRateLimiter, AiModelController.aiFreeModelGenerate);

router.post("/generate-model-stream", aiGenerationRateLimiter, auth(), validateRequest(AIModelValidator.aiModel), checkRequestLimit(), AiModelController.aiModelGenerateStream);

// ALTERNATE ENDINGS
router.post("/generate-alternate-endings", auth(), storyGenerationRateLimiter, validateRequest(AIModelValidator.aiAlternateEndings), checkRequestLimit(), AiModelController.aiModelAlternateEndings);

router.post("/generate-free-alternate-endings", validateRequest(AIModelValidator.aiAlternateEndings), freeAiRateLimiter, AiModelController.aiFreeModelAlternateEndings);

// REMIX
router.post("/remix", auth(), storyGenerationRateLimiter, checkRequestLimit(), validateRequest(AIModelValidator.aiRemix), AiModelController.aiModelRemix);

router.post("/remix-free", freeAiRateLimiter, validateRequest(AIModelValidator.aiRemix), AiModelController.aiFreeModelRemix);

// TRANSLATE
router.post("/translate", auth(), storyGenerationRateLimiter, checkRequestLimit(), validateRequest(AIModelValidator.aiTranslate), AiModelController.aiModelTranslate);

router.post("/translate-free", freeAiRateLimiter, validateRequest(AIModelValidator.aiTranslate), AiModelController.aiFreeModelTranslate);

// STORY CONTINUATION
router.post("/continue-story", auth(), storyGenerationRateLimiter, validateRequest(AIModelValidator.aiStoryContinuation), checkRequestLimit(), AiModelController.aiStoryContinuation);

router.post("/continue-story-free", validateRequest(AIModelValidator.aiStoryContinuation), freeAiRateLimiter, AiModelController.aiFreeStoryContinuation);

// AI CHAT
router.post("/chat", auth(), storyGenerationRateLimiter, validateRequest(AIModelValidator.aiChat), checkRequestLimit(), AiModelController.aiModelChat);

router.post("/chat-free", validateRequest(AIModelValidator.aiChat), freeAiRateLimiter, AiModelController.aiFreeModelChat);

export const AIModelRouter = router;
