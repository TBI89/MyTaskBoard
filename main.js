"use strict";

loadTask();

// Save task to local storage:
function saveTask() {

    // Take HTML elements:
    const taskDescriptionBox = document.getElementById("taskDescriptionBox");
    const dateAndTimeBox = document.getElementById("dateAndTimeBox");

    // Take values:
    const taskDescription = taskDescriptionBox.value;
    const dateAndTime = dateAndTimeBox.value;

    // Validate all user inputs:
    if (taskDescriptionBox.value === "" || taskDescriptionBox.value.length < 5 || taskDescriptionBox.value.length > 500) {
        alert("Please write down a legal task (5 to 500 characters)");
        taskDescriptionBox.focus();
        return;
    }

    const isDateVal = new Date(dateAndTime);
    if (isNaN(isDateVal) || isDateVal < new Date()) {
        alert("Please enter a legal date");
        dateAndTimeBox.focus();
        return;
    }

    // Create task object:
    let task = { taskDescription, dateAndTime };

    // Take data from storage:
    let json = localStorage.getItem("allTasks");
    const allTasks = json ? JSON.parse(json) : [];

    // Add new task:
    allTasks.push(task);

    // Save new task in JSON format:
    json = JSON.stringify(allTasks);
    localStorage.setItem("allTasks", json);

    // Clear all boxes:
    taskDescription.value = "";
    dateAndTime.value = "";
}

// Display all tasks (undone ones) on the page:
function loadTask() {

    // Get task data from storage:
    let json = localStorage.getItem("allTasks");
    const allTasks = json ? JSON.parse(json) : [];

    // Remove tasks that there date passed:
    const currentTime = new Date().getTime();
    for (let i = 0; i < allTasks.length; i++) {
        const taskTime = new Date(allTasks[i].dateAndTime).getTime();
        if (taskTime <= currentTime) {
            removeTask();
        }
    }

    // Display the tasks via div elements:
    let html = "";
    for (let i = 0; i < allTasks.length; i++) {
        html += `
        <div class="task">
        <button class="clear" onclick="removeTask(${i})">❌</button>
        <div class="task-description">${allTasks[i].taskDescription}</div>
        <div class="task-date" id="date-${i}">${displayDateTime(allTasks[i].dateAndTime)}</div>
    </div>
      `;
    }
    const taskSection = document.getElementById("taskSection");
    taskSection.innerHTML = html;
}

// Display the date (on the bottom of the note) in a dd/mm/yyyy format:
function displayDateTime(dateString) {
    const date = new Date(dateString);
    const print = { day: "2-digit", month: "2-digit", year: "numeric", hour: "numeric", minute: "numeric" };
    return date.toLocaleDateString("he-IL", print);
}

// Remove a task by pressing the "x" button:
function removeTask(index) {

    // Get data from local storage:
    let json = localStorage.getItem("allTasks");
    let allTasks = json ? JSON.parse(json) : [];

    // Check if the array exist:
    if (!allTasks) {
        return;
    }

    // Remove one task:
    allTasks.splice(index, 1);

    // Save other items back to storage:
    json = JSON.stringify(allTasks);
    localStorage.setItem("allTasks", json);

    // Reload the existing tasks: 
    loadTask();
}