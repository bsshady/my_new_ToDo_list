// Объявление переменных
var taskInput = document.getElementById("task");
var taskList = document.getElementById("task-list");
var addTaskButton = document.getElementById("add-task");


// Функция для добавления задачи
function addTask() {
    var taskText = taskInput.value.trim();

    if (taskText === "") {
        alert("Пожалуйста, введите задачу!");
        return;
    }

    var li = document.createElement("li");

    var taskContainer = document.createElement("div");
    taskContainer.className = "task-container";

    var taskTextElement = document.createElement("span");
    taskTextElement.textContent = taskText;
    taskTextElement.className = "task-text"; // Добавляем класс для стилизации
    
    // Устанавливаем атрибут данных, чтобы отслеживать состояние развернутости
    taskTextElement.setAttribute("data-expanded", "false");

    taskContainer.appendChild(taskTextElement);

    var editButton = createButton("Редактировать", "edit-button", function() {
        editTask(li);
    });

    var deleteButton = createButton("Удалить", "delete-button", function() {
        deleteTask(li);
    });

    taskContainer.appendChild(editButton);
    taskContainer.appendChild(deleteButton);

    li.appendChild(taskContainer);
    taskList.appendChild(li);

    taskInput.value = "";

    saveTasksToLocalStorage();
}

// Функция для сворачивания / разворачивания текста задачи
function toggleTaskText(element) {
    element.classList.toggle("expanded");

    // Получаем состояния развернутости текста всех задач и сохраняем их в массив
    var taskStates = [];
    var taskTextElements = document.querySelectorAll(".task-text");
    taskTextElements.forEach(function(taskTextElement) {
        taskStates.push(taskTextElement.classList.contains("expanded"));
    });

    // Сохраняем состояния в локальное хранилище
    localStorage.setItem("taskStates", JSON.stringify(taskStates));
    saveTasksToLocalStorage();
}

taskList.addEventListener("click", function(event) {
    var target = event.target;

    if (target.classList.contains("task-text")) {
        var taskTextElement = target;
        taskTextElement.classList.toggle("task-text-expanded");

        // Обновляем состояние в локальном хранилище
        var li = taskTextElement.closest("li");
        updateTaskState(li);
    }
});

// Функция для обновления состояния задачи в локальном хранилище
function updateTaskState(li) {
    var taskTextElement = li.querySelector(".task-text");
    var isExpanded = taskTextElement.classList.contains("task-text-expanded");
    
    var taskId = li.getAttribute("data-task-id");
    
    var tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    var updatedTasks = tasks.map(function(task) {
        if (task.id === taskId) {
            task.isExpanded = isExpanded;
        }
        return task;
    });
    
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
}

// Обновленная функция для создания кнопки
function createButton(text, className, clickHandler) {
    var button = document.createElement("button");
    button.textContent = text;
    button.className = className;
    button.addEventListener("click", clickHandler);
    return button;
}



// Добавляем обработчик события keydown на поле ввода задачи
taskInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        addTask();
    }
});

// Функция для редактирования задачи
function editTask(li) {
    var taskTextElement = li.querySelector(".task-container .task-text");
    var taskText = taskTextElement.textContent.trim();
    var newText = prompt("Редактировать задачу:", taskText);

    if (newText !== null) {
        taskTextElement.textContent = newText;
        saveTasksToLocalStorage();
    }
}

taskList.addEventListener("click", function(event) {
    var target = event.target;
    if (target && target.classList.contains("task-text")) {
        var isExpanded = target.getAttribute("data-expanded") === "true";
        if (isExpanded) {
            target.setAttribute("data-expanded", "false");
            target.classList.remove("expanded");
        } else {
            target.setAttribute("data-expanded", "true");
            target.classList.add("expanded");
        }
        saveTasksToLocalStorage();
    }
});

// Функция для удаления задачи
function deleteTask(li) {
    taskList.removeChild(li);
    saveTasksToLocalStorage();
}

// Функция для сохранения задач в локальное хранилище
// Функция для сохранения задач в локальное хранилище
function saveTasksToLocalStorage() {
    var tasks = [];
    var taskTextElements = document.querySelectorAll(".task-text");
    
    taskTextElements.forEach(function(taskTextElement) {
        tasks.push({
            text: taskTextElement.textContent,
            expanded: taskTextElement.classList.contains("expanded")
        });
    });

    localStorage.setItem("tasks", JSON.stringify(tasks));
}


// Функция для загрузки задач из локального хранилища при загрузке страницы
// Функция для загрузки задач из локального хранилища при загрузке страницы
function loadTasksFromLocalStorage() {
    var tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    for (var i = 0; i < tasks.length; i++) {
        addTaskFromStorage(tasks[i].text, tasks[i].expanded);
    }
}

// Функция для добавления задачи из локального хранилища
function addTaskFromStorage(taskText, isExpanded) {
    var li = document.createElement("li");

    var taskContainer = document.createElement("div");
    taskContainer.className = "task-container";

    var taskTextElement = document.createElement("span");
    taskTextElement.textContent = taskText;
    taskTextElement.className = "task-text";

    // Устанавливаем атрибут данных в соответствии с состоянием развернутости
    taskTextElement.setAttribute("data-expanded", isExpanded ? "true" : "false");

    if (isExpanded) {
        taskTextElement.classList.add("expanded");
    }

    taskContainer.appendChild(taskTextElement);

    var editButton = createButton("Редактировать", "edit-button", function() {
        editTask(li);
    });

    var deleteButton = createButton("Удалить", "delete-button", function() {
        deleteTask(li);
    });

    taskContainer.appendChild(editButton);
    taskContainer.appendChild(deleteButton);

    li.appendChild(taskContainer);
    taskList.appendChild(li);
}


// Обработчик события для кнопки "Добавить"
addTaskButton.addEventListener("click", addTask);

// Загрузка задач из локального хранилища при загрузке страницы
window.addEventListener("load", loadTasksFromLocalStorage);
