// DOM Elements
const todoInput = document.getElementById('todo-input');
const addButton = document.getElementById('todo-add');
const todosList = document.getElementById('todos-list');
const errorMessage = document.getElementById('error-message');


let todos = JSON.parse(localStorage.getItem('todos')) || [];

// Initialize the app
function init() {
  renderTodos();
  addButton.addEventListener('click', addTodo);
}

// Add a new todo
function addTodo() {
  const todoText = todoInput.value.trim();

  // Error handling: if input is empty
  if (!todoText) {
    showErrorMessage('Please enter a task.');
    return;
  }

  const newTodo = {
    id: Date.now(),
    text: todoText,
    completed: false
  };

  todos.push(newTodo);
  localStorage.setItem('todos', JSON.stringify(todos));

  todoInput.value = '';
  renderTodos();
}

// Render all todos
function renderTodos() {
  todosList.innerHTML = '';

  if (todos.length === 0) {
    todosList.innerHTML = '<p style="text-align: center; font-size: 1.5rem; color: #666; padding-bottom: 10px;">No tasks to show</p>';
  }

  todos.forEach(todo => {
    const todoItem = document.createElement('div');
    todoItem.classList.add('todo-item');

    // Add 'checked' class if the todo is completed
    if (todo.completed) {
      todoItem.classList.add('checked');
    }

    const todoItemLeft = document.createElement('div');
    todoItemLeft.classList.add('todo-item_left');
    
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = todo.completed;
    checkbox.addEventListener('change', () => toggleComplete(todo.id, todoItem));

    const label = document.createElement('p');
    label.textContent = todo.text;
    
    todoItemLeft.appendChild(checkbox);
    todoItemLeft.appendChild(label);
    
    const todoItemRight = document.createElement('div');
    todoItemRight.classList.add('todo-item_right');
    
    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.classList.add('edit-btn');
    editButton.addEventListener('click', () => editTodoPrompt(todo.id));
    
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.classList.add('delete-btn');
    deleteButton.addEventListener('click', () => deleteTodo(todo.id));
    
    todoItemRight.appendChild(editButton);
    todoItemRight.appendChild(deleteButton);
    
    todoItem.appendChild(todoItemLeft);
    todoItem.appendChild(todoItemRight);
    
    todosList.appendChild(todoItem);
  });
}

// Toggle the completion of a todo and add/remove 'checked' class
function toggleComplete(id, todoItem) {
  todos = todos.map(todo => 
    todo.id === id ? { ...todo, completed: !todo.completed } : todo
  );
  localStorage.setItem('todos', JSON.stringify(todos));

  // Add or remove 'checked' class based on completion state
  const todo = todos.find(todo => todo.id === id);
  if (todo.completed) {
    todoItem.classList.add('checked');
  } else {
    todoItem.classList.remove('checked');
  }

  renderTodos();
}

// Edit a todo
function editTodoPrompt(id) {
  const todo = todos.find(todo => todo.id === id);
  const newText = prompt('Edit the task:', todo.text);
  
  // Error handling: if the input is canceled or empty
  if (newText === null || newText.trim() === '') {
    showErrorMessage('Task cannot be empty.');
    return;
  }

  todo.text = newText;
  localStorage.setItem('todos', JSON.stringify(todos));
  renderTodos();
}

// Add these variables at the top of your script
const deleteModal = document.getElementById('delete-modal');
const cancelDeleteButton = document.getElementById('cancel-delete');
const confirmDeleteButton = document.getElementById('confirm-delete');

// Replace the existing deleteTodo function with this new version
function deleteTodo(id) {
  deleteModal.style.display = 'block';
  
  cancelDeleteButton.onclick = () => {
    closeDeleteModal();
  };
  
  confirmDeleteButton.onclick = () => {
    todos = todos.filter(todo => todo.id !== id);
    localStorage.setItem('todos', JSON.stringify(todos));
    renderTodos();
    closeDeleteModal();
  };
}

// Add this new function to close the delete modal
function closeDeleteModal() {
  deleteModal.style.display = 'none';
}

// Modify the existing window.onclick function to include the delete modal
window.onclick = (event) => {
  if (event.target === editModal) {
    closeModal();
  }
  if (event.target === deleteModal) {
    closeDeleteModal();
  }
};
// Show an error message for invalid input
function showErrorMessage(message) {
  errorMessage.textContent = message;
  errorMessage.style.display = 'block';

  setTimeout(() => {
    errorMessage.style.display = 'none';
  }, 3000);
}
const editModal = document.getElementById('edit-modal');
const editInput = document.getElementById('edit-input');
const saveEditButton = document.getElementById('save-edit');
const closeModalButton = document.querySelector('.close-btn');
const animatedErrorMessage = document.getElementById('animated-error-message');

// Edit a todo with modal
function editTodoPrompt(id) {
  const todo = todos.find(todo => todo.id === id);
  editInput.value = todo.text; // Pre-fill the input with the current todo text
  editModal.style.display = 'block'; // Show the modal

  saveEditButton.onclick = () => {
    const newText = editInput.value.trim();
    
    if (newText === '') {
      showErrorMessage('Task cannot be empty.'); // Show error message
      return;
    }

    todo.text = newText;
    localStorage.setItem('todos', JSON.stringify(todos));
    renderTodos();
    closeModal(); // Close the modal
  };
}

// Show error message for invalid input
function showErrorMessage(message) {
  animatedErrorMessage.textContent = message;
  animatedErrorMessage.style.display = 'block';

  setTimeout(() => {
    animatedErrorMessage.style.display = 'none';
  }, 3000);
}

// Close modal function
function closeModal() {
  editModal.style.display = 'none';
}

// Close modal when clicking on the close button
closeModalButton.onclick = closeModal;

// Close modal when clicking outside of the modal
window.onclick = (event) => {
  if (event.target === editModal) {
    closeModal();
  }
};



// Initialize app on page load
document.addEventListener('DOMContentLoaded', init);
