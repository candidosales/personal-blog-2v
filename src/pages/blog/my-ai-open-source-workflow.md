---
layout: ../../layouts/MarkdownPostLayout.astro
title: 'My AI Open Source Workflow'
pubDate: 2026-01-24
author: 'Candido Gomes'
description: 'Lately, I have been studying AI and Open Source Workflows. I thought it would be interesting to share a bit of what I am learning.'
image:
    url: '/blog/my-ai-open-source-workflow/thumbnail.webp'
    alt: 'My AI Open Source Workflow'
tags: ["ai", "open source", "workflow", "ollama", "opencode", "z.ai", "roborev"]
---

I have been researching an alternative for an Open Source AI workflow that is efficient and easy to use. Recently, I discovered some interesting tools that can help create this workflow. In this post, I'm going to share what I've learned and how I'm using these tools.

### Tools Used

- [Ollama](https://ollama.com/): A tool for running language models locally.
- [OpenCode](https://opencode.ai/): The open source AI coding agent.
- [Z.ai](https://z.ai/): Provides various AI models.
- [roborev](https://www.roborev.io/): A tool for automated review.

The example I'm going to show is updating a React Native application to Expo SDK 55 beta, which was [recently released](https://expo.dev/changelog/sdk-55-beta).

First, I had to install the skills in the root of the project that will help me perform this task.

```bash
bunx skills add expo/skills
```

> If you don't have `bunx` installed, you can install it by following the instructions at [https://bun.sh/](https://bun.sh/).

I selected:
- the skills: expo-api-routes, expo-dev-client, use-dom, expo-cicd-workflows, expo-deployment, upgrading-expo;
- the agents: Antigravity, Claude Code, Cursor, Gemini CLI, GitHub Copilot, OpenCode;
- where to install: in the current project;
- Installation method: Symlink (Recommended)
  - This method creates symbolic links to the skills in your project, allowing for easy updates and management for all agents.

![bunx-add-skill](/blog/my-ai-open-source-workflow/bunx-add-skill.webp)


Next, I installed Ollama on my machine. Ollama allows running language models locally, which is great for privacy and control.

```bash
brew install ollama
```

Ollama recently released the `launch` command where you can install and run your favorite coding tools like Claude Code, OpenCode, and Codex with local or cloud models.

```bash
ollama launch
```

I selected OpenCode and the `glm-4.7:cloud` model. Since my machine doesn't support `glm-4.7:flash`, I opted to use the cloud model.

### The GLM-4.7 Model

GLM-4.7 is an advanced language model that offers excellent performance in coding tasks. It is capable of understanding and generating code in various programming languages, making it an ideal choice for OpenCode.

> [Code Arena](https://lmarena.ai/leaderboard): A professional coding evaluation system with millions of global users participating in blind tests. GLM-4.7 ranks first among open-source models and domestic models, outperforming GPT-5.2

![glm-4.7-code-arena](/blog/my-ai-open-source-workflow/glm-4.7-code-arena.webp)

If you want to know more about GLM-4.7, you can check out the [official post](https://docs.z.ai/guides/llm/glm-4.7).

### Using OpenCode

With the environment ready, I can start using OpenCode to help with my application update.

So I opened OpenCode with the command in the project root:

```bash
opencode
```

Then I typed the prompt "Upgrade this project to Expo SDK 55" in "Plan" mode, and OpenCode started analyzing the project and suggesting changes.

![1-open-code-upgrade-55-sdk](/blog/my-ai-open-source-workflow/1-open-code-upgrade-55-sdk.webp)

Upon finishing the plan, OpenCode showed me a list of tasks it would execute to update the project. With that, I switched the agent mode to "Build" using the `tab` key and typed "Follow the plan" in the prompt, so OpenCode began making changes to the code via an agent.

![2-open-code-build](/blog/my-ai-open-source-workflow/2-open-code-build.webp)

OpenCode was very efficient in identifying the necessary changes and applying them to the code. It updated the dependencies, adjusted the code to be compatible with the new Expo SDK version, and made other improvements.

### Code Review with roborev

[roborev](https://www.roborev.io/) is an automated review tool that helps identify code issues and suggest improvements.

So, I installed roborev on my machine and used it to review the changes made by OpenCode.
```bash
curl -fsSL https://roborev.io/install.sh | bash
```

Inside the project folder, I ran the command:

```bash
roborev init # Install post-commit hook
```

![3-roborev-init](/blog/my-ai-open-source-workflow/3-roborev-init.webp)

I created the `.roborev.toml` file with the following content:

```toml title=".roborev.toml"
agent = "copilot"
```

This will set the review agent to Copilot, which is an AI model specialized in code review. RoboRev supports other agents like Claude Code or Gemini; see more in the [documentation](https://www.roborev.io/agents/).

Then I ran the command to review the current branch:

```bash
roborev review --branch
```

![4-roborev-branch](/blog/my-ai-open-source-workflow/4-roborev-branch.webp)

![5-roborev-background](/blog/my-ai-open-source-workflow/5-roborev-background.webp)

It will start a background process that will analyze the changes and generate a review report. After a few seconds, I received the report with suggestions for improvements and fixes.

Next, I ran the command to start an interactive review session:

```bash
roborev tui
```

I selected the first review session and started analyzing the suggestions made by RoboRev.

![6-roborev-session](/blog/my-ai-open-source-workflow/6-roborev-session.webp)

With this, I can copy the suggestions and apply them in the prompt. RoboRev was very useful for ensuring that the changes made by OpenCode were correct and followed coding best practices.

![7-roborev-copy](/blog/my-ai-open-source-workflow/7-roborev-copy.webp)

### Conclusion

By combining Ollama, OpenCode, and roborev, I was able to create an efficient workflow to update my React Native application to Expo SDK 55 beta. These AI tools helped me automate a large part of the process, saving time and effort.

If you're looking for a way to improve your development workflow, I recommend trying out these tools.