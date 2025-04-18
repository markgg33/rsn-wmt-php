function addTaskField() {
  const container = document.getElementById("taskContainer");

  const newTaskGroup = document.createElement("div");
  newTaskGroup.classList.add("input-group", "mb-2", "task-input-group");

  newTaskGroup.innerHTML = `
    <input 
        type="text" 
        class="form-control" 
        name="tasks[]" 
        placeholder="e.g., Web - Content Creation" 
        required
    >
    <button 
        type="button" 
        class="btn btn-danger" 
        onclick="removeTaskField(this)"
    >
        Remove
    </button>
`;

  container.appendChild(newTaskGroup);
}

function removeTaskField(button) {
  if (confirm("Are you sure you want to remove this task?")) {
    button.parentElement.remove();
  }
}
