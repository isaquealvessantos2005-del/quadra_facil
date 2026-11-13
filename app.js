// Quadra Fácil — aplicação acadêmica de gerenciamento de equipe de futsal.
// Os dados ficam em memória e são reiniciados ao atualizar a página.

const state = { players: [], matches: [], editingPlayerId: null, editingMatchId: null };
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const playerDialog = $("#player-dialog");
const matchDialog = $("#match-dialog");

function makeId() {
    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
function initials(name) {
    return name.trim().split(/\s+/).slice(0, 2).map(part => part[0].toUpperCase()).join("");
}
function showToast(message) {
    const toast = $("#toast");
    toast.textContent = message;
    toast.classList.add("show");
    window.setTimeout(() => toast.classList.remove("show"), 2400);
}
function formatDate(date) {
    if (!date) return "";
    return new Date(`${date}T12:00:00`).toLocaleDateString("pt-BR");
}
function getMatchResult(match) {
    if (match.status === "Agendada") return "Agendada";
    if (match.goalsFor > match.goalsAgainst) return "Vitória";
    if (match.goalsFor < match.goalsAgainst) return "Derrota";
    return "Empate";
}
function resultClass(result) {
    return ({ Vitória: "win", Derrota: "loss", Empate: "draw", Agendada: "scheduled" })[result];
}

// Navegação entre as telas.
function navigate(view) {
    $$(".view").forEach(section => section.classList.toggle("active", section.id === `${view}-view`));
    $$(".nav-link").forEach(button => button.classList.toggle("active", button.dataset.view === view));
    $("#page-title").textContent = ({ overview: "Visão geral", players: "Jogadores", matches: "Partidas" })[view];
}
$$(".nav-link").forEach(button => button.addEventListener("click", () => navigate(button.dataset.view)));
$$("[data-go]").forEach(button => button.addEventListener("click", () => navigate(button.dataset.go)));

// Jogadores: cadastro, edição, remoção, pesquisa e filtro.
function openPlayerForm(player = null) {
    state.editingPlayerId = player?.id ?? null;
    $("#player-dialog-title").textContent = player ? "Editar jogador" : "Novo jogador";
    $("#player-name").value = player?.name ?? "";
    $("#player-number").value = player?.number ?? "";
    $("#player-position").value = player?.position ?? "";
    $("#player-age").value = player?.age ?? "";
    $("#player-error").textContent = "";
    playerDialog.showModal();
}
$("#open-player-form").addEventListener("click", () => openPlayerForm());
$("#player-form").addEventListener("submit", event => {
    event.preventDefault();
    const player = {
        id: state.editingPlayerId ?? makeId(),
        name: $("#player-name").value.trim(),
        number: Number($("#player-number").value),
        position: $("#player-position").value,
        age: Number($("#player-age").value)
    };
    const error = validatePlayer(player);
    if (error) { $("#player-error").textContent = error; return; }
    const duplicate = state.players.some(item => item.number === player.number && item.id !== player.id);
    if (duplicate) { $("#player-error").textContent = "Esse número de camisa já está em uso."; return; }
    if (state.editingPlayerId) {
        state.players = state.players.map(item => item.id === player.id ? player : item);
        showToast("Jogador atualizado com sucesso!");
    } else {
        state.players.push(player);
        showToast("Jogador cadastrado com sucesso!");
    }
    playerDialog.close();
    renderAll();
});
function validatePlayer(player) {
    if (player.name.length < 3) return "Informe um nome com pelo menos 3 caracteres.";
    if (!Number.isInteger(player.number) || player.number < 1 || player.number > 99) return "O número da camisa deve ser de 1 a 99.";
    if (!player.position) return "Selecione uma posição.";
    if (!Number.isInteger(player.age) || player.age < 5 || player.age > 80) return "Informe uma idade válida (5 a 80 anos).";
    return "";
}
$("#player-search").addEventListener("input", renderPlayers);
$("#position-filter").addEventListener("change", renderPlayers);
function renderPlayers() {
    const query = $("#player-search").value.trim().toLocaleLowerCase("pt-BR");
    const position = $("#position-filter").value;
    const filtered = state.players.filter(player =>
        (player.name.toLocaleLowerCase("pt-BR").includes(query) || String(player.number).includes(query)) &&
        (!position || player.position === position)
    );
    const container = $("#players-list");
    if (!filtered.length) {
        container.innerHTML = `<div class="empty-state">${state.players.length ? "Nenhum jogador encontrado com esses filtros." : "Nenhum jogador cadastrado. Clique em “Novo jogador” para começar."}</div>`;
        return;
    }
    container.innerHTML = filtered.map(player => `
    <article class="player-card">
      <div class="player-card-top">
        <div class="player-number">${player.number}</div>
        <div><h3>${escapeHTML(player.name)}</h3><p>${player.position}</p></div>
      </div>
      <div class="player-card-bottom">
        <span class="player-age">${player.age} anos</span>
        <span>
          <button class="text-button" data-edit-player="${player.id}">Editar</button>
          <button class="delete-button" data-delete-player="${player.id}">Excluir</button>
        </span>
      </div>
    </article>`).join("");
}

// Partidas: cadastro, placar, situação, pesquisa e filtro.
function openMatchForm(match = null) {
    state.editingMatchId = match?.id ?? null;
    $("#match-dialog-title").textContent = match ? "Editar partida" : "Nova partida";
    $("#opponent").value = match?.opponent ?? "";
    $("#match-date").value = match?.date ?? "";
    $("#match-time").value = match?.time ?? "";
    $("#goals-for").value = match?.goalsFor ?? 0;
    $("#goals-against").value = match?.goalsAgainst ?? 0;
    $("#match-status").value = match?.status ?? "Agendada";
    $("#match-error").textContent = "";
    matchDialog.showModal();
}
$("#open-match-form").addEventListener("click", () => openMatchForm());
$("#match-form").addEventListener("submit", event => {
    event.preventDefault();
    const match = {
        id: state.editingMatchId ?? makeId(),
        opponent: $("#opponent").value.trim(),
        date: $("#match-date").value,
        time: $("#match-time").value,
        goalsFor: Number($("#goals-for").value),
        goalsAgainst: Number($("#goals-against").value),
        status: $("#match-status").value
    };
    const error = validateMatch(match);
    if (error) { $("#match-error").textContent = error; return; }
    if (state.editingMatchId) {
        state.matches = state.matches.map(item => item.id === match.id ? match : item);
        showToast("Partida atualizada com sucesso!");
    } else {
        state.matches.push(match);
        showToast("Partida cadastrada com sucesso!");
    }
    matchDialog.close();
    renderAll();
});
function validateMatch(match) {
    if (match.opponent.length < 2) return "Informe o nome do time adversário.";
    if (!match.date || !match.time) return "Informe a data e o horário da partida.";
    if (!Number.isInteger(match.goalsFor) || !Number.isInteger(match.goalsAgainst) ||
        match.goalsFor < 0 || match.goalsAgainst < 0 || match.goalsFor > 99 || match.goalsAgainst > 99) {
        return "O placar deve conter números inteiros entre 0 e 99.";
    }
    return "";
}
$("#match-search").addEventListener("input", renderMatches);
$("#result-filter").addEventListener("change", renderMatches);
function renderMatches() {
    const query = $("#match-search").value.trim().toLocaleLowerCase("pt-BR");
    const filter = $("#result-filter").value;
    const filtered = [...state.matches]
        .filter(match => match.opponent.toLocaleLowerCase("pt-BR").includes(query))
        .filter(match => !filter || getMatchResult(match) === filter)
        .sort((a, b) => `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`));
    const container = $("#matches-list");
    if (!filtered.length) {
        container.innerHTML = `<div class="empty-state">${state.matches.length ? "Nenhuma partida encontrada com esses filtros." : "Nenhuma partida cadastrada. Clique em “Nova partida” para começar."}</div>`;
        return;
    }
    container.innerHTML = filtered.map(match => {
        const result = getMatchResult(match);
        return `<article class="match-card">
      <div><h3 class="match-opponent">× ${escapeHTML(match.opponent)}</h3><div class="match-date">${formatDate(match.date)} · ${match.time}</div></div>
      <div class="match-actions">
        <span class="result-pill ${resultClass(result)}">${result}</span>
        <strong class="score">${match.status === "Agendada" ? "—" : `${match.goalsFor}<small>×</small>${match.goalsAgainst}`}</strong>
        <span><button class="text-button" data-edit-match="${match.id}">Editar</button> <button class="delete-button" data-delete-match="${match.id}">Excluir</button></span>
      </div>
    </article>`;
    }).join("");
}

// Delegação de eventos: os botões dinâmicos funcionam mesmo após re-renderização.
document.addEventListener("click", event => {
    const editPlayer = event.target.closest("[data-edit-player]");
    const deletePlayer = event.target.closest("[data-delete-player]");
    const editMatch = event.target.closest("[data-edit-match]");
    const deleteMatch = event.target.closest("[data-delete-match]");
    if (editPlayer) openPlayerForm(state.players.find(item => item.id === editPlayer.dataset.editPlayer));
    if (deletePlayer && confirm("Deseja realmente excluir este jogador?")) {
        state.players = state.players.filter(item => item.id !== deletePlayer.dataset.deletePlayer);
        renderAll(); showToast("Jogador excluído.");
    }
    if (editMatch) openMatchForm(state.matches.find(item => item.id === editMatch.dataset.editMatch));
    if (deleteMatch && confirm("Deseja realmente excluir esta partida?")) {
        state.matches = state.matches.filter(item => item.id !== deleteMatch.dataset.deleteMatch);
        renderAll(); showToast("Partida excluída.");
    }
});
$$("[data-close]").forEach(button => button.addEventListener("click", () => $(`#${button.dataset.close}`).close()));
[playerDialog, matchDialog].forEach(dialog => dialog.addEventListener("click", event => {
    if (event.target === dialog) dialog.close();
}));

// Evita que textos digitados pelo usuário sejam interpretados como HTML.
function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, character => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
    })[character]);
}
function renderOverview() {
    const completed = state.matches.filter(match => match.status === "Finalizada");
    const wins = completed.filter(match => getMatchResult(match) === "Vitória").length;
    const goals = completed.reduce((sum, match) => sum + match.goalsFor, 0);
    $("#stat-players").textContent = state.players.length;
    $("#stat-matches").textContent = state.matches.length;
    $("#stat-wins").textContent = wins;
    $("#stat-goals").textContent = goals;

    const recent = [...state.players].slice(-4).reverse();
    $("#recent-players").innerHTML = recent.length ? recent.map(player => `
    <div class="compact-item"><div class="compact-left"><div class="mini-avatar">${initials(player.name)}</div>
    <div><div class="compact-name">${escapeHTML(player.name)}</div><div class="compact-meta">${player.position} · Camisa ${player.number}</div></div></div>
    <span class="position-pill">${player.age} anos</span></div>`).join("") : `<div class="empty-state">Nenhum jogador cadastrado ainda.</div>`;

    const upcoming = [...state.matches].filter(match => match.status === "Agendada")
        .sort((a, b) => `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`)).slice(0, 3);
    $("#upcoming-matches").innerHTML = upcoming.length ? upcoming.map(match => `
    <div class="compact-item"><div><div class="compact-name">${escapeHTML(match.opponent)}</div>
    <div class="compact-meta">${formatDate(match.date)} · ${match.time}</div></div><span class="result-pill scheduled">Agendada</span></div>`).join("") : `<div class="empty-state">Nenhuma partida cadastrada ainda.</div>`;
}
function renderAll() { renderPlayers(); renderMatches(); renderOverview(); }
renderAll();
