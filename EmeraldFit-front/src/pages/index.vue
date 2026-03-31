<template>
  <v-container fluid class="pa-0 app-bg" style="min-height: 100vh">
    <!-- Header -->
    <div :class="['header-section', { 'edit-mode-header': modoEdicaoGeral }]">
      <div class="d-flex align-center justify-space-between">
        <div class="d-flex align-center gap-2">
          <div :class="['logo-icon', { 'edit-mode': modoEdicaoGeral }]">
            <v-icon icon="mdi-diamond-stone" size="22" :color="modoEdicaoGeral ? 'white' : '#00dc82'"></v-icon>
          </div>
          <div>
            <h1 class="app-title">EmeraldFit</h1>
            <p :class="['app-subtitle', { 'edit-mode': modoEdicaoGeral }]">Seu treino, sua evolução</p>
          </div>
        </div>
        <v-btn
          icon
          variant="text"
          @click="modoEdicaoGeral = !modoEdicaoGeral"
          size="large"
          :class="['header-btn', { 'edit-active': modoEdicaoGeral }]"
        >
          <v-icon>{{ modoEdicaoGeral ? 'mdi-close-circle' : 'mdi-cog-outline' }}</v-icon>
        </v-btn>
      </div>
    </div>

    <v-container class="px-4 pb-8">
      <!-- Action bar -->
      <div class="mb-5 mt-1">
        <v-btn
          v-if="!modoEdicaoGeral"
          @click="abrirDialogCriar"
          size="large"
          block
          elevation="0"
          class="text-none create-btn"
          prepend-icon="mdi-plus-circle-outline"
        >
          Criar Treino
        </v-btn>
        <div v-else class="edit-mode-banner">
          <v-icon color="#ef4444" size="20" class="mr-2">mdi-pencil-circle</v-icon>
          <div>
            <p class="edit-mode-title">Modo de Edição</p>
            <p class="edit-mode-sub">Toque para editar ou deletar</p>
          </div>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loadingTreinos" class="loading-container">
        <div class="loading-spinner"></div>
        <p class="loading-text">Carregando treinos...</p>
      </div>

      <!-- Treinos list -->
      <transition-group name="treino-list" tag="div" v-else-if="treinos.length > 0" class="treinos-list">
        <div
          v-for="treino in treinos"
          :key="treino.id_treino"
          :class="['workout-card', 'mb-4', { 'edit-mode': modoEdicaoGeral }]"
          @click="abrirTreino(treino.id_treino)"
        >
          <div class="workout-card-inner">
            <div :class="['workout-icon-wrap', { 'edit-mode': modoEdicaoGeral }]">
              <v-icon :icon="treino.icone_mdi || 'mdi-dumbbell'" size="28" :class="['icon-color', { 'edit-mode': modoEdicaoGeral }]"></v-icon>
            </div>

            <div class="workout-info">
              <h3 :class="['workout-name', { 'edit-mode': modoEdicaoGeral }]">{{ treino.nome }}</h3>
              <p class="workout-desc">{{ treino.descricao }}</p>
              <div class="workout-meta">
                <div class="meta-badge">
                  <v-icon icon="mdi-dumbbell" size="14" :class="['meta-icon', { 'edit-mode': modoEdicaoGeral }]"></v-icon>
                  <span :class="['meta-value', { 'edit-mode': modoEdicaoGeral }]">{{ treino.quantidade_exercicios }}</span>
                  <span class="meta-label">exercícios</span>
                </div>
                <div class="meta-badge">
                  <v-icon icon="mdi-fire" size="14" color="#f97316" class="mr-1"></v-icon>
                  <span class="nivel-text">{{ treino.nivel }}</span>
                </div>
              </div>
            </div>

            <div v-if="modoEdicaoGeral" class="menu-wrap" @click.stop>
              <v-menu location="bottom end">
                <template v-slot:activator="{ props }">
                  <v-btn icon v-bind="props" variant="text" size="small">
                    <v-icon color="#94a3b8" size="20">mdi-dots-vertical</v-icon>
                  </v-btn>
                </template>
                <v-list density="compact" class="dark-menu">
                  <v-list-item @click="editarTreino(treino)">
                    <template v-slot:prepend>
                      <v-icon color="#00dc82" size="18">mdi-pencil</v-icon>
                    </template>
                    <v-list-item-title class="menu-item-text">Editar</v-list-item-title>
                  </v-list-item>
                  <v-divider color="#1e293b"></v-divider>
                  <v-list-item @click="confirmarDeletar(treino)">
                    <template v-slot:prepend>
                      <v-icon color="#ef4444" size="18">mdi-delete-outline</v-icon>
                    </template>
                    <v-list-item-title class="menu-item-text" style="color: #ef4444">Deletar</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </div>

            <v-icon v-else icon="mdi-chevron-right" size="20" color="#334155" class="chevron-icon"></v-icon>
          </div>
        </div>
      </transition-group>

      <!-- Empty state -->
      <div v-else class="empty-state">
        <div class="empty-icon-wrap">
          <v-icon icon="mdi-weight-lifter" size="52" color="#00dc82"></v-icon>
        </div>
        <h3 class="empty-title">Nenhum treino ainda</h3>
        <p class="empty-sub">Comece criando seu primeiro treino</p>
      </div>

      <!-- Dialog: Criar/Editar Treino -->
      <v-dialog persistent width="600" v-model="dialogTreino">
        <v-card class="dark-dialog">
          <div :class="['dialog-header', { 'edit-header': modoEdicao }]">
            <v-icon class="mr-2" size="20">{{ modoEdicao ? 'mdi-pencil' : 'mdi-plus-circle-outline' }}</v-icon>
            <span>{{ modoEdicao ? 'Editar Treino' : 'Criar Treino' }}</span>
            <v-spacer />
            <v-btn icon variant="text" size="small" @click="fecharDialog">
              <v-icon size="20">mdi-close</v-icon>
            </v-btn>
          </div>
          <v-card-text class="pt-5 pb-2">
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="formTreino.nome"
                  density="comfortable"
                  variant="outlined"
                  label="Título do treino"
                  clearable
                  hide-details
                  :color="modoEdicao ? '#ef4444' : '#00dc82'"
                  class="dark-field"
                />
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="formTreino.descricao"
                  density="comfortable"
                  variant="outlined"
                  label="Descrição do treino"
                  clearable
                  hide-details
                  rows="3"
                  :color="modoEdicao ? '#ef4444' : '#00dc82'"
                  class="dark-field"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-select
                  v-model="formTreino.nivel"
                  density="comfortable"
                  variant="outlined"
                  label="Nível do treino"
                  clearable
                  hide-details
                  item-value="value"
                  item-title="text"
                  :items="selectStage"
                  :color="modoEdicao ? '#ef4444' : '#00dc82'"
                  class="dark-field"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-select
                  v-model="formTreino.icone_mdi"
                  density="comfortable"
                  variant="outlined"
                  label="Ícone"
                  clearable
                  hide-details
                  item-value="value"
                  item-title="text"
                  :items="icones"
                  :color="modoEdicao ? '#ef4444' : '#00dc82'"
                  class="dark-field"
                >
                  <template v-slot:selection="{ item }">
                    <v-icon :icon="item.value" size="18" :color="modoEdicao ? '#ef4444' : '#00dc82'" class="mr-2"></v-icon>
                    {{ item.title }}
                  </template>
                  <template v-slot:item="{ props, item }">
                    <v-list-item v-bind="props">
                      <template v-slot:prepend>
                        <v-icon :icon="item.value" :color="modoEdicao ? '#ef4444' : '#00dc82'"></v-icon>
                      </template>
                    </v-list-item>
                  </template>
                </v-select>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions class="px-5 pb-5">
            <v-spacer></v-spacer>
            <v-btn @click="fecharDialog" variant="flat" class="text-none cancel-btn">Cancelar</v-btn>
            <v-btn
              @click="salvarTreino"
              variant="flat"
              :class="['text-none', 'confirm-btn', { 'edit-confirm': modoEdicao }]"
              :disabled="!formTreino.nome || !formTreino.nivel"
              :loading="loadingSalvarTreino"
            >
              {{ modoEdicao ? 'Salvar' : 'Criar' }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Dialog: Confirmar Deletar Treino -->
      <v-dialog v-model="dialogDeletar" max-width="400">
        <v-card class="dark-dialog">
          <div class="dialog-header edit-header">
            <v-icon class="mr-2" size="20">mdi-alert-circle-outline</v-icon>
            <span>Confirmar Exclusão</span>
          </div>
          <v-card-text class="pt-5">
            <p class="confirm-text">Deletar o treino <strong style="color: white">{{ treinoParaDeletar?.nome }}</strong>?</p>
            <p class="confirm-sub">Esta ação não pode ser desfeita.</p>
          </v-card-text>
          <v-card-actions class="px-5 pb-5">
            <v-spacer></v-spacer>
            <v-btn @click="dialogDeletar = false" variant="flat" class="text-none cancel-btn">Cancelar</v-btn>
            <v-btn @click="deletarTreino" variant="flat" class="text-none delete-btn" :loading="loadingDeletarTreino">Deletar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Dialog: Confirmar Deletar Exercício -->
      <v-dialog v-model="dialogDeletarExercicio" max-width="400">
        <v-card class="dark-dialog">
          <div class="dialog-header edit-header">
            <v-icon class="mr-2" size="20">mdi-alert-circle-outline</v-icon>
            <span>Confirmar Exclusão</span>
          </div>
          <v-card-text class="pt-5">
            <p class="confirm-text">Deletar o exercício <strong style="color: white">{{ exercicioParaDeletar?.nome_exercicio }}</strong>?</p>
            <p class="confirm-sub">Esta ação não pode ser desfeita.</p>
          </v-card-text>
          <v-card-actions class="px-5 pb-5">
            <v-spacer></v-spacer>
            <v-btn @click="dialogDeletarExercicio = false" variant="flat" class="text-none cancel-btn">Cancelar</v-btn>
            <v-btn @click="deletarExercicio" variant="flat" class="text-none delete-btn" :loading="loadingDeletarExercicio">Deletar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Dialog: Treino Fullscreen -->
      <v-dialog v-model="dialogTreinoFullscreen" fullscreen transition="dialog-bottom-transition">
        <div v-if="treinoAtual" class="fullscreen-bg">
          <div :class="['fullscreen-header', { 'edit-mode-header': modoEdicaoGeral }]">
            <v-btn icon variant="text" @click="fecharTreinoFullscreen" class="back-btn">
              <v-icon color="white">mdi-arrow-left</v-icon>
            </v-btn>
            <div>
              <h2 class="fullscreen-title">{{ treinoAtual.nome }}</h2>
              <p class="fullscreen-sub" v-if="treinoAtual.nivel">{{ treinoAtual.nivel }}</p>
            </div>
          </div>

          <div class="fullscreen-content">
            <v-btn
              v-if="!modoEdicaoGeral"
              @click="abrirDialogExercicio"
              size="large"
              block
              elevation="0"
              class="text-none create-btn mb-5"
              prepend-icon="mdi-plus-circle-outline"
            >
              Adicionar Exercício
            </v-btn>

            <transition-group name="exercicio-slide" tag="div" v-if="exerciciosVisiveis.length > 0">
              <div
                v-for="(exercicio, index) in exerciciosVisiveis"
                :key="exercicio.id_exercicio_treino"
                :class="['exercicio-card', 'mb-3', { 'done': isExercicioConcluido(exercicio.id_exercicio_treino) }]"
              >
                <div class="exercicio-inner">
                  <v-checkbox
                    v-if="!modoEdicaoGeral"
                    :model-value="isExercicioConcluido(exercicio.id_exercicio_treino)"
                    @update:model-value="toggleExercicioConcluido(exercicio.id_exercicio_treino)"
                    color="#00dc82"
                    hide-details
                    class="ex-check"
                  ></v-checkbox>

                  <div :class="['ex-number', { 'edit-mode': modoEdicaoGeral }]">
                    <span :class="['ex-num-text', { 'edit-mode': modoEdicaoGeral }]">{{ index + 1 }}</span>
                  </div>

                  <div class="ex-info">
                    <h4 :class="['ex-name', { 'done': isExercicioConcluido(exercicio.id_exercicio_treino), 'edit-mode': modoEdicaoGeral }]">
                      {{ exercicio.nome_exercicio }}
                    </h4>
                    <div class="ex-stats">
                      <div class="ex-stat-chip">
                        <v-icon icon="mdi-format-list-numbered" size="13" :class="['ex-chip-icon', { 'edit-mode': modoEdicaoGeral }]"></v-icon>
                        <span>{{ exercicio.series }} séries</span>
                      </div>
                      <div class="ex-stat-chip">
                        <v-icon icon="mdi-reload" size="13" :class="['ex-chip-icon', { 'edit-mode': modoEdicaoGeral }]"></v-icon>
                        <span>{{ exercicio.repeticoes }} reps</span>
                      </div>
                      <div v-if="exercicio.carga" class="ex-stat-chip carga-chip">
                        <v-icon icon="mdi-weight-kilogram" size="13" class="mr-1" color="#f59e0b"></v-icon>
                        <span style="color: #f59e0b">{{ exercicio.carga }}</span>
                      </div>
                    </div>
                  </div>

                  <div v-if="modoEdicaoGeral" class="ex-actions">
                    <v-btn icon size="small" variant="text" @click="editarExercicio(exercicio)">
                      <v-icon color="#00dc82" size="18">mdi-pencil</v-icon>
                    </v-btn>
                    <v-btn icon size="small" variant="text" @click="confirmarDeletarExercicio(exercicio)">
                      <v-icon color="#ef4444" size="18">mdi-delete-outline</v-icon>
                    </v-btn>
                  </div>
                </div>
              </div>
            </transition-group>

            <div v-else class="empty-ex-state">
              <div class="empty-icon-wrap">
                <v-icon icon="mdi-dumbbell" size="44" color="#00dc82"></v-icon>
              </div>
              <h3 class="empty-title">Nenhum exercício ainda</h3>
              <p class="empty-sub">Adicione exercícios ao seu treino</p>
            </div>
          </div>
        </div>
      </v-dialog>

      <!-- Dialog: Criar/Editar Exercício -->
      <v-dialog v-model="dialogExercicio" persistent width="500">
        <v-card class="dark-dialog">
          <div :class="['dialog-header', { 'edit-header': modoEdicaoExercicio }]">
            <v-icon class="mr-2" size="20">{{ modoEdicaoExercicio ? 'mdi-pencil' : 'mdi-plus-circle-outline' }}</v-icon>
            <span>{{ modoEdicaoExercicio ? 'Editar Exercício' : 'Adicionar Exercício' }}</span>
            <v-spacer />
            <v-btn icon variant="text" size="small" @click="fecharDialogExercicio">
              <v-icon size="20">mdi-close</v-icon>
            </v-btn>
          </div>
          <v-card-text class="pt-5 pb-2">
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="formExercicio.nome_exercicio"
                  density="comfortable"
                  variant="outlined"
                  label="Nome do exercício"
                  clearable
                  hide-details
                  :color="modoEdicaoExercicio ? '#ef4444' : '#00dc82'"
                  placeholder="Ex: Flexão de braço"
                  class="dark-field"
                />
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="formExercicio.series"
                  density="comfortable"
                  variant="outlined"
                  label="Séries"
                  clearable
                  hide-details
                  :color="modoEdicaoExercicio ? '#ef4444' : '#00dc82'"
                  placeholder="Ex: 3"
                  class="dark-field"
                />
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="formExercicio.repeticoes"
                  density="comfortable"
                  variant="outlined"
                  label="Repetições"
                  clearable
                  hide-details
                  :color="modoEdicaoExercicio ? '#ef4444' : '#00dc82'"
                  placeholder="Ex: 10-12"
                  class="dark-field"
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="formExercicio.carga"
                  density="comfortable"
                  variant="outlined"
                  label="Carga (opcional)"
                  clearable
                  hide-details
                  :color="modoEdicaoExercicio ? '#ef4444' : '#00dc82'"
                  placeholder="Ex: 20kg"
                  prepend-inner-icon="mdi-weight-kilogram"
                  class="dark-field"
                />
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions class="px-5 pb-5">
            <v-spacer></v-spacer>
            <v-btn @click="fecharDialogExercicio" variant="flat" class="text-none cancel-btn">Cancelar</v-btn>
            <v-btn
              @click="salvarExercicio"
              variant="flat"
              :class="['text-none', 'confirm-btn', { 'edit-confirm': modoEdicaoExercicio }]"
              :loading="loadingSalvarExercicio"
            >
              {{ modoEdicaoExercicio ? 'Salvar' : 'Adicionar' }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-snackbar v-model="snackbar" :color="snackbarColor" :timeout="3000" location="top" rounded="lg">
        {{ snackbarText }}
      </v-snackbar>
    </v-container>
  </v-container>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import api from "@/plugins/axios";

const dialogTreino = ref(false);
const dialogDeletar = ref(false);
const dialogDeletarExercicio = ref(false);
const dialogTreinoFullscreen = ref(false);
const dialogExercicio = ref(false);
const modoEdicao = ref(false);
const modoEdicaoExercicio = ref(false);
const modoEdicaoGeral = ref(false);
const treinoParaDeletar = ref(null);
const exercicioParaDeletar = ref(null);
const treinoAtual = ref(null);
const exercicioAtual = ref(null);
const tab = ref('exercicios');

const snackbar = ref(false);
const snackbarText = ref('');
const snackbarColor = ref('success');

const loadingSalvarTreino = ref(false);
const loadingDeletarTreino = ref(false);
const loadingSalvarExercicio = ref(false);
const loadingDeletarExercicio = ref(false);
const loadingSalvarDetalhes = ref(false);

const selectStage = [
  { text: 'Iniciante', value: 'Iniciante' },
  { text: 'Intermediário', value: 'Intermediário' },
  { text: 'Avançado', value: 'Avançado' },
];

const icones = [
  { text: 'Peito', value: 'mdi-arm-flex' },
  { text: 'Costas', value: 'mdi-weight-lifter' },
  { text: 'Braços', value: 'mdi-arm-flex-outline' },
  { text: 'Pernas', value: 'mdi-run' },
  { text: 'Abdômen', value: 'mdi-ab-testing' },
  { text: 'Core', value: 'mdi-yoga' },
  { text: 'Full Body', value: 'mdi-human-handsup' },
  { text: 'Cardio', value: 'mdi-heart-pulse' },
];

const formTreino = ref({
  nome: '',
  descricao: '',
  nivel: '',
  icone_mdi: '',
  quantidade_exercicios: 0,
});

const treinos = ref([]);
const exercicios = ref([]);
const loadingTreinos = ref(false);
const exerciciosConcluidos = ref([]);

const formExercicio = ref({
  nome_exercicio: '',
  series: '',
  repeticoes: '',
  carga: '',
});

const exerciciosVisiveis = computed(() => {
  if (modoEdicaoGeral.value) return exercicios.value;
  return exercicios.value.filter(ex => !exerciciosConcluidos.value.includes(ex.id_exercicio_treino));
});

function mostrarToast(mensagem, cor = 'success') {
  snackbarText.value = mensagem;
  snackbarColor.value = cor;
  snackbar.value = true;
}

onMounted(async () => {
  await carregarTreinos();
});

async function carregarTreinos() {
  loadingTreinos.value = true;
  try {
    const response = await api.get('/treinos/buscar-treinos');
    treinos.value = response.data;
  } catch (error) {
    console.error("Erro ao carregar treinos:", error);
    mostrarToast('Erro ao carregar treinos', 'error');
  } finally {
    loadingTreinos.value = false;
  }
}

function abrirDialogCriar() {
  modoEdicao.value = false;
  formTreino.value = { nome: '', descricao: '', nivel: '', icone_mdi: '', quantidade_exercicios: 0 };
  dialogTreino.value = true;
}

function editarTreino(treino) {
  modoEdicao.value = true;
  formTreino.value = { ...treino };
  dialogTreino.value = true;
}

function fecharDialog() {
  dialogTreino.value = false;
  setTimeout(() => {
    modoEdicao.value = false;
    formTreino.value = { nome: '', descricao: '', nivel: '', icone_mdi: '', quantidade_exercicios: 0 };
  }, 300);
}

async function salvarTreino() {
  if (!formTreino.value.nome || !formTreino.value.nivel) return;
  loadingSalvarTreino.value = true;
  try {
    if (modoEdicao.value) {
      await api.put(`/treinos/atualizar/${formTreino.value.id_treino}`, formTreino.value);
      mostrarToast('Treino atualizado com sucesso!', 'success');
    } else {
      await api.post('/treinos/criar-treino', formTreino.value);
      mostrarToast('Treino criado com sucesso!', 'success');
    }
    await carregarTreinos();
    fecharDialog();
  } catch (error) {
    console.error("Erro ao salvar treino:", error);
    mostrarToast('Erro ao salvar treino', 'error');
  } finally {
    loadingSalvarTreino.value = false;
  }
}

function confirmarDeletar(treino) {
  treinoParaDeletar.value = treino;
  dialogDeletar.value = true;
}

async function deletarTreino() {
  if (treinoParaDeletar.value) {
    loadingDeletarTreino.value = true;
    try {
      await api.delete(`/treinos/deletar/${treinoParaDeletar.value.id_treino}`);
      await carregarTreinos();
      mostrarToast('Treino deletado com sucesso!', 'success');
    } catch (error) {
      console.error("Erro ao deletar treino:", error);
      mostrarToast('Erro ao deletar treino', 'error');
    } finally {
      loadingDeletarTreino.value = false;
    }
  }
  dialogDeletar.value = false;
  treinoParaDeletar.value = null;
}

async function abrirTreino(id) {
  try {
    const response = await api.get(`/treinos/${id}`);
    treinoAtual.value = response.data;
    await carregarExercicios(id);
    tab.value = 'exercicios';
    dialogTreinoFullscreen.value = true;
  } catch (error) {
    console.error("Erro ao carregar treino:", error);
    mostrarToast('Erro ao carregar treino', 'error');
  }
}

async function carregarExercicios(id_treino) {
  try {
    const response = await api.get(`/exercicios-treino/treino/${id_treino}`);
    exercicios.value = response.data;
  } catch (error) {
    console.error("Erro ao carregar exercícios:", error);
  }
}

function toggleExercicioConcluido(idExercicio) {
  const index = exerciciosConcluidos.value.indexOf(idExercicio);
  if (index > -1) {
    exerciciosConcluidos.value.splice(index, 1);
  } else {
    exerciciosConcluidos.value.push(idExercicio);
  }
}

function isExercicioConcluido(idExercicio) {
  return exerciciosConcluidos.value.includes(idExercicio);
}

function fecharTreinoFullscreen() {
  dialogTreinoFullscreen.value = false;
  setTimeout(() => {
    treinoAtual.value = null;
    exercicios.value = [];
    exerciciosConcluidos.value = [];
    tab.value = 'exercicios';
  }, 300);
}

async function salvarDetalhes() {
  if (!treinoAtual.value.nome || !treinoAtual.value.nivel) return;
  loadingSalvarDetalhes.value = true;
  try {
    await api.put(`/treinos/atualizar/${treinoAtual.value.id_treino}`, treinoAtual.value);
    await carregarTreinos();
    const response = await api.get(`/treinos/${treinoAtual.value.id_treino}`);
    treinoAtual.value = response.data;
    mostrarToast('Treino atualizado com sucesso!', 'success');
  } catch (error) {
    console.error("Erro ao salvar treino:", error);
    mostrarToast('Erro ao salvar treino', 'error');
  } finally {
    loadingSalvarDetalhes.value = false;
  }
}

function abrirDialogExercicio() {
  modoEdicaoExercicio.value = false;
  formExercicio.value = { nome_exercicio: '', series: '', repeticoes: '', carga: '' };
  dialogExercicio.value = true;
}

function editarExercicio(exercicio) {
  modoEdicaoExercicio.value = true;
  exercicioAtual.value = exercicio;
  formExercicio.value = { ...exercicio };
  dialogExercicio.value = true;
}

function fecharDialogExercicio() {
  dialogExercicio.value = false;
  setTimeout(() => {
    modoEdicaoExercicio.value = false;
    exercicioAtual.value = null;
    formExercicio.value = { nome_exercicio: '', series: '', repeticoes: '', carga: '' };
  }, 300);
}

async function salvarExercicio() {
  if (!formExercicio.value.nome_exercicio || !formExercicio.value.series || !formExercicio.value.repeticoes) {
    mostrarToast('Preencha todos os campos obrigatórios', 'warning');
    return;
  }
  loadingSalvarExercicio.value = true;
  try {
    if (modoEdicaoExercicio.value) {
      await api.patch(`/exercicios-treino/atualizar/${exercicioAtual.value.id_exercicio_treino}`, {
        nome_exercicio: formExercicio.value.nome_exercicio,
        series: formExercicio.value.series,
        repeticoes: formExercicio.value.repeticoes,
        carga: formExercicio.value.carga || null,
      });
      mostrarToast('Exercício atualizado com sucesso!', 'success');
    } else {
      await api.post('/exercicios-treino/criar', {
        ...formExercicio.value,
        id_treino: treinoAtual.value.id_treino,
      });
      mostrarToast('Exercício adicionado com sucesso!', 'success');
    }
    await carregarExercicios(treinoAtual.value.id_treino);
    fecharDialogExercicio();
  } catch (error) {
    console.error("Erro ao salvar exercício:", error);
    mostrarToast('Erro ao salvar exercício', 'error');
  } finally {
    loadingSalvarExercicio.value = false;
  }
}

function confirmarDeletarExercicio(exercicio) {
  exercicioParaDeletar.value = exercicio;
  dialogDeletarExercicio.value = true;
}

async function deletarExercicio() {
  if (exercicioParaDeletar.value) {
    loadingDeletarExercicio.value = true;
    try {
      await api.delete(`/exercicios-treino/deletar/${exercicioParaDeletar.value.id_exercicio_treino}`);
      await carregarExercicios(treinoAtual.value.id_treino);
      mostrarToast('Exercício deletado com sucesso!', 'success');
    } catch (error) {
      console.error("Erro ao deletar exercício:", error);
      mostrarToast('Erro ao deletar exercício', 'error');
    } finally {
      loadingDeletarExercicio.value = false;
    }
  }
  dialogDeletarExercicio.value = false;
  exercicioParaDeletar.value = null;
}
</script>

<style scoped>
/* ── Base ── */
.app-bg {
  background-color: #020420;
}

/* ── Header ── */
.header-section {
  background: linear-gradient(135deg, #0a3d2e 0%, #052e1d 60%, #020420 100%);
  padding: 28px 16px 36px 16px;
  border-bottom: 1px solid rgba(0, 220, 130, 0.12);
  transition: background 0.5s ease;
  position: relative;
}

.header-section::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, #00dc82, transparent);
  opacity: 0.3;
}

.header-section.edit-mode-header {
  background: linear-gradient(135deg, #b91c1c 0%, #dc2626 60%, #7f1d1d 100%);
}

.header-section.edit-mode-header::after {
  background: linear-gradient(90deg, transparent, #ef4444, transparent);
}

.logo-icon {
  background: rgba(0, 220, 130, 0.1);
  border: 1px solid rgba(0, 220, 130, 0.25);
  border-radius: 10px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.4s ease, border-color 0.4s ease;
}

.logo-icon.edit-mode {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.4);
}

.app-title {
  font-size: 1.4rem;
  font-weight: 800;
  color: white;
  letter-spacing: -0.5px;
  line-height: 1.2;
}

.app-subtitle {
  font-size: 0.72rem;
  color: rgba(0, 220, 130, 0.7);
  margin: 0;
  line-height: 1;
  transition: color 0.4s ease;
}

.app-subtitle.edit-mode {
  color: rgba(255, 255, 255, 0.75);
}

.header-btn {
  color: rgba(255, 255, 255, 0.6) !important;
  transition: color 0.3s ease;
}

.header-btn:hover {
  color: #00dc82 !important;
}

.header-btn.edit-active {
  color: #ef4444 !important;
}

/* ── Create button ── */
.create-btn {
  background: linear-gradient(135deg, #00dc82, #00b368) !important;
  color: white !important;
  font-weight: 700;
  border-radius: 14px;
  height: 54px !important;
  font-size: 1rem;
  letter-spacing: 0;
  box-shadow: 0 4px 24px rgba(0, 220, 130, 0.25);
  transition: box-shadow 0.2s ease, transform 0.15s ease;
}

.create-btn:active {
  transform: scale(0.98);
}

/* ── Edit mode banner ── */
.edit-mode-banner {
  display: flex;
  align-items: center;
  padding: 14px 18px;
  background: rgba(239, 68, 68, 0.12);
  border: 1px solid rgba(239, 68, 68, 0.55);
  border-radius: 14px;
}

.edit-mode-title {
  font-size: 0.9rem;
  font-weight: 700;
  color: #ef4444;
  margin: 0;
}

.edit-mode-sub {
  font-size: 0.75rem;
  color: rgba(239, 68, 68, 0.6);
  margin: 0;
}

/* ── Loading ── */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
}

.loading-spinner {
  width: 48px;
  height: 48px;
  border: 3px solid rgba(0, 220, 130, 0.15);
  border-top-color: #00dc82;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-text {
  color: #64748b;
  margin-top: 16px;
  font-size: 0.9rem;
}

/* ── Workout card ── */
.workout-card {
  background: #0f172a;
  border: 1px solid rgba(0, 220, 130, 0.15);
  border-radius: 18px;
  cursor: pointer;
  transition: border-color 0.25s ease, box-shadow 0.25s ease;
  overflow: hidden;
}

.workout-card:active {
  transform: scale(0.99);
}

.workout-card.edit-mode {
  cursor: default;
  border-color: rgba(239, 68, 68, 0.7);
  box-shadow: 0 0 0 1px rgba(239, 68, 68, 0.2);
}

.workout-card:not(.edit-mode):hover {
  border-color: rgba(0, 220, 130, 0.35);
  box-shadow: 0 0 0 1px rgba(0, 220, 130, 0.1), 0 4px 20px rgba(0, 0, 0, 0.3);
}

.workout-card-inner {
  display: flex;
  align-items: center;
  padding: 16px;
  gap: 14px;
}

.workout-icon-wrap {
  background: rgba(0, 220, 130, 0.08);
  border: 1px solid rgba(0, 220, 130, 0.15);
  border-radius: 14px;
  padding: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 56px;
  height: 56px;
  flex-shrink: 0;
  transition: background 0.3s ease, border-color 0.3s ease;
}

.workout-icon-wrap.edit-mode {
  background: rgba(239, 68, 68, 0.12);
  border-color: rgba(239, 68, 68, 0.6);
}

.icon-color {
  color: #00dc82 !important;
  transition: color 0.3s ease;
}

.icon-color.edit-mode {
  color: #ef4444 !important;
}

.workout-info {
  flex: 1;
  min-width: 0;
}

.workout-name {
  font-size: 1rem;
  font-weight: 700;
  color: #e2e8f0;
  margin: 0 0 4px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: color 0.3s ease;
}

.workout-name.edit-mode {
  color: #fca5a5;
}

.workout-desc {
  font-size: 0.78rem;
  color: #475569;
  margin: 0 0 10px 0;
  line-height: 1.4;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.workout-meta {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.meta-badge {
  display: flex;
  align-items: center;
  gap: 4px;
}

.meta-icon {
  color: #00dc82 !important;
  transition: color 0.3s ease;
}

.meta-icon.edit-mode {
  color: #ef4444 !important;
}

.meta-value {
  font-size: 0.82rem;
  font-weight: 700;
  color: #00dc82;
  transition: color 0.3s ease;
}

.meta-value.edit-mode {
  color: #ef4444;
}

.meta-label {
  font-size: 0.75rem;
  color: #475569;
}

.nivel-text {
  font-size: 0.78rem;
  font-weight: 600;
  color: #f97316;
}

.chevron-icon {
  flex-shrink: 0;
}

.menu-wrap {
  flex-shrink: 0;
}

/* ── Empty state ── */
.empty-state {
  text-align: center;
  padding: 80px 20px;
}

.empty-icon-wrap {
  background: rgba(0, 220, 130, 0.08);
  border: 1px solid rgba(0, 220, 130, 0.15);
  border-radius: 50%;
  width: 88px;
  height: 88px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
}

.empty-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: #e2e8f0;
  margin: 0 0 8px 0;
}

.empty-sub {
  font-size: 0.85rem;
  color: #475569;
  margin: 0;
}

/* ── Dark dialogs ── */
.dark-dialog {
  background: #0f172a !important;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 20px !important;
  overflow: hidden;
}

.dialog-header {
  background: linear-gradient(135deg, #00dc82, #00b368);
  color: white;
  font-weight: 700;
  font-size: 0.95rem;
  padding: 14px 16px;
  display: flex;
  align-items: center;
}

.dialog-header.edit-header {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
}

.dark-field :deep(.v-field) {
  background: #1e293b !important;
  color: #e2e8f0 !important;
}

.dark-field :deep(.v-label) {
  color: #64748b !important;
}

.dark-field :deep(.v-field__input) {
  color: #e2e8f0 !important;
}

.cancel-btn {
  background: #ef4444 !important;
  color: white !important;
  font-weight: 700;
  border-radius: 10px;
  padding: 0 20px;
}

.confirm-btn {
  background: linear-gradient(135deg, #00dc82, #00b368) !important;
  color: white !important;
  font-weight: 700;
  border-radius: 10px;
  padding: 0 20px;
}

.confirm-btn.edit-confirm {
  background: linear-gradient(135deg, #00dc82, #00b368) !important;
}

.delete-btn {
  background: #ef4444 !important;
  color: white !important;
  font-weight: 700;
  border-radius: 10px;
  padding: 0 20px;
}

.confirm-text {
  color: #94a3b8;
  font-size: 0.95rem;
  margin: 0 0 8px 0;
}

.confirm-sub {
  color: #475569;
  font-size: 0.82rem;
  margin: 0;
}

/* ── Dark menu ── */
.dark-menu {
  background: #1e293b !important;
  border: 1px solid rgba(255, 255, 255, 0.08) !important;
  border-radius: 12px !important;
}

.menu-item-text {
  color: #e2e8f0;
  font-size: 0.88rem;
}

/* ── Fullscreen ── */
.fullscreen-bg {
  background: #020420;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.fullscreen-header {
  background: linear-gradient(135deg, #0a3d2e 0%, #052e1d 100%);
  padding: 20px 16px 24px;
  display: flex;
  align-items: center;
  gap: 12px;
  border-bottom: 1px solid rgba(0, 220, 130, 0.12);
  transition: background 0.4s ease;
}

.fullscreen-header.edit-mode-header {
  background: linear-gradient(135deg, #b91c1c 0%, #dc2626 100%);
  border-bottom-color: rgba(239, 68, 68, 0.5);
}

.back-btn {
  color: rgba(255, 255, 255, 0.7) !important;
}

.fullscreen-title {
  font-size: 1.15rem;
  font-weight: 800;
  color: white;
  margin: 0;
}

.fullscreen-sub {
  font-size: 0.75rem;
  color: rgba(0, 220, 130, 0.7);
  margin: 2px 0 0 0;
}

.fullscreen-content {
  padding: 20px 16px;
  flex: 1;
}

/* ── Exercise card ── */
.exercicio-card {
  background: #0f172a;
  border: 1px solid rgba(0, 220, 130, 0.12);
  border-radius: 14px;
  overflow: hidden;
  transition: border-color 0.3s ease, opacity 0.3s ease;
}

.exercicio-card.done {
  opacity: 0.4;
  border-color: rgba(0, 220, 130, 0.05);
}

.exercicio-inner {
  display: flex;
  align-items: center;
  padding: 14px;
  gap: 10px;
}

.ex-check {
  flex-shrink: 0;
  margin: 0 !important;
  padding: 0 !important;
}

.ex-number {
  background: rgba(0, 220, 130, 0.08);
  border: 1px solid rgba(0, 220, 130, 0.15);
  border-radius: 8px;
  min-width: 34px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: background 0.3s ease, border-color 0.3s ease;
}

.ex-number.edit-mode {
  background: rgba(239, 68, 68, 0.08);
  border-color: rgba(239, 68, 68, 0.2);
}

.ex-num-text {
  font-size: 0.85rem;
  font-weight: 700;
  color: #00dc82;
  transition: color 0.3s ease;
}

.ex-num-text.edit-mode {
  color: #ef4444;
}

.ex-info {
  flex: 1;
  min-width: 0;
}

.ex-name {
  font-size: 0.95rem;
  font-weight: 700;
  color: #e2e8f0;
  margin: 0 0 6px 0;
  transition: color 0.3s ease;
}

.ex-name.done {
  text-decoration: line-through;
  color: #475569;
}

.ex-name.edit-mode {
  color: #fca5a5;
}

.ex-stats {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.ex-stat-chip {
  display: flex;
  align-items: center;
  gap: 4px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 6px;
  padding: 3px 8px;
  font-size: 0.75rem;
  color: #64748b;
  font-weight: 600;
}

.carga-chip {
  border-color: rgba(245, 158, 11, 0.2);
  background: rgba(245, 158, 11, 0.05);
}

.ex-chip-icon {
  color: #00dc82 !important;
  transition: color 0.3s ease;
}

.ex-chip-icon.edit-mode {
  color: #ef4444 !important;
}

.ex-actions {
  display: flex;
  gap: 2px;
  flex-shrink: 0;
}

.empty-ex-state {
  text-align: center;
  padding: 80px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

/* ── Transitions ── */
.treino-list-move,
.treino-list-enter-active,
.treino-list-leave-active {
  transition: all 0.4s ease;
}

.treino-list-enter-from {
  opacity: 0;
  transform: translateY(-16px);
}

.treino-list-leave-to {
  opacity: 0;
  transform: translateX(-100%);
}

.treino-list-leave-active {
  position: absolute;
  width: calc(100% - 32px);
}

.exercicio-slide-move,
.exercicio-slide-enter-active,
.exercicio-slide-leave-active {
  transition: all 0.4s ease;
}

.exercicio-slide-enter-from {
  opacity: 0;
  transform: translateX(-24px);
}

.exercicio-slide-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.exercicio-slide-leave-active {
  position: absolute;
  width: calc(100% - 32px);
}

/* ── Responsive ── */
@media (max-width: 600px) {
  .header-section {
    padding: 22px 14px 30px;
  }
}
</style>
