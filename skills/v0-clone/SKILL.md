---
name: v0-clone
description: AI-powered application generator similar to Vercel v0. Use this skill to generate, modify, and preview Next.js components and logic based on natural language prompts, supporting iterative updates and Sandpack integration.
---

# V0 Clone

## Overview

The `v0-clone` skill empowers Gemini CLI to act as an advanced AI application generator. It specializes in building React/Next.js components, managing application logic, and providing a seamless development experience similar to Vercel's v0.

## Core Capabilities

### 1. Prompt-to-App Generation
- **Initial Scaffolding:** Create complex UI structures and layouts from a single prompt.
- **Component-Driven Development:** Focus on modular, reusable React components using Tailwind CSS and Lucide icons.
- **Modern Tech Stack:** Adheres to Next.js 15+ App Router patterns, TypeScript, and ESLint standards.

### 2. Iterative Refinement
- **Prompt Follow-up:** Understand and execute subsequent prompts to modify specific parts of the application.
- **Logic Modification:** Seamlessly update React state, hooks, and business logic without breaking the existing structure.
- **Content Updates:** Quickly swap text, images, and data structures as the user's vision evolves.

### 3. Interactive Previews (Sandpack)
- **Real-time Execution:** Prepare code for Sandpack-compatible environments to show live previews.
- **Hot Reloading:** Ensure changes are reflected instantly in the simulated environment.

## Workflow

1.  **Analyze Prompt:** Identify the core layout, required components, and intended functionality.
2.  **Generate Scaffold:** Create the primary `src/` files and directories needed for the feature.
3.  **Implement Logic:** Add interactive elements using `useState`, `useEffect`, and other React hooks.
4.  **Style with Tailwind:** Apply responsive and theme-consistent styling.
5.  **Validate & Iterate:** Confirm the code is error-free and ready for the user to review or refine.

## Best Practices
- **Atomic Components:** Keep components focused and small for better maintainability.
- **Type Safety:** Always use TypeScript interfaces/types for props and state.
- **User Feedback:** Prioritize clear, concise updates that show immediate progress.
