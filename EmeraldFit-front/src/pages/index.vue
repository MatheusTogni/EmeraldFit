<template>
  <v-container fluid class="pa-0" style="background-color: white; min-height: 100vh">
    <div class="header-section">
      <div class="d-flex align-center">
        <v-icon icon="mdi-diamond-stone" size="30" color="white" class="mr-2"></v-icon>
        <h1 class="text-h4 font-weight-bold" style="color: white">Emerald Fit</h1>
      </div>
    </div>

    <v-container class="px-4 pb-6">
      <v-btn
        @click="abrirDialogCriar"
        color="#10b981"
        size="x-large"
        block
        elevation="0"
        class="text-none mb-6 create-btn"
        prepend-icon="mdi-plus-circle"
      >
        Criar Treino
      </v-btn>

      <transition-group name="treino-list" tag="div" v-if="treinos.length > 0" class="treinos-list">
        <v-card
          v-for="treino in treinos"
          :key="treino.id"
          elevation="0"
          class="workout-card mb-4"
        >
          <v-card-text class="pa-5">
            <div class="d-flex align-start mb-4">
              <div class="workout-icon-container mr-4" @click="abrirTreino(treino.id_treino)">
                <v-icon :icon="treino.icone_mdi" size="40" color="#10b981"></v-icon>
              </div>

              <div class="flex-grow-1" @click="abrirTreino(treino.id_treino)">
                <div class="d-flex justify-space-between align-center mb-2">
                  <h3 class="text-h6 font-weight-bold" style="color: #047857">
                    {{ treino.nome }}
                  </h3>
                </div>

                <p class="text-body-2 mb-3" style="color: #64748b; line-height: 1.5">
                  {{ treino.descricao }}
                </p>

                <div class="d-flex align-center gap-4">
                  <div class="stat-item">
                    <v-icon
                      icon="mdi-dumbbell"
                      size="18"
                      color="#10b981"
                      class="mr-1"
                    ></v-icon>
                    <span class="text-body-2 font-weight-bold" style="color: #047857">{{
                      treino.quantidade_exercicios
                    }}</span>
                    <span class="text-caption" style="color: #94a3b8; margin-left: 4px"
                      >exercícios</span
                    >
                  </div>

                  <div class="stat-item">
                    <v-icon
                      icon="mdi-fire"
                      size="18"
                      color="#f97316"
                      class="mr-1"
                    ></v-icon>
                    <span class="text-body-2 font-weight-bold" style="color: #047857">{{
                      treino.nivel
                    }}</span>
                  </div>
                </div>
              </div>

              <div class="menu-container">
                <v-menu location="bottom end">
                  <template v-slot:activator="{ props }">
                    <v-btn
                      icon
                      v-bind="props"
                      variant="text"
                      size="small"
                      class="menu-btn"
                      @click.stop
                    >
                      <v-icon color="#64748b">mdi-dots-vertical</v-icon>
                    </v-btn>
                  </template>
                  <v-list density="compact" class="menu-list">
                    <v-list-item @click="editarTreino(treino)" class="menu-item">
                      <template v-slot:prepend>
                        <v-icon color="#10b981" size="20">mdi-pencil</v-icon>
                      </template>
                      <v-list-item-title class="text-body-2">Editar</v-list-item-title>
                    </v-list-item>
                    <v-divider></v-divider>
                    <v-list-item @click="confirmarDeletar(treino)" class="menu-item">
                      <template v-slot:prepend>
                        <v-icon color="#ef4444" size="20">mdi-delete</v-icon>
                      </template>
                      <v-list-item-title class="text-body-2" style="color: #ef4444">Deletar</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </transition-group>

      <div v-else class="empty-state">
        <v-icon icon="mdi-weight-lifter" size="100" color="#10b981" class="mb-6"></v-icon>
        <h3 class="text-h6 font-weight-bold mb-3" style="color: #047857">
          Nenhum treino criado ainda
        </h3>
        <p class="text-body-1 mb-6" style="color: #64748b">
          Comece sua jornada criando seu primeiro treino de calistenia
        </p>
      </div>

      <v-dialog persistent width="600" v-model="dialogTreino">
        <v-card color="white" class="dialog-card">
          <v-card-title style="background-color: #10b981; color: white; align-items: center; display: flex">
            <v-icon class="mr-2">{{ modoEdicao ? 'mdi-pencil' : 'mdi-plus-circle' }}</v-icon>
            {{ modoEdicao ? 'Editar Treino' : 'Criar Treino' }}
            <v-spacer/>
            <v-icon @click="fecharDialog">mdi-close</v-icon>
          </v-card-title>
          <v-card-text class="pt-6">
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="formTreino.nome"
                  density="comfortable"
                  variant="outlined"
                  label="Título do treino"
                  clearable
                  hide-details
                  :rules="[v => !!v || 'Título é obrigatório']"
                  color="#10b981"
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
                  color="#10b981"
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
                  :rules="[v => !!v || 'Nível é obrigatório']"
                  color="#10b981"
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
                  color="#10b981"
                >
                  <template v-slot:selection="{ item }">
                    <v-icon :icon="item.value" size="20" color="#10b981" class="mr-2"></v-icon>
                    {{ item.title }}
                  </template>
                  <template v-slot:item="{ props, item }">
                    <v-list-item v-bind="props">
                      <template v-slot:prepend>
                        <v-icon :icon="item.value" color="#10b981"></v-icon>
                      </template>
                    </v-list-item>
                  </template>
                </v-select>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions class="px-6 pb-6">
            <v-spacer></v-spacer>
            <v-btn
              @click="fecharDialog"
              variant="flat"
              color="red"
              class="text-none"
              style="color: #64748b"
            >
              Cancelar
            </v-btn>
            <v-btn
              @click="salvarTreino"
              variant="flat"
              color="#10b981"
              class="text-none"
              style="color: white"
              :disabled="!formTreino.nome || !formTreino.nivel"
              :loading="loadingSalvarTreino"
            >
              {{ modoEdicao ? 'Salvar' : 'Criar' }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="dialogDeletar" max-width="400">
        <v-card class="dialog-card">
          <v-card-title class="text-h6 d-flex align-center" style="color: #ef4444">
            <v-icon color="#ef4444" class="mr-2">mdi-alert-circle</v-icon>
            Confirmar Exclusão
          </v-card-title>
          <v-card-text class="pt-4">
            <p class="text-body-1">Tem certeza que deseja deletar o treino <strong>{{ treinoParaDeletar?.nome }}</strong>?</p>
            <p class="text-body-2 mt-2" style="color: #64748b">Esta ação não pode ser desfeita.</p>
          </v-card-text>
          <v-card-actions class="px-6 pb-4">
            <v-spacer></v-spacer>
            <v-btn
              @click="dialogDeletar = false"
              variant="flat"
              color="#e2e8f0"
              class="text-none"
              style="color: #64748b"
            >
              Cancelar
            </v-btn>
            <v-btn
              @click="deletarTreino"
              variant="flat"
              color="#ef4444"
              class="text-none"
              style="color: white"
              :loading="loadingDeletarTreino"
            >
              Deletar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="dialogDeletarExercicio" max-width="400">
        <v-card class="dialog-card">
          <v-card-title class="text-h6 d-flex align-center" style="color: #ef4444">
            <v-icon color="#ef4444" class="mr-2">mdi-alert-circle</v-icon>
            Confirmar Exclusão
          </v-card-title>
          <v-card-text class="pt-4">
            <p class="text-body-1">Tem certeza que deseja deletar o exercício <strong>{{ exercicioParaDeletar?.nome_exercicio }}</strong>?</p>
            <p class="text-body-2 mt-2" style="color: #64748b">Esta ação não pode ser desfeita.</p>
          </v-card-text>
          <v-card-actions class="px-6 pb-4">
            <v-spacer></v-spacer>
            <v-btn
              @click="dialogDeletarExercicio = false"
              variant="flat"
              color="#e2e8f0"
              class="text-none"
              style="color: #64748b"
            >
              Cancelar
            </v-btn>
            <v-btn
              @click="deletarExercicio"
              variant="flat"
              color="#ef4444"
              class="text-none"
              style="color: white"
              :loading="loadingDeletarExercicio"
            >
              Deletar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="dialogTreinoFullscreen" fullscreen transition="dialog-bottom-transition">
        <v-card v-if="treinoAtual" color="white">
          <v-toolbar color="#10b981" style="color: white">
            <v-btn icon @click="fecharTreinoFullscreen">
              <v-icon color="white">mdi-close</v-icon>
            </v-btn>
            <v-toolbar-title>{{ treinoAtual.nome }}</v-toolbar-title>
          </v-toolbar>

          <v-tabs v-model="tab" color="#10b981" bg-color="white">
            <v-tab value="exercicios">
              <v-icon class="mr-2">mdi-dumbbell</v-icon>
              Exercícios
            </v-tab>
            <v-tab value="detalhes">
              <v-icon class="mr-2">mdi-cog</v-icon>
              Detalhes
            </v-tab>
          </v-tabs>

          <v-window v-model="tab">
            <v-window-item value="exercicios">
              <v-container class="pa-4">
                <v-btn
                  @click="abrirDialogExercicio"
                  color="#10b981"
                  size="large"
                  block
                  class="text-none mb-4"
                  prepend-icon="mdi-plus-circle"
                >
                  Adicionar Exercício
                </v-btn>

                <div v-if="exercicios.length > 0">
                  <v-card
                    v-for="(exercicio, index) in exercicios"
                    :key="exercicio.id_exercicio_treino"
                    elevation="2"
                    class="mb-3"
                    color="white"
                  >
                    <v-card-text class="pa-4">
                      <div class="d-flex align-start">
                        <div class="exercicio-number mr-3">
                          <span class="text-h6 font-weight-bold" style="color: #10b981">{{ index + 1 }}</span>
                        </div>
                        <div class="flex-grow-1">
                          <h4 class="text-subtitle-1 font-weight-bold mb-2" style="color: #047857">
                            {{ exercicio.nome_exercicio }}
                          </h4>
                          <div class="d-flex gap-4">
                            <div class="d-flex align-center">
                              <v-icon icon="mdi-format-list-numbered" size="18" color="#10b981" class="mr-1"></v-icon>
                              <span class="text-body-2" style="color: #64748b">
                                <strong>{{ exercicio.series }}</strong> séries
                              </span>
                            </div>
                            <div class="d-flex align-center">
                              <v-icon icon="mdi-reload" size="18" color="#10b981" class="mr-1"></v-icon>
                              <span class="text-body-2" style="color: #64748b">
                                <strong>{{ exercicio.repeticoes }}</strong> reps
                              </span>
                            </div>
                          </div>
                        </div>
                        <div class="d-flex gap-1">
                          <v-btn
                            icon
                            size="small"
                            variant="text"
                            @click="editarExercicio(exercicio)"
                          >
                            <v-icon color="#10b981">mdi-pencil</v-icon>
                          </v-btn>
                          <v-btn
                            icon
                            size="small"
                            variant="text"
                            @click="confirmarDeletarExercicio(exercicio)"
                          >
                            <v-icon color="#ef4444">mdi-delete</v-icon>
                          </v-btn>
                        </div>
                      </div>
                    </v-card-text>
                  </v-card>
                </div>

                <div v-else class="empty-state-exercicios">
                  <v-icon icon="mdi-dumbbell" size="80" color="#10b981" class="mb-4"></v-icon>
                  <h3 class="text-h6 font-weight-bold mb-3" style="color: #047857">
                    Nenhum exercício adicionado
                  </h3>
                  <p class="text-body-2 mb-6" style="color: #64748b">
                    Adicione exercícios ao seu treino para começar
                  </p>
                </div>
              </v-container>
            </v-window-item>

            <v-window-item value="detalhes">
              <v-container class="pa-4">
                <v-card elevation="0" class="pa-4" color="white">
                  <v-row>
                    <v-col cols="12">
                      <v-text-field
                        v-model="treinoAtual.nome"
                        density="comfortable"
                        variant="outlined"
                        label="Título do treino"
                        clearable
                        hide-details
                        color="#10b981"
                      />
                    </v-col>
                    <v-col cols="12">
                      <v-textarea
                        v-model="treinoAtual.descricao"
                        density="comfortable"
                        variant="outlined"
                        label="Descrição do treino"
                        clearable
                        hide-details
                        rows="3"
                        color="#10b981"
                      />
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-select
                        v-model="treinoAtual.nivel"
                        density="comfortable"
                        variant="outlined"
                        label="Nível do treino"
                        clearable
                        hide-details
                        item-value="value"
                        item-title="text"
                        :items="selectStage"
                        color="#10b981"
                      />
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-select
                        v-model="treinoAtual.icone_mdi"
                        density="comfortable"
                        variant="outlined"
                        label="Ícone"
                        clearable
                        hide-details
                        item-value="value"
                        item-title="text"
                        :items="icones"
                        color="#10b981"
                      >
                        <template v-slot:selection="{ item }">
                          <v-icon :icon="item.value" size="20" color="#10b981" class="mr-2"></v-icon>
                          {{ item.title }}
                        </template>
                        <template v-slot:item="{ props, item }">
                          <v-list-item v-bind="props">
                            <template v-slot:prepend>
                              <v-icon :icon="item.value" color="#10b981"></v-icon>
                            </template>
                          </v-list-item>
                        </template>
                      </v-select>
                    </v-col>
                    <v-col cols="12">
                      <v-btn
                        @click="salvarDetalhes"
                        block
                        color="#10b981"
                        size="large"
                        class="text-none"
                        :disabled="!treinoAtual.nome || !treinoAtual.nivel"
                        :loading="loadingSalvarDetalhes"
                      >
                        Salvar Alterações
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-card>
              </v-container>
            </v-window-item>
          </v-window>
        </v-card>
      </v-dialog>

      <v-dialog v-model="dialogExercicio" persistent width="500">
        <v-card color="white" class="dialog-card">
          <v-card-title style="background-color: #10b981; color: white; align-items: center; display: flex">
            <v-icon class="mr-2">{{ modoEdicaoExercicio ? 'mdi-pencil' : 'mdi-plus-circle' }}</v-icon>
            {{ modoEdicaoExercicio ? 'Editar Exercício' : 'Adicionar Exercício' }}
            <v-spacer/>
            <v-icon @click="fecharDialogExercicio">mdi-close</v-icon>
          </v-card-title>
          <v-card-text class="pt-6">
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="formExercicio.nome_exercicio"
                  density="comfortable"
                  variant="outlined"
                  label="Nome do exercício"
                  clearable
                  hide-details
                  color="#10b981"
                  placeholder="Ex: Flexão de braço"
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
                  color="#10b981"
                  placeholder="Ex: 3"
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
                  color="#10b981"
                  placeholder="Ex: 10-12"
                />
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions class="px-6 pb-6">
            <v-spacer></v-spacer>
            <v-btn
              @click="fecharDialogExercicio"
              variant="flat"
              color="red"
              class="text-none"
              style="color: #64748b"
            >
              Cancelar
            </v-btn>
            <v-btn
              @click="salvarExercicio"
              variant="flat"
              color="#10b981"
              class="text-none"
              style="color: white"
              :loading="loadingSalvarExercicio"
            >
              {{ modoEdicaoExercicio ? 'Salvar' : 'Adicionar' }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-snackbar
        v-model="snackbar"
        :color="snackbarColor"
        :timeout="3000"
        location="top"
      >
        {{ snackbarText }}
      </v-snackbar>
    </v-container>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from "vue";
import api from "@/plugins/axios";

const dialogTreino = ref(false);
const dialogDeletar = ref(false);
const dialogDeletarExercicio = ref(false);
const dialogTreinoFullscreen = ref(false);
const dialogExercicio = ref(false);
const modoEdicao = ref(false);
const modoEdicaoExercicio = ref(false);
const treinoParaDeletar = ref(null);
const exercicioParaDeletar = ref(null);
const treinoAtual = ref(null);
const exercicioAtual = ref(null);
const tab = ref('exercicios');

// Toast/Snackbar
const snackbar = ref(false);
const snackbarText = ref('');
const snackbarColor = ref('success');

// Loading states
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

const formExercicio = ref({
  nome_exercicio: '',
  series: '',
  repeticoes: '',
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
  try {
    const response = await api.get('/treinos/buscar-treinos');
    treinos.value = response.data;
  } catch (error) {
    console.error("Erro ao carregar treinos:", error);
  }
}

function abrirDialogCriar() {
  modoEdicao.value = false;
  formTreino.value = {
    nome: '',
    descricao: '',
    nivel: '',
    icone_mdi: '',
    quantidade_exercicios: 0,
  };
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
    formTreino.value = {
      nome: '',
      descricao: '',
      nivel: '',
      icone_mdi: '',
      quantidade_exercicios: 0,
    };
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

function fecharTreinoFullscreen() {
  dialogTreinoFullscreen.value = false;
  setTimeout(() => {
    treinoAtual.value = null;
    exercicios.value = [];
    tab.value = 'exercicios';
  }, 300);
}

async function salvarDetalhes() {
  if (!treinoAtual.value.nome || !treinoAtual.value.nivel) return;

  loadingSalvarDetalhes.value = true;
  try {
    await api.put(`/treinos/atualizar/${treinoAtual.value.id_treino}`, treinoAtual.value);
    await carregarTreinos();
    // Atualiza os dados do treino atual
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
  formExercicio.value = {
    nome_exercicio: '',
    series: '',
    repeticoes: '',
  };
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
    formExercicio.value = {
      nome_exercicio: '',
      series: '',
      repeticoes: '',
    };
  }, 300);
}

async function salvarExercicio() {
  if (!formExercicio.value.nome_exercicio || !formExercicio.value.series || !formExercicio.value.repeticoes) {
    mostrarToast('Preencha todos os campos', 'warning');
    return;
  }

  loadingSalvarExercicio.value = true;
  try {
    if (modoEdicaoExercicio.value) {
      await api.patch(`/exercicios-treino/atualizar/${exercicioAtual.value.id_exercicio_treino}`, formExercicio.value);
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
.header-section {
  background: linear-gradient(135deg, #10b981 0%, #14b8a6 100%);
  padding: 24px 16px 32px 16px;
  color: white;
}

.create-btn {
  border-radius: 12px;
  font-size: 1.1rem;
  height: 56px !important;
  letter-spacing: 0;
  text-transform: none;
}

.treinos-list {
  margin-top: 0;
}

.workout-card {
  border: 2px solid #28da7e;
  border-radius: 16px;
  transition: all 0.3s ease;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  min-height: 140px;
  position: relative;
}

.workout-card .flex-grow-1,
.workout-card .workout-icon-container {
  cursor: pointer;
}

.workout-card .flex-grow-1:active,
.workout-card .workout-icon-container:active {
  opacity: 0.8;
}

.workout-icon-container {
  background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
  border-radius: 12px;
  padding: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 64px;
  height: 64px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 2px;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  margin-top: 40px;
}

.menu-container {
  position: absolute;
  top: 12px;
  right: 12px;
}

.menu-btn {
  transition: all 0.2s ease;
}

.menu-btn:hover {
  background-color: rgba(100, 116, 139, 0.1);
}

.menu-list {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.menu-item {
  transition: background-color 0.2s ease;
}

.menu-item:hover {
  background-color: rgba(16, 185, 129, 0.05);
}

.dialog-card {
  border-radius: 16px;
  overflow: hidden;
  background-color: white;
  color: #000;
}

/* Animações */
.treino-list-move,
.treino-list-enter-active,
.treino-list-leave-active {
  transition: all 0.4s ease;
}

.treino-list-enter-from {
  opacity: 0;
  transform: translateY(-20px);
}

.treino-list-leave-to {
  opacity: 0;
  transform: translateX(-100%);
}

.treino-list-leave-active {
  position: absolute;
  width: calc(100% - 32px);
}

@media (hover: none) {
  .workout-card:hover {
    transform: none;
  }
}

@media (max-width: 600px) {
  .header-section {
    padding: 20px 16px 28px 16px;
  }

  .create-btn {
    height: 52px !important;
  }
  
  .menu-container {
    position: static;
  }
}

.empty-state-exercicios {
  text-align: center;
  padding: 80px 20px;
  min-height: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.exercicio-number {
  background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
  border-radius: 8px;
  padding: 8px 12px;
  min-width: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
