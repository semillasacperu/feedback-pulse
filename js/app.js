// ==================== DATOS EMBEBIDOS (Ecosistema FeedBack Pulse) ====================
let appData = {
    "estudiantes": [
        {
            "id": 1,
            "nombre": "Karina López",
            "tarea": "Avance de Prototipo MVP",
            "autorreflexion": "¿Cómo garantizamos que la solución sea de costo cero sin requerir licencias de pago?",
            "feedbackDocente": "Excelente estructuración del prototipo. Te sugiero reforzar el criterio de visualización de la rúbrica.",
            "evaluacion": {
                "criterio1": 2,
                "criterio2": 1,
                "criterio3": 2
            }
        },
        {
            "id": 2,
            "nombre": "Djanna De La Cruz",
            "tarea": "Matriz de consistencia",
            "autorreflexion": "Tuve dudas en aislar la necesidad sin caer en la solución disfrazada.",
            "feedbackDocente": "",
            "evaluacion": {
                "criterio1": 0,
                "criterio2": 0,
                "criterio3": 0
            }
        }
    ],
    "rubrica": [
        {
            "id": "criterio1",
            "titulo": "1. Diagnóstico de Necesidad (Problem Statement)",
            "opciones": [
                { "pts": 0, "label": "Insuficiente (0 pts)" },
                { "pts": 1, "label": "En Proceso (1 pt)" },
                { "pts": 2, "label": "Logrado (2 pts)" }
            ]
        },
        {
            "id": "criterio2",
            "titulo": "2. Criterio de Calidad Visible (Rúbrica)",
            "opciones": [
                { "pts": 0, "label": "Insuficiente (0 pts)" },
                { "pts": 1, "label": "En Proceso (1 pt)" },
                { "pts": 2, "label": "Logrado (2 pts)" }
            ]
        },
        {
            "id": "criterio3",
            "titulo": "3. Demostrabilidad del MVP (5 pasos)",
            "opciones": [
                { "pts": 0, "label": "Insuficiente (0 pts)" },
                { "pts": 1, "label": "En Proceso (1 pt)" },
                { "pts": 2, "label": "Logrado (2 pts)" }
            ]
        }
    ],
    "bancoRespuestas": [
        {
            "categoria": "Excelente",
            "texto": "✅ ¡Excelente trabajo! Cumples rigurosamente con los 5 pasos del prototipo demostrable."
        },
        {
            "categoria": "Refuerzo",
            "texto": "⚠️ Buen avance. Recuerda no incluir una solución disfrazada en la Problem Card."
        },
        {
            "categoria": "Autorreflexión",
            "texto": "💭 Revisa la pregunta de autorreflexión para alinear tu propuesta a la guía metodológica."
        }
    ]
};

let currentStudentId = 1;

// Inicialización automática al cargar el DOM
document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

function initApp() {
    setupNavigation();
    renderStudentList();
    renderRubric();
    renderFeedbackBank();
    loadStudentData(currentStudentId);
    setupEventListeners();
}

// 1. Navegación entre Vistas (Docente / Estudiante)
function setupNavigation() {
    const btnDocente = document.getElementById('btn-docente-view');
    const btnEstudiante = document.getElementById('btn-estudiante-view');
    const viewDocente = document.getElementById('view-docente');
    const viewEstudiante = document.getElementById('view-estudiante');

    if (!btnDocente || !btnEstudiante) return;

    btnDocente.addEventListener('click', () => {
        btnDocente.classList.add('active');
        btnEstudiante.classList.remove('active');
        viewDocente.classList.add('active');
        viewEstudiante.classList.remove('active');
    });

    btnEstudiante.addEventListener('click', () => {
        btnEstudiante.classList.add('active');
        btnDocente.classList.remove('active');
        viewEstudiante.classList.add('active');
        viewDocente.classList.remove('active');
        updateStudentPortalView();
    });
}

// 2. Renderizar Lista de Estudiantes (Panel Docente)
function renderStudentList() {
    const container = document.getElementById('student-list');
    if (!container) return;
    container.innerHTML = '';

    appData.estudiantes.forEach(estudiante => {
        const item = document.createElement('div');
        item.className = `student-item ${estudiante.id === currentStudentId ? 'active' : ''}`;
        item.innerHTML = `
      <div>
        <div class="student-name">${estudiante.nombre}</div>
        <div class="student-task">${estudiante.tarea}</div>
      </div>
      <span>➡️</span>
    `;

        item.addEventListener('click', () => {
            currentStudentId = estudiante.id;
            document.querySelectorAll('.student-item').forEach(el => el.classList.remove('active'));
            item.classList.add('active');
            loadStudentData(currentStudentId);
        });

        container.appendChild(item);
    });
}

// 3. Cargar Datos del Estudiante Seleccionado
function loadStudentData(id) {
    const estudiante = appData.estudiantes.find(e => e.id === id);
    if (!estudiante) return;

    const reflectionEl = document.getElementById('docente-reflection-text');
    const textareaEl = document.getElementById('feedback-textarea');

    if (reflectionEl) reflectionEl.innerText = `"${estudiante.autorreflexion}"`;
    if (textareaEl) textareaEl.value = estudiante.feedbackDocente || '';

    // Actualizar selección visual de la rúbrica
    Object.keys(estudiante.evaluacion).forEach(criterioId => {
        const val = estudiante.evaluacion[criterioId];
        const btns = document.querySelectorAll(`.rubric-btn[data-criterio="${criterioId}"]`);
        btns.forEach(btn => {
            if (parseInt(btn.dataset.pts) === val) {
                btn.classList.add('selected');
            } else {
                btn.classList.remove('selected');
            }
        });
    });
}

// 4. Renderizar Rúbrica Dinámica
function renderRubric() {
    const container = document.getElementById('rubric-container');
    if (!container) return;
    container.innerHTML = '';

    appData.rubrica.forEach(item => {
        const div = document.createElement('div');
        div.className = 'rubric-criterion';
        div.innerHTML = `
      <div class="criterion-title">${item.titulo}</div>
      <div class="rubric-options">
        ${item.opciones.map(opt => `
          <button class="rubric-btn" data-criterio="${item.id}" data-pts="${opt.pts}">
            ${opt.label}
          </button>
        `).join('')}
      </div>
    `;
        container.appendChild(div);
    });

    // Event Listeners para botones de la rúbrica
    document.querySelectorAll('.rubric-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const targetBtn = e.currentTarget;
            const criterio = targetBtn.dataset.criterio;
            const pts = parseInt(targetBtn.dataset.pts);

            document.querySelectorAll(`.rubric-btn[data-criterio="${criterio}"]`).forEach(b => b.classList.remove('selected'));
            targetBtn.classList.add('selected');

            const estudiante = appData.estudiantes.find(est => est.id === currentStudentId);
            if (estudiante) {
                estudiante.evaluacion[criterio] = pts;
            }
        });
    });
}

// 5. Renderizar Banco de Respuestas Rápidas (Should Have)
function renderFeedbackBank() {
    const container = document.getElementById('feedback-bank');
    if (!container) return;
    container.innerHTML = '';

    appData.bancoRespuestas.forEach(item => {
        const btn = document.createElement('button');
        btn.className = 'bank-btn';
        btn.innerHTML = `<span>💬</span> <span>${item.texto}</span>`;

        btn.addEventListener('click', () => {
            const textarea = document.getElementById('feedback-textarea');
            if (!textarea) return;
            if (textarea.value.trim() !== '') {
                textarea.value += '\n' + item.texto;
            } else {
                textarea.value = item.texto;
            }
        });

        container.appendChild(btn);
    });
}

// 6. Configurar Eventos de Botones de Acción
function setupEventListeners() {
    const btnSend = document.getElementById('btn-send-feedback');
    if (btnSend) {
        btnSend.addEventListener('click', () => {
            const text = document.getElementById('feedback-textarea').value;
            const estudiante = appData.estudiantes.find(e => e.id === currentStudentId);

            if (estudiante) {
                estudiante.feedbackDocente = text;
                alert(`🚀 Retroalimentación y Microvideo enviados con éxito a ${estudiante.nombre}`);
            }
        });
    }

    const btnAudio = document.getElementById('btn-record-audio');
    if (btnAudio) {
        btnAudio.addEventListener('click', () => {
            alert('🎙️ Simulador: Nota de voz de 30 segundos adjuntada correctamente al microvideo.');
        });
    }

    const btnSaveReply = document.getElementById('btn-save-reply');
    if (btnSaveReply) {
        btnSaveReply.addEventListener('click', () => {
            const replyText = document.getElementById('student-reply-textarea').value;
            if (!replyText || replyText.trim() === '') {
                alert('Por favor escribe tu autorreflexión antes de guardar.');
                return;
            }
            alert('💾 Tu respuesta de autorreflexión ha sido enviada al docente.');
            document.getElementById('student-reply-textarea').value = '';
        });
    }
}

// 7. Actualizar Portal del Estudiante
function updateStudentPortalView() {
    const estudiante = appData.estudiantes.find(e => e.id === currentStudentId);
    if (!estudiante) return;

    const titleEl = document.getElementById('student-video-title');
    const textEl = document.getElementById('student-feedback-text');
    if (titleEl) titleEl.innerText = `Feedback para ${estudiante.nombre} - ${estudiante.tarea}`;
    if (textEl) textEl.innerText = estudiante.feedbackDocente || 'El docente aún no ha generado la retroalimentación para esta entrega.';

    // Desglose de rúbrica en vista estudiante
    const container = document.getElementById('student-rubric-detail');
    if (!container) return;
    container.innerHTML = '';

    appData.rubrica.forEach(item => {
        const ptsObtenidos = estudiante.evaluacion[item.id] || 0;
        const optMatch = item.opciones.find(o => o.pts === ptsObtenidos);

        const div = document.createElement('div');
        div.style.marginBottom = '0.75rem';
        div.style.padding = '0.6rem';
        div.style.backgroundColor = '#0f172a';
        div.style.borderRadius = '6px';
        div.style.border = '1px solid #334155';

        div.innerHTML = `
      <div style="font-size:0.85rem; font-weight:600; color:#06b6d4;">${item.titulo}</div>
      <div style="font-size:0.8rem; color:#f8fafc; margin-top:0.2rem;">
        Resultado: <strong>${optMatch ? optMatch.label : 'Sin calificar'}</strong>
      </div>
    `;
        container.appendChild(div);
    });
}