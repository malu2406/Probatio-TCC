const tasksOl = document.querySelector('#tasks');
const taskInput = document.querySelector('#new-task');
const addTaskButton = document.querySelector('#add-task');
const taskTemplate = document.querySelector('#task-template');
const taskForm = document.querySelector('#task-form');

document.addEventListener('DOMContentLoaded', loadTasksFromDB);

taskForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const newTaskText = taskInput.value;
  if (!newTaskText) return;

  createTaskInDB(newTaskText);
  taskInput.value = "";
});

function renderTask(taskData) {
  const taskTemplateClone = taskTemplate.content.cloneNode(true);
  const newTaskElement = taskTemplateClone.querySelector(".task");
  const taskText = taskTemplateClone.querySelector(".task-text");
  const deleteButton = taskTemplateClone.querySelector("#delete-button");
  const checkbox = taskTemplateClone.querySelector(".task-checkbox");

  newTaskElement.id = `task-${taskData.id}`;
  taskText.textContent = taskData.text;

  checkbox.checked = taskData.completed;
  if (taskData.completed) {
    taskText.classList.add("completed");
  }

  checkbox.addEventListener("change", () => {
    toggleTaskCompletion(taskData.id, checkbox.checked, taskText);
  });

  deleteButton.addEventListener("click", () => deleteTask(taskData.id));

  tasksOl.appendChild(taskTemplateClone);
}

async function loadTasksFromDB() {
  try {
    tasksOl.innerHTML = "";
    const response = await fetch('/tasks');
    const tasks = await response.json();
    tasks.forEach((task) => renderTask(task));
  } catch (error) {
    console.error("Erro ao carregar tarefas:", error);
  }
}

async function createTaskInDB(text) {
  try {
    const response = await fetch('/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ text: text })
    });

    if (response.ok) {
      const savedTask = await response.json();
      renderTask(savedTask);
    }
  } catch (error) {
    console.error("Erro ao salvar tarefa:", error);
  }
}

async function deleteTask(taskId) {
  try {
    const response = await fetch(`/tasks/${taskId}`, {
      method: 'DELETE'
    });

    if (response.ok) {
      const taskElement = document.getElementById(`task-${taskId}`);
      if (taskElement) taskElement.remove();
    }
  } catch (error) {
    console.error("Erro ao deletar tarefa:", error);
  }
}

async function toggleTaskCompletion(taskId, isCompleted, textElement) {
  try {
    if (isCompleted) {
      textElement.classList.add("completed");
    } else {
      textElement.classList.remove("completed");
    }

    const response = await fetch(`/tasks/${taskId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ completed: isCompleted })
    });

    if (!response.ok) {
      throw new Error('Erro na atualização do servidor');
    }
  } catch (error) {
    console.error("Erro ao atualizar status da tarefa:", error);

    if (isCompleted) {
      textElement.classList.remove("completed");
      const checkbox = document.querySelector(`#task-${taskId} .task-checkbox`);
      if (checkbox) checkbox.checked = false;
    } else {
      textElement.classList.add("completed");
      const checkbox = document.querySelector(`#task-${taskId} .task-checkbox`);
      if (checkbox) checkbox.checked = true;
    }

    alert("Não foi possível atualizar a tarefa. Tente novamente.");
  }
}