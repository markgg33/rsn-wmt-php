/*
WORKING CODE
document.addEventListener("DOMContentLoaded", () => {
    let currentWorkModes = {};
  
    // Fetch all work modes
    fetch("get_work_modes.php")
      .then((res) => res.json())
      .then((data) => {
        currentWorkModes = data;
        populateDropdown(data);
      });
  
    function populateDropdown(workModes) {
      const dropdown = document.createElement("select");
      dropdown.className = "form-select mb-3";
      dropdown.id = "workModeSelectorDropdown";
  
      const defaultOption = document.createElement("option");
      defaultOption.textContent = "-- Select Work Mode --";
      defaultOption.value = "";
      dropdown.appendChild(defaultOption);
  
      Object.keys(workModes).forEach((mode) => {
        const opt = document.createElement("option");
        opt.value = mode;
        opt.textContent = mode;
        dropdown.appendChild(opt);
      });
  
      const container = document.getElementById("existingWorkModesList");
      container.innerHTML = ""; // Clear
      container.appendChild(dropdown);
  
      const editorArea = document.createElement("div");
      editorArea.id = "workModeEditorArea";
      container.appendChild(editorArea);
  
      dropdown.addEventListener("change", () => {
        const selected = dropdown.value;
        if (selected) {
          renderEditor(selected, workModes[selected]);
        } else {
          editorArea.innerHTML = "";
        }
      });
    }
  
    function renderEditor(workModeName, tasks) {
      const editor = document.getElementById("workModeEditorArea");
      editor.innerHTML = ""; // Clear previous editor
  
      const wrapper = document.createElement("div");
      wrapper.className = "card p-3";
  
      // Work mode name field
      const nameInput = document.createElement("input");
      nameInput.className = "form-control mb-3";
      nameInput.value = workModeName;
  
      // Task input group container
      const taskContainer = document.createElement("div");
      tasks.forEach((task) => {
        taskContainer.appendChild(createTaskInput(task));
      });
  
      // Add task button
      const addTaskBtn = document.createElement("button");
      addTaskBtn.className = "btn btn-secondary btn-sm mt-2";
      addTaskBtn.textContent = "+ Add Task";
      addTaskBtn.onclick = () => taskContainer.appendChild(createTaskInput(""));
  
      // Save button
      const saveBtn = document.createElement("button");
      saveBtn.className = "btn btn-success mt-3";
      saveBtn.textContent = "Save Changes";
      saveBtn.onclick = () => {
        const updatedName = nameInput.value.trim();
        const newTasks = Array.from(
          taskContainer.querySelectorAll("input.task-input")
        )
          .map((i) => i.value.trim())
          .filter((v) => v !== "");
  
        if (!updatedName) {
          alert("Work mode name cannot be empty.");
          return;
        }
  
        fetch("php_handlers/update_work_mode.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            originalName: workModeName,
            newName: updatedName,
            tasks: newTasks,
          }),
        })
          .then((res) => res.json())
          .then((res) => {
            alert(res.message || "Work mode updated.");
            location.reload();
          })
          .catch((err) => {
            console.error(err);
            alert("Failed to save changes.");
          });
      };
  
      wrapper.appendChild(nameInput);
      wrapper.appendChild(taskContainer);
      wrapper.appendChild(addTaskBtn);
      wrapper.appendChild(saveBtn);
      editor.appendChild(wrapper);
    }
  
    function createTaskInput(value) {
      const group = document.createElement("div");
      group.className = "input-group mb-2";
  
      const input = document.createElement("input");
      input.type = "text";
      input.className = "form-control task-input";
      input.placeholder = "Task Description";
      input.value = value;
  
      const removeBtn = document.createElement("button");
      removeBtn.className = "btn btn-danger";
      removeBtn.innerHTML = '<i class="fa fa-trash"></i>';
      removeBtn.onclick = () => group.remove();
  
      group.appendChild(input);
      group.appendChild(removeBtn);
      return group;
    }
  });*/

document.addEventListener("DOMContentLoaded", () => {
  let currentWorkModes = {};

  // ============================================
  // ========== INITIAL FETCH & SETUP ===========
  // ============================================

  fetch("get_work_modes.php")
    .then((res) => res.json())
    .then((data) => {
      currentWorkModes = data;
      populateDropdown(data);
    });

  // ============================================
  // ========== DROPDOWN UI POPULATION ==========
  // ============================================

  function populateDropdown(workModes) {
    const dropdown = document.createElement("select");
    dropdown.className = "form-select mb-3";
    dropdown.id = "workModeSelectorDropdown";

    const defaultOption = document.createElement("option");
    defaultOption.textContent = "-- Select Work Mode --";
    defaultOption.value = "";
    dropdown.appendChild(defaultOption);

    Object.keys(workModes).forEach((mode) => {
      const opt = document.createElement("option");
      opt.value = mode;
      opt.textContent = mode;
      dropdown.appendChild(opt);
    });

    const container = document.getElementById("existingWorkModesList");
    container.innerHTML = "";
    container.appendChild(dropdown);

    const editorArea = document.createElement("div");
    editorArea.id = "workModeEditorArea";
    container.appendChild(editorArea);

    dropdown.addEventListener("change", () => {
      const selected = dropdown.value.trim();
      if (selected) {
        renderEditor(selected, workModes[selected]);
      } else {
        editorArea.innerHTML = "";
      }
    });
  }

  // ============================================
  // ========== RENDER WORK MODE EDITOR =========
  // ============================================

  function renderEditor(workModeName, tasks) {
    const editor = document.getElementById("workModeEditorArea");
    editor.innerHTML = "";

    const wrapper = document.createElement("div");
    wrapper.className = "card p-3";

    // Work mode name field
    const nameInput = document.createElement("input");
    nameInput.className = "form-control mb-3";
    nameInput.value = workModeName;

    // Task input group container
    const taskContainer = document.createElement("div");
    tasks.forEach((task) => {
      taskContainer.appendChild(createTaskInput(task));
    });

    // Add task button
    const addTaskBtn = document.createElement("button");
    addTaskBtn.className = "btn btn-secondary btn-sm mt-2";
    addTaskBtn.textContent = "+ Add Task";
    addTaskBtn.onclick = () => taskContainer.appendChild(createTaskInput(""));

    // Save button
    const saveBtn = document.createElement("button");
    saveBtn.className = "btn btn-success mt-3 me-2";
    saveBtn.textContent = "Save Changes";
    saveBtn.onclick = () => {
      const updatedName = nameInput.value.trim();
      const newTasks = Array.from(
        taskContainer.querySelectorAll("input.task-input")
      )
        .map((i) => i.value.trim())
        .filter((v) => v !== "");

      if (!updatedName) {
        alert("Work mode name cannot be empty.");
        return;
      }

      fetch("php_handlers/update_work_mode.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          originalName: workModeName,
          newName: updatedName,
          tasks: newTasks,
        }),
      })
        .then((res) => res.json())
        .then((res) => {
          alert(res.message || "Work mode updated.");
          location.reload();
        })
        .catch((err) => {
          console.error(err);
          alert("Failed to save changes.");
        });
    };

    // Delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.className = "btn btn-danger mt-3";
    deleteBtn.textContent = "Delete Work Mode";
    deleteBtn.onclick = () => {
      if (
        confirm(
          `Are you sure you want to delete "${workModeName}"? This will remove all associated tasks.`
        )
      ) {
        deleteWorkMode(workModeName);
      }
    };

    wrapper.appendChild(nameInput);
    wrapper.appendChild(taskContainer);
    wrapper.appendChild(addTaskBtn);
    wrapper.appendChild(saveBtn);
    wrapper.appendChild(deleteBtn);
    editor.appendChild(wrapper);
  }

  // ============================================
  // ========== CREATE TASK INPUT FIELD =========
  // ============================================

  function createTaskInput(value) {
    const group = document.createElement("div");
    group.className = "input-group mb-2";

    const input = document.createElement("input");
    input.type = "text";
    input.className = "form-control task-input";
    input.placeholder = "Task Description";
    input.value = value;

    const removeBtn = document.createElement("button");
    removeBtn.className = "btn btn-danger";
    removeBtn.innerHTML = '<i class="fa fa-trash"></i>';
    removeBtn.onclick = () => {
      const confirmDelete = confirm(
        "Are you sure you want to delete this task description?"
      );
      if (confirmDelete) {
        group.remove();
      }
    };

    group.appendChild(input);
    group.appendChild(removeBtn);
    return group;
  }

  // ============================================
  // ========== DELETE WORK MODE FUNCTION =======
  // ============================================

  function deleteWorkMode(workModeName) {
    fetch("delete_work_mode.php", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `work_mode_name=${encodeURIComponent(workModeName)}`,
    })
      .then((res) => res.json())
      .then((data) => {
        alert(data.message || "Work mode deleted.");
        if (data.status === "success") {
          location.reload();
        }
      })
      .catch((err) => {
        console.error(err);
        alert("Failed to delete work mode.");
      });
  }
});
