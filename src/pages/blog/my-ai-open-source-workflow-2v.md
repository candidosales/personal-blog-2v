---
layout: ../../layouts/MarkdownPostLayout.astro
title: 'My AI Open Source Workflow 2v'
pubDate: 2026-05-11
author: 'Candido Gomes'
description: 'Lately, I have been studying AI and Open Source Workflows. I thought it would be interesting to share a bit of what I am learning.'
image:
    url: '/blog/my-ai-open-source-workflow-2v/thumbnail.webp'
    alt: 'My AI Open Source Workflow 2v'
tags: ["ai", "open source", "pi", "hugging face", "opencode", "kimi k2.6"]
---

Eu tenho explorado muitas ferramentas ultimamente, e acho que consegui encontrar um ótimo equilíbrio entre simplicidade, eficiência e menor consumo de tokens. Com isso divide as ferramentas em dois aspectos, infraestrutura e workflow.

## Infrastructure

- [Pi agent](https://pi.dev/)
- [rtk](https://github.com/rtk-ai/rtk)
- [GitNexus](https://github.com/abhigyanpatwari/GitNexus)
- [Kimi K2.6](https://www.kimi.com/ai-models/kimi-k2-6)

## Workflow

- [Compound engineer](https://github.com/EveryInc/compound-engineering-plugin)

### Pi agent

Imagina o Claude Code, mas sem o hardcoded MCP, sem sub-agents, sem plan mode, sem um monte de context que o Claude injeta e altera no seu prompt a cada release, além de ser super simples e altamente customizável (skills, prompt, themes, extensions). Consequentemente, menos features, menos bugs e uma ferramenta mais estável.

De acordo com o autor, quando você inicia uma sessão, por exemplo, o Claude Code injeta ~10000 tokens como harness.

![image](/blog/my-ai-open-source-workflow-2v/tokens-per-session.png)

Com o Pi consigo ter maior controle sobre o contexto em que quero trabalhar e menor interferência da ferramenta, onde acredito que a ferramenta deva se adaptar ao meu fluxo e não o inverso.

### rtk

Ele funciona como um intermediário entre o bash e o request HTTP onde ele filtra tudo que não é útil de comandos que são frequentemente utilizados como `ls`, `cat`, `grep`, e em seguida os comprime tendo uma redução em média ~80% de tokens.

É bem simples de integrar no seu workflow, e executando `rtk gain`, você visualiza o quanto está sendo economizado por comando.

### GitNexus

Analiza todo seu repositório, cria um grafo de depedências e armazena essa info no LadyBugDb (seria um DuckDb, mas para banco de dados de grafos), em seguida expôs essa informação através de um MCP server, assim sempre que o LLM for fazer uma pesquisa, ele não precisa ir fazendo um regex e tenta adivinha quais dependências estão naquele arquivo, ele já encontra facilmente via Graph query e esse reduz muito a quantidade de tokens além da acurácia da busca.

Para inicializar em seu projeto, você precisa:
1. Analizar o projeto e indexar o grafo usando: `npx gitnexus analyze`;
2. Em seguida, inicializa o servidor MCP: `npx gitnexus@latest serve`;
3. Adicionar o .mcp.json na raiz do seu projeto contendo:

```json title=".mcp.json"
{
  "mcpServers": {
    "gitnexus": {
      "command": "npx",
      "args": ["-y", "gitnexus@latest", "mcp"]
    }
  }
}
```

3. Instale o plugin de MCP adapter no Pi para que a integração entre as duas ferramentas funcione: `pi install npm:pi-mcp-adapter`;
4. Inicialize o `pi`, e abaixo fez a mesma query onde uma utilizando a integração do Hugging Face com Kimi K2.6 usando o GitNexus MCP, e na outra apenas o Claude Code.

![image](/blog/my-ai-open-source-workflow-2v/mcp-pi-connected.png)

O prompt que utilizei foi `explain how diagnosis api works`, você pode observar na imagem abaixo que o Pi já consulta o GitNexus antes de executar qualquer comando bash, assim ele busca no banco de dados [LadybugDb](https://ladybugdb.com/) por todas as dependências e encontra todas as relações, é muito mais eficiente.

![image](/blog/my-ai-open-source-workflow-2v/pi-gitnexus-1.png)

![image](/blog/my-ai-open-source-workflow-2v/pi-gitnexus-2.png)

Já usando o Claude Code, sem GitNexus, você observa com o mesmo prompt e sem a conexão com o GitNexus, ele inicia a busca no código usando o Bash, onde não é tão eficaz.

![image](/blog/my-ai-open-source-workflow-2v/claude-code-1.png)

Em relação a custo, você pode avaliar o baixo consumo de tokens entre as duas abordagens.

![image](/blog/my-ai-open-source-workflow-2v/pi-gitnexus-costs.png)

![image](/blog/my-ai-open-source-workflow-2v/claude-code-costs.png)


### Kimi K2.6

Acredito que um LLM open source bastante [promissor](https://www.kimi.com/blog/kimi-k2-6) não só apenas para atividades simples, mas para atividades complexas e de longa duração.

Para melhor integração com o `Pi`, eu utilizo o Hugging Face que oferece via Inference Provider ([Novita](https://huggingface.co/inference/models?model=moonshotai%2FKimi-K2.6)) o acesso ao Kimi K2.

Para isso você precisar criar uma conta paga no Hugging Face, criar um **Access Token** com os privilégios:
- Make calls to Inference Providers;
- Make calls to your Inference Endpoints;

![image](/blog/my-ai-open-source-workflow-2v/hf-privileges.png)

Em seguida, acessar o `pi` e `/login`, "Use an API key", selecione "Hugging Face" e adicione o token. Agora você terá acesso a todos os LLM open source. 

O custo para 1M tokens é apenas $0.95, é 7x mais barato que Claude Code.

![image](/blog/my-ai-open-source-workflow-2v/kimi-k26-costs.jpeg)

Vale a pena conferir, por exemplo, Cursor utilizou o Kimi 2.5 como reinforcement learning para o [Composer 2](https://techcrunch.com/2026/03/22/cursor-admits-its-new-coding-model-was-built-on-top-of-moonshot-ais-kimi/).

### Compound engineer

Existem vários ferramentas para tornar o seu workflow mais agentic possível como [superpowers](https://github.com/obra/superpowers), [OpenSpec](https://github.com/Fission-AI/OpenSpec/), [spec-kit](https://github.com/github/spec-kit), [get-shit-done](https://github.com/gsd-build/get-shit-done), e o que mais gostei até o momento e que venho usando há alguns meses é o [compound-engineering-plugin](https://github.com/EveryInc/compound-engineering-plugin).

Esse [plugin](https://every.to/guides/compound-engineering) é mantido pelo time da Every, onde eles estão constantemente aprimorando e otimizando as skills, onde a filosofia por trás da ferramenta é simples, `Plan → Work → Review → Compound → Repeat`. 

Atualmente, para tarefas que identifico que serão complexas ou que vão requerer várias etapas, como novas features que envolvam múltiples repositórios, migrações críticas, refatorações sempre um o compound-engineer, onde começo por:

- `/ce-brainstorm`: - When you're not sure what to build, start here. This command helps you brainstorm answers about what to build and plan answers for how to build them. Explore requirements and approaches through **collaborative dialogue**. Geralmente adiciono o link do RFC do Notion ou link da task do Linear nessa etapa, com isso **tenho o MCP do Notion e Linear integrados ao meu ambiente**. Ao final dessa etapa ele cria um arquivo markdown que servirá de memória para o passo seguinte;
- `/ce-plan`: Planning transforms an idea into a blueprint, and better plans produce better results. Sempre ao final de um plan, eu pergunto para **revisar e refinar**, pois ele sempre encontra novos cavets que ainda não tinha observado; Aqui também ele é cria um arquivo, mas separado, que irá conduzir a execução das tarefas. Se for uma task que vai envolver muitos arquivos, peço para planejar de uma forma que quebre a task in stacked PRs com no máximo 20 arquivos, assim fica melhor para os nossos teammates revisarem.
- `/ce-work`: Execution follows the plan. The agent implements while the developer monitors.
- `/ce-review`: This step catches issues before they ship. More importantly, it captures learnings for the next cycle, which becomes the basis for compound engineering. spawns more than 14 specialized agents in parallel that run simultaneously: security-sentinel, performance-oracle, data-integrity-guardian, architecture-strategist, pattern-recognition-specialist, code-simplicity-reviewer, and framework-specific reviewers (DHH-rails, Kieran-rails, TypeScript, Python). Everything gets combined into a single, prioritized list.
- `/ce-commit-push-pr`: Commit, push, abri um PR e adiciona um título e descrição. Muito útil.

Esse fluxo tem me ajudado bastante em grandes migrações, implementação de novas arquiteturas, foi um grande time consuming.

Plans are the new code: The plan document is now the most important thing you produce. Instead of coding first and documenting later, as you might have traditionally, start with a plan. This becomes the source of truth your agents use to generate, test, and validate code. Having a plan helps capture decisions before they become bugs. Fixing ideas on paper is cheaper than fixing code later.

Ao final do trabalho, você pode salvar esses arquivos que são gerados pelo plugin como referência. Eu os salvo é uma pasta separada por projeto, assim fica fácil de eu linká-los quando preciso.

### Conclusion

Observo que a cada mês que passa, venho tornando meu fluxo mais lean, com melhor acurácia e menor custo. A utilização do Pi + LLM Open source me trouxe uma redução de custo grande, sem perder a qualidade. Onde a qualidade do seu output está diretamente relacionado o quanto de contexto e acesso você oferece ao seu LLM, e isso na fase de planning usando o compound engineer está sendo resolvido brilhantemente.

Meu próximos passos é criar um fluxo totalmente automatizado, onde pela manhã ele checa minhas tarefas, seleciona uma, planeja, implementa, abre o PR, me notifica, e quando acordar, apenas reviso, onde essa infraestrutura rode localmente dentro de um container. Quero utilizar para esse experimento o [Flue](https://flueframework.com/), um framework criado pelo time do [Astro](https://astro.build/) para criar agentes autonomos com Typescript. Quando tiver um resultado considerável, compartilharei aqui como foi implementado :)

Espero que esse artigo traga uma melhor direção diante do mar de novidades que o ecossistema de AI nos enunda todos os dias, e que melhore um pouco mais o seu dia-a-dia como desenvolvedor. E ressalto, não terceirize o entendimento do seu código.

https://x.com/karpathy/status/2049907410303865030

### Note

Se você está iniciando e quer um curso introdutório sobre criar ufull lifecycle of AI-assisted development recomendo esse workshop do Matt Pocock

https://www.youtube.com/watch?v=-QFHIoCo-Ko

### References

- [Full Walkthrough: Workflow for AI Coding — Matt Pocock](https://www.youtube.com/watch?v=-QFHIoCo-Ko)
- [Pi Agent – Crash Course | Minimal Coding Agent](https://www.youtube.com/watch?v=N30XGyPrr6I)
- [Building pi in a World of Slop — Mario Zechner](https://www.youtube.com/watch?v=RjfbvDXpFls)
- [Kimi K2.6](https://x.com/kirillk_web3/status/2053210009689870535)
- [Kimi K2.6: Advancing Open-Source Coding](https://www.kimi.com/blog/kimi-k2-6)
- [Compound Engineering - The AI-native engineering philosophy](https://every.to/guides/compound-engineering)
- [Cursor admits its new coding model was built on top of Moonshot AI’s Kimi](https://techcrunch.com/2026/03/22/cursor-admits-its-new-coding-model-was-built-on-top-of-moonshot-ais-kimi/)