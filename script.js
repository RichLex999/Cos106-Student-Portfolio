/* =========================================================
   COS 106 Term Project - Interactive JavaScript
   Author: Richard Alexander Joe
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  // 1. Dynamic Footer Year
  const yearSpan = document.getElementById("year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // 2. Responsive Mobile Navigation Toggle
  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      navLinks.classList.toggle("open");
    });
  }

  // 3. Academic Planner Functionality (Arrays, DOM Manipulation, Events)
  const taskForm = document.getElementById("taskForm");
  const taskInput = document.getElementById("taskInput");
  const courseSelect = document.getElementById("courseSelect");
  const dueDateInput = document.getElementById("dueDateInput");
  const taskList = document.getElementById("taskList");
  const plannerFeedback = document.getElementById("plannerFeedback");
  const totalCount = document.getElementById("totalCount");
  const completedCount = document.getElementById("completedCount");
  const pendingCount = document.getElementById("pendingCount");

  if (taskForm && taskList) {
    // Load initial tasks from localStorage or pre-populate realistic MIVA tasks
    let tasks = JSON.parse(localStorage.getItem("raj_academic_tasks")) || [
      {
        id: 1,
        title: "Build & deploy COS 106 Responsive Portfolio to GitHub Pages",
        course: "COS 106",
        dueDate: "2026-11-20",
        completed: false
      },
      {
        id: 2,
        title: "Complete Network Security & Packet Analysis Lab",
        course: "CYB 102",
        dueDate: "2026-11-24",
        completed: true
      }
    ];

    function saveTasks() {
      localStorage.setItem("raj_academic_tasks", JSON.stringify(tasks));
    }

    function updateStats() {
      const total = tasks.length;
      const completed = tasks.filter((t) => t.completed).length;
      const pending = total - completed;

      if (totalCount) totalCount.textContent = total;
      if (completedCount) completedCount.textContent = completed;
      if (pendingCount) pendingCount.textContent = pending;
    }

    function renderTasks() {
      taskList.innerHTML = "";

      if (tasks.length === 0) {
        taskList.innerHTML =
          '<li class="task-item"><span>No academic tasks yet. Add your first study goal above!</span></li>';
        updateStats();
        return;
      }

      tasks.forEach((task) => {
        const li = document.createElement("li");
        li.className = `task-item ${task.completed ? "completed" : ""}`;

        const metaDiv = document.createElement("div");
        metaDiv.className = "task-meta";

        const badge = document.createElement("span");
        badge.className = "course-badge";
        badge.textContent = task.course;

        const titleSpan = document.createElement("span");
        titleSpan.className = "task-title";
        titleSpan.textContent = task.title;

        metaDiv.appendChild(badge);
        metaDiv.appendChild(titleSpan);

        if (task.dueDate) {
          const dateSmall = document.createElement("small");
          dateSmall.style.color = "#94a3b8";
          dateSmall.textContent = `Due: ${task.dueDate}`;
          metaDiv.appendChild(dateSmall);
        }

        const actionsDiv = document.createElement("div");
        actionsDiv.className = "task-actions";

        const toggleBtn = document.createElement("button");
        toggleBtn.type = "button";
        toggleBtn.className = "btn-complete";
        toggleBtn.textContent = task.completed ? "Undo" : "Complete";
        toggleBtn.addEventListener("click", () => toggleTask(task.id));

        const deleteBtn = document.createElement("button");
        deleteBtn.type = "button";
        deleteBtn.className = "btn-delete";
        deleteBtn.textContent = "Delete";
        deleteBtn.addEventListener("click", () => deleteTask(task.id));

        actionsDiv.appendChild(toggleBtn);
        actionsDiv.appendChild(deleteBtn);

        li.appendChild(metaDiv);
        li.appendChild(actionsDiv);
        taskList.appendChild(li);
      });

      updateStats();
    }

    function addTask(title, course, dueDate) {
      const newTask = {
        id: Date.now(),
        title: title.trim(),
        course,
        dueDate,
        completed: false
      };
      tasks.unshift(newTask);
      saveTasks();
      renderTasks();
    }

    function toggleTask(id) {
      tasks = tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      );
      saveTasks();
      renderTasks();
    }

    function deleteTask(id) {
      tasks = tasks.filter((task) => task.id !== id);
      saveTasks();
      renderTasks();
    }

    taskForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const titleValue = taskInput.value.trim();

      if (!titleValue) {
        plannerFeedback.textContent = "Please enter a task description before adding.";
        taskInput.focus();
        return;
      }

      plannerFeedback.textContent = "";
      addTask(titleValue, courseSelect.value, dueDateInput.value);
      taskInput.value = "";
      dueDateInput.value = "";
    });

    renderTasks();
  }

  // 4. Contact Form Validation (No empty fields, valid email, digits-only phone)
  const contactForm = document.getElementById("contactForm");

  if (contactForm) {
    const fullName = document.getElementById("fullName");
    const emailAddress = document.getElementById("emailAddress");
    const phoneNumber = document.getElementById("phoneNumber");
    const messageBox = document.getElementById("messageBox");

    const nameError = document.getElementById("nameError");
    const emailError = document.getElementById("emailError");
    const phoneError = document.getElementById("phoneError");
    const messageError = document.getElementById("messageError");
    const formSuccess = document.getElementById("formSuccess");

    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      let isValid = true;
      formSuccess.style.display = "none";

      // Reset errors
      nameError.textContent = "";
      emailError.textContent = "";
      phoneError.textContent = "";
      messageError.textContent = "";

      // Validate Name (non-empty)
      if (fullName.value.trim() === "") {
        nameError.textContent = "Full name is required.";
        isValid = false;
      }

      // Validate Email (non-empty & valid format)
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailAddress.value.trim() === "") {
        emailError.textContent = "Email address is required.";
        isValid = false;
      } else if (!emailPattern.test(emailAddress.value.trim())) {
        emailError.textContent = "Please enter a valid email address (e.g., name@domain.com).";
        isValid = false;
      }

      // Validate Phone Number (non-empty & contains ONLY digits)
      const digitsOnlyPattern = /^\d+$/;
      if (phoneNumber.value.trim() === "") {
        phoneError.textContent = "Phone number is required.";
        isValid = false;
      } else if (!digitsOnlyPattern.test(phoneNumber.value.trim())) {
        phoneError.textContent = "Phone number must contain only digits (0–9), with no spaces or symbols.";
        isValid = false;
      }

      // Validate Message (non-empty)
      if (messageBox.value.trim() === "") {
        messageError.textContent = "Message field cannot be empty.";
        isValid = false;
      }

      if (isValid) {
        formSuccess.textContent = `Thank you, ${fullName.value.trim()}! Your message has been validated and sent to Richard Alexander Joe.`;
        formSuccess.style.display = "block";
        contactForm.reset();
      }
    });
  }
});