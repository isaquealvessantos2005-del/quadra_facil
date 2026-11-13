# ⚽ Quadra Fácil

Sistema web para organização de equipes e partidas de futsal. O projeto permite cadastrar jogadores, registrar partidas e acompanhar o desempenho do time em um painel simples e responsivo.

🔗 **Acesse o projeto:** [isaquealvessantos2005-del.github.io/quadra_facil](https://isaquealvessantos2005-del.github.io/quadra_facil/)

---

## 📋 Sobre o projeto

O **Quadra Fácil** é um projeto acadêmico de front-end, desenvolvido com HTML5, CSS3 e JavaScript puro, sem frameworks ou bibliotecas externas. Ele simula um painel de gestão para um time de futsal, com foco em organização e facilidade de uso.

## ✨ Funcionalidades

- **Visão geral:** painel com resumo da equipe (jogadores cadastrados, partidas registradas, vitórias e gols marcados), além de listas com os jogadores recentes e as próximas partidas.
- **Jogadores:** cadastro com nome, número da camisa, posição (Goleiro, Fixo, Ala ou Pivô) e idade. Também é possível buscar por nome ou número, filtrar por posição e remover jogadores.
- **Partidas:** registro de jogos com adversário, data, horário, placar e situação (Agendada ou Finalizada). Também é possível buscar por adversário e filtrar por resultado (vitória, derrota, empate ou agendada).
- **Estatísticas automáticas:** o placar das partidas finalizadas alimenta os números do painel. Partidas agendadas não entram nas estatísticas.
- **Validação de formulários:** os campos são verificados antes de salvar, com mensagens de erro.
- **Design responsivo:** o layout se adapta a computadores, tablets e celulares. No celular, o menu lateral vira uma barra de navegação na parte inferior.

## 🛠️ Tecnologias utilizadas

| Tecnologia | Uso |
|---|---|
| HTML5 | Estrutura das páginas, formulários e janelas modais (`<dialog>`) |
| CSS3 | Estilização, layout com Flexbox e Grid, variáveis CSS e media queries |
| JavaScript | Interatividade, cadastros, filtros, buscas e cálculo das estatísticas |
| Google Fonts | Fontes DM Sans e Outfit |

## 📁 Estrutura do projeto

```
quadra_facil/
├── index.html   # Estrutura da página
├── style.css    # Estilos e responsividade
├── app.js       # Lógica da aplicação
└── README.md    # Documentação do projeto
```

## 🚀 Como executar

1. Baixe ou clone o repositório:
   ```bash
   git clone https://github.com/isaquealvessantos2005-del/quadra_facil.git
   ```
2. Abra a pasta do projeto.
3. Dê um duplo clique no arquivo `index.html` para abri-lo no navegador.

Não é necessário instalar nada nem usar servidor. Basta ter um navegador atualizado.

## ⚠️ Observações

Os dados cadastrados são mantidos **apenas durante a sessão atual**. Ao atualizar ou fechar a página, os jogadores e as partidas são reiniciados, pois o projeto não utiliza banco de dados nem armazenamento permanente.

## 🔮 Melhorias futuras

- Salvar os dados no navegador (localStorage) ou em um banco de dados
- Edição de jogadores e partidas já cadastrados
- Estatísticas por jogador (gols, assistências, cartões)
- Tabela de classificação do campeonato

## 👨‍💻 Autor

Desenvolvido por **Isaque Alves Santos** como projeto acadêmico de HTML5, CSS3 e JavaScript.

[Perfil no GitHub](https://github.com/isaquealvessantos2005-del)
