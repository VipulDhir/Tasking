document.addEventListener('DOMContentLoaded', () => {
  const taskForm = document.getElementById('task-form');
  const taskTitle = document.getElementById('task-title');
  const taskDesc = document.getElementById('task-desc');
  const taskDate = document.getElementById('task-date');
  const taskPriority = document.getElementById('task-priority');
  const addTaskBtn = document.getElementById('add-task-btn');
  const searchBar = document.getElementById('search-bar');
  const filterPriority = document.getElementById('filter-priority');
  const filterStatus = document.getElementById('filter-status');
  const upcomingList = document.getElementById('upcoming-list');
  const overdueList = document.getElementById('overdue-list');
  const completedList = document.getElementById('completed-list');

  const TASKS_KEY = 'tasks';
  let tasks = JSON.parse(localStorage.getItem(TASKS_KEY)) || [];

  const saveTasks = () => {
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  };

  const renderTasks = () => {
    upcomingList.innerHTML = '';
    overdueList.innerHTML = '';
    completedList.innerHTML = '';

    const now = new Date().toISOString().split('T')[0];

    tasks.forEach(task => {
      const taskElement = document.createElement('li');
      taskElement.innerHTML = `
        <span>
          ${task.title} - ${task.dueDate} (${task.priority})
        </span>
        <span>
          <button class="edit-btn">Edit</button>
          <button class="delete-btn">Delete</button>
          <button class="complete-btn">${task.completed ? 'Uncomplete' : 'Complete'}</button>
        </span>
      `;

      if (task.completed) {
        taskElement.classList.add('completed');
        completedList.appendChild(taskElement);
      } else if (task.dueDate < now) {
        overdueList.appendChild(taskElement);
      } else {
        upcomingList.appendChild(taskElement);
      }

      taskElement.querySelector('.edit-btn').addEventListener('click', () => editTask(task.id));
      taskElement.querySelector('.delete-btn').addEventListener('click', () => deleteTask(task.id));
      taskElement.querySelector('.complete-btn').addEventListener('click', () => toggleCompleteTask(task.id));
    });
  };

  const addTask = () => {
    const newTask = {
      id: Date.now(),
      title: taskTitle.value,
      description: taskDesc.value,
      dueDate: taskDate.value,
      priority: taskPriority.value,
      completed: false
    };

    tasks.push(newTask);
    saveTasks();
    renderTasks();
    taskForm.reset();
  };

  const editTask = id => {
    const task = tasks.find(t => t.id === id);
    taskTitle.value = task.title;
    taskDesc.value = task.description;
    taskDate.value = task.dueDate;
    taskPriority.value = task.priority;

    deleteTask(id);
  };

  const deleteTask = id => {
    tasks = tasks.filter(t => t.id !== id);
    saveTasks();
    renderTasks();
  };

  const toggleCompleteTask = id => {
    const task = tasks.find(t => t.id === id);
    task.completed = !task.completed;
    saveTasks();
    renderTasks();
  };

  const filterTasks = () => {
    const query = searchBar.value.toLowerCase();
    const priorityFilter = filterPriority.value;
    const statusFilter = filterStatus.value;

    const now = new Date().toISOString().split('T')[0];

    const filteredTasks = tasks.filter(task => {
      const matchesQuery = task.title.toLowerCase().includes(query);
      const matchesPriority = priorityFilter ? task.priority === priorityFilter : true;
      const matchesStatus =
        statusFilter === 'upcoming' ? task.dueDate >= now && !task.completed :
        statusFilter === 'overdue' ? task.dueDate < now && !task.completed :
        statusFilter === 'completed' ? task.completed :
        true;

      return matchesQuery && matchesPriority && matchesStatus;
    });

    upcomingList.innerHTML = '';
    overdueList.innerHTML = '';
    completedList.innerHTML = '';

    filteredTasks.forEach(task => {
      const taskElement = document.createElement('li');
      taskElement.innerHTML = `
        <span>
          ${task.title} - ${task.dueDate} (${task.priority})
        </span>
        <span>
          <button class="edit-btn">Edit</button>
          <button class="delete-btn">Delete</button>
          <button class="complete-btn">${task.completed ? 'Uncomplete' : 'Complete'}</button>
        </span>
      `;

      if (task.completed) {
        taskElement.classList.add('completed');
        completedList.appendChild(taskElement);
      } else if (task.dueDate < now) {
        overdueList.appendChild(taskElement);
      } else {
        upcomingList.appendChild(taskElement);
      }

      taskElement.querySelector('.edit-btn').addEventListener('click', () => editTask(task.id));
      taskElement.querySelector('.delete-btn').addEventListener('click', () => deleteTask(task.id));
      taskElement.querySelector('.complete-btn').addEventListener('click', () => toggleCompleteTask(task.id));
    });
  };

  addTaskBtn.addEventListener('click', addTask);
  searchBar.addEventListener('input', filterTasks);
  filterPriority.addEventListener('change', filterTasks);
  filterStatus.addEventListener('change', filterTasks);

  renderTasks();
});
