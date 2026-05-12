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

Tenho explorado muitas ferramentas ultimamente e acho que consegui encontrar um ótimo equilíbrio entre simplicidade, eficiência e menor consumo de tokens. Com isso, dividi as ferramentas em dois aspectos: infraestrutura e workflow, e ao longo vou explicar sobre cada uma delas e como integrar em seu ambiente.

### Infrastructure

- [Pi agent](https://pi.dev/)
- [rtk](https://github.com/rtk-ai/rtk)
- [GitNexus](https://github.com/abhigyanpatwari/GitNexus)
- [Kimi K2.6](https://www.kimi.com/ai-models/kimi-k2-6)

### Workflow

- [Compound engineer](https://github.com/EveryInc/compound-engineering-plugin)

## Pi agent

Imagine o Claude Code, mas sem o MCP hardcoded, sem sub-agents, sem plan mode, sem um monte de contexto que o Claude injeta e altera no seu prompt a cada release, além de ser super simples e altamente customizável (skills, prompt, themes, extensions). Consequentemente: menos features desnecessárias, menos bugs e uma ferramenta mais estável.

De acordo com o autor, quando você inicia uma sessão, o Claude Code injeta ~10.000 tokens como harness.

![image](/blog/my-ai-open-source-workflow-2v/tokens-per-session.webp)

*Comparação de tokens injetados por sessão: Pi vs Claude Code*

Com o Pi consigo ter maior controle sobre o contexto em que quero trabalhar e menor interferência da ferramenta. Acredito que a ferramenta deva se adaptar ao meu fluxo, e não o inverso.

## rtk

Ele funciona como um intermediário entre o bash e o request HTTP: filtra tudo que não é útil de comandos frequentemente utilizados como `ls`, `cat` e `grep`, e em seguida os comprime, resultando em uma redução média de ~80% nos tokens.

É simples de integrar ao seu workflow, bastar instalar seu binário `brew install rtk`. 

Executando `rtk gain`, você visualiza o quanto está sendo economizado por comando, como demonstrado abaixo.

![image](/blog/my-ai-open-source-workflow-2v/rtk-gain.webp)

*Saída do `rtk gain` mostrando a economia de tokens por comando*

## GitNexus

Analisa todo o seu repositório, cria um grafo de dependências e armazena essa informação no [LadyBugDb](https://ladybugdb.com/) (pense em um DuckDB, mas para banco de dados de grafos usando columnar storage). Em seguida, expõe essa informação através de um MCP server. Assim, sempre que o LLM for fazer uma pesquisa, ele não precisa fazer regex ou comandos bash para encontrar quais dependências estão em determinado arquivo, ele já encontra facilmente via Graph query. Isso reduz muito a quantidade de tokens e aumenta a acurácia da busca.

Para inicializar em seu projeto, você precisa:

1. Analisar o projeto e indexar o grafo: `npx gitnexus analyze`;
2. Inicializar o servidor MCP: `npx gitnexus@latest serve`;
3. Adicionar o `.mcp.json` na raiz do seu projeto:

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

4. Instalar o plugin MCP adapter no Pi para que a integração funcione: `pi install npm:pi-mcp-adapter`;
5. Inicializar o `pi`. Abaixo, fiz a mesma query em dois cenários: um utilizando a integração do Hugging Face com Kimi K2.6 e GitNexus MCP, e outro usando apenas o Claude Code.

![image](/blog/my-ai-open-source-workflow-2v/mcp-pi-connected.webp)

*Pi com o MCP do GitNexus conectado*

O prompt utilizado foi `explain how diagnosis api works`. Na imagem abaixo, você pode observar que o Pi já consulta o GitNexus antes de executar qualquer comando bash — ele busca no [LadybugDb](https://ladybugdb.com/) por todas as dependências e encontra todas as relações. É muito mais eficiente.

![image](/blog/my-ai-open-source-workflow-2v/pi-gitnexus-1.webp)

*Pi consultando o GitNexus via Graph query antes de qualquer comando bash*

![image](/blog/my-ai-open-source-workflow-2v/pi-gitnexus-2.webp)

*Todas as dependências encontradas via LadybugDb*

Usando o Claude Code sem o GitNexus, com o mesmo prompt, ele inicia a busca no código via Bash — o que é menos eficaz.

![image](/blog/my-ai-open-source-workflow-2v/claude-code-1.webp)

*Claude Code buscando dependências via Bash, sem o GitNexus*

Em relação a custo, você pode comparar o consumo de tokens entre as duas abordagens:

![image](/blog/my-ai-open-source-workflow-2v/pi-gitnexus-costs.webp)

*Custo de tokens: Pi + Kimi K2.6 + GitNexus*

![image](/blog/my-ai-open-source-workflow-2v/claude-code-costs.webp)

*Custo de tokens: Claude Code sem GitNexus*


## Kimi K2.6

Acredito que é um LLM open source bastante [promissor](https://www.kimi.com/blog/kimi-k2-6), não apenas para atividades simples, mas também para tarefas complexas e de longa duração.

Para melhor integração com o `Pi`, utilizo o Hugging Face, que oferece via Inference Provider ([Novita](https://huggingface.co/inference/models?model=moonshotai%2FKimi-K2.6)) o acesso ao Kimi K2.

Para isso, você precisa criar uma conta paga no Hugging Face e gerar um **Access Token** com os seguintes privilégios:
- Make calls to Inference Providers;
- Make calls to your Inference Endpoints;

![image](/blog/my-ai-open-source-workflow-2v/hf-privileges.webp)

*Privilégios necessários para o Access Token no Hugging Face*

Em seguida, acesse o `pi`, execute `/login`, selecione **Use an API key**, escolha **Hugging Face** e adicione o token. A partir daí, você terá acesso a todos os LLMs open source disponíveis.

O custo para 1M tokens é apenas $0.95, 7x mais barato que o Claude Code.

![image](/blog/my-ai-open-source-workflow-2v/kimi-k26-costs.webp)

*Kimi K2.6 via Hugging Face: $0.95/1M tokens, 7x mais barato que Claude Code*

Vale a pena conferir: o Cursor, por exemplo, utilizou o Kimi 2.5 como base de reinforcement learning para o [Composer 2](https://techcrunch.com/2026/03/22/cursor-admits-its-new-coding-model-was-built-on-top-of-moonshot-ais-kimi/).

## Compound engineer

Existem várias ferramentas para tornar o seu workflow mais agentic, como [superpowers](https://github.com/obra/superpowers), [OpenSpec](https://github.com/Fission-AI/OpenSpec/), [spec-kit](https://github.com/github/spec-kit) e [get-shit-done](https://github.com/gsd-build/get-shit-done). A que mais gostei até o momento, e que venho usando há alguns meses, é o [compound-engineering-plugin](https://github.com/EveryInc/compound-engineering-plugin).

Esse [plugin](https://every.to/guides/compound-engineering) é mantido pelo time da Every, que está constantemente aprimorando e otimizando as skills. A filosofia por trás da ferramenta é simples: `Plan → Work → Review → Compound → Repeat`.

Para tarefas complexas ou de múltiplas etapas — como novas features que envolvam múltiplos repositórios, migrações críticas e refatorações, sempre utilizo o compound-engineer. O fluxo que sigo:

- `/ce-brainstorm`: Ponto de partida quando não tenho clareza total do que construir. Explora requisitos e abordagens através de **diálogo colaborativo**. Geralmente adiciono o link do RFC do Notion ou da task do Linear nessa etapa, para isso **tenho os MCPs do Notion e do Linear integrados ao meu ambiente**. Ao final, ele gera um arquivo markdown que serve de memória para o próximo passo;
- `/ce-plan`: Transforma a ideia em um blueprint. Sempre ao final de um plan, peço para **revisar e refinar**, pois ele costuma encontrar novos caveats que não tinha observado. Aqui ele gera um arquivo separado que vai conduzir a execução. Se a task envolver muitos arquivos, peço para planejar em stacked PRs com no máximo 20 arquivos — facilita bastante a revisão pelos teammates;
- `/ce-work`: Execução segue o plano. O agente implementa enquanto o desenvolvedor monitora;
- `/ce-review`: Captura problemas antes de chegar à produção. Mais importante ainda, registra aprendizados para o próximo ciclo. Dispara mais de 14 agentes especializados em paralelo: security-sentinel, performance-oracle, data-integrity-guardian, architecture-strategist, pattern-recognition-specialist, code-simplicity-reviewer, e revisores específicos por framework (DHH-rails, Kieran-rails, TypeScript, Python). Tudo consolidado em uma única lista priorizada;
- `/ce-commit-push-pr`: Faz o commit, push, abre o PR e gera título e descrição. Muito útil.

Esse fluxo tem me ajudado bastante em grandes migrações e implementações de novas arquiteturas, é uma ferramenta que me trouxe muita economia de tempo.

> **Plans are the new code:** O documento de plano é agora o artefato mais importante que você produz. Em vez de codar primeiro e documentar depois, comece pelo plano. Ele se torna a fonte da verdade que os agentes usam para gerar, testar e validar código. Um bom plano captura decisões antes que elas se tornem bugs, corrigir ideias no papel é muito mais barato do que corrigir código depois.

Ao final do trabalho, salvo os arquivos gerados pelo plugin em uma pasta separada por projeto, facilitando vinculá-los quando necessário.

## Conclusion

Observo que a cada mês, meu fluxo fica mais lean, com melhor acurácia e menor custo. A combinação Pi + LLM open source me trouxe uma redução de custo expressiva sem perda de qualidade. A qualidade do output está diretamente relacionada ao quanto de contexto e acesso você oferece ao LLM, e isso, na fase de planejamento com o compound engineer, está sendo resolvido de forma muito eficiente.

Meus próximos passos são criar um fluxo totalmente automatizado: de manhã, o agente checa minhas tarefas, seleciona uma, planeja, implementa, abre o PR e me notifica — quando eu acordar, só preciso revisar. Quero que essa infraestrutura rode localmente dentro de um container. Para esse experimento, pretendo usar o [Flue](https://flueframework.com/), um framework criado pelo time do [Astro](https://astro.build/) para criar agentes autônomos com TypeScript. Quando tiver um resultado considerável, compartilharei aqui como foi implementado.

Espero que esse artigo traga uma direção melhor diante do mar de novidades que o ecossistema de AI nos inunda todos os dias, e que melhore um pouco o seu dia a dia como desenvolvedor. E reforço: não terceirize o entendimento do seu código.

https://x.com/karpathy/status/2049907410303865030

### Note

Se você está iniciando e quer um curso introdutório sobre o ciclo completo de desenvolvimento assistido por IA, recomendo esse workshop do Matt Pocock:

https://www.youtube.com/watch?v=-QFHIoCo-Ko

## References

- [Full Walkthrough: Workflow for AI Coding — Matt Pocock](https://www.youtube.com/watch?v=-QFHIoCo-Ko)
- [Pi Agent – Crash Course | Minimal Coding Agent](https://www.youtube.com/watch?v=N30XGyPrr6I)
- [Building pi in a World of Slop — Mario Zechner](https://www.youtube.com/watch?v=RjfbvDXpFls)
- [Kimi K2.6](https://x.com/kirillk_web3/status/2053210009689870535)
- [Kimi K2.6: Advancing Open-Source Coding](https://www.kimi.com/blog/kimi-k2-6)
- [Compound Engineering - The AI-native engineering philosophy](https://every.to/guides/compound-engineering)
- [Cursor admits its new coding model was built on top of Moonshot AI's Kimi](https://techcrunch.com/2026/03/22/cursor-admits-its-new-coding-model-was-built-on-top-of-moonshot-ais-kimi/)
