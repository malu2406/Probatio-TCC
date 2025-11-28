const tasksOl = document.querySelector('#tasks');
const taskInput = document.querySelector('#new-task');
const addTaskButton = document.querySelector('#add-task');
const taskTemplate = document.querySelector('#task-template');

document.addEventListener('DOMContentLoaded', loadTasksFromDB);

addTaskButton.addEventListener('click', (event) => {
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

  newTaskElement.id = taskData.id;
  taskText.textContent = taskData.text;

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
      const taskElement = document.getElementById(taskId);
      if (taskElement) taskElement.remove();
    }
  } catch (error) {
    console.error("Erro ao deletar tarefa:", error);
  }
}