

//input text

const input = document.querySelector('#new-task');

input.addEventListener('keyup', function (event) {
    let taskName = event.target.value;
    if (event.code === 'Enter') {
        addNewTaskToLocalStorage(taskName);
    }
})
//========================




//modal window

let taskToDelete;

function modalWindow(event) {
    const modal = document.querySelector('.modal');
    let modalName = document.querySelector('.demo');

    modal.style.display = 'block';
    modalName.textContent = event.target.previousElementSibling.textContent;

    taskToDelete = event.target.parentElement;
}
//========================




//close modal window

function closeModal() {
    const closeModalWindow = document.querySelector('.modal');
    closeModalWindow.style.display = 'none';
}
//========================



// delete line

const modalYes = document.querySelector('.modal__yes');

modalYes.addEventListener('click', function (event) {
    //taskToDelete.remove();
    let tasks = JSON.parse(localStorage.getItem('tasks'));
    tasks = tasks.filter(function (task) {
        return task.id != taskToDelete.id;
    });

    localStorage.setItem('tasks', JSON.stringify(tasks));

    drawElementsFromLocalStorage();

    let deleteFromLocalStorage = localStorage.getItem('tasks')

    closeModal();
})
//========================



// tasks Do Done        переносить таскі в виконанні

let taskItem;
let taskDoNotDone;

function tasksDoDone(event) {

    taskItem = event.target.parentElement;

    let tasks = JSON.parse(localStorage.getItem('tasks'));

    tasks.forEach(function (task) {
        if (task.id == taskItem.id) {
            task.checked = true;
        }
    });

    localStorage.setItem('tasks', JSON.stringify(tasks));

    drawElementsFromLocalStorage();
}
//========================



//task not Done

function taskNotDone(event) {
    taskDoNotDone = event.target.parentElement;

    let taskToDone = JSON.parse(localStorage.getItem('tasks'));

    taskToDone.forEach(function (task) {
        if (task.id == taskDoNotDone.id) {
            task.checked = false;
        }
    });

    localStorage.setItem('tasks', JSON.stringify(taskToDone));

    drawElementsFromLocalStorage();
}
//========================




//editing taskName

function editTaskName() {
    let input = document.createElement('input');
    input.classList.add('input__text');
    input.value = this.innerHTML;
    this.innerHTML = '';
    this.appendChild(input);

    let tn = this;

    input.addEventListener('keyup', editingTask);
    input.addEventListener('blur', editingTask);

    function editingTask() {
        if (event.code === 'Enter') {
            tn.innerHTML = input.value;
            tn.addEventListener('click', editTaskName);
        }
    };

    this.removeEventListener('click', editTaskName);
};
//========================

function incompleteCount(event) {
    let tasksCount = JSON.parse(localStorage.getItem('tasks'));

    count = tasksCount.length;
    document.querySelector('.incomplete').textContent = count;

    //========================

    let taskIncompleteCount = document.querySelectorAll('.tasks__list').length;
    let countCompl = count - taskIncompleteCount;
    document.querySelector('.complete').textContent = countCompl;

    //========================

    let taskDoneCount = document.querySelectorAll('.task__done').length;

    if (taskDoneCount == 0) {
        document.querySelector('.percent').textContent = '0%';
        document.querySelector('.percent').style.color = 'black';
    } else if (taskIncompleteCount == 0) {
        document.querySelector('.percent').textContent = '100%';
        document.querySelector('.percent').style.color = 'green';
    } else if (taskDoneCount < taskIncompleteCount) {
        console.log('count');
        document.querySelector('.percent').textContent = (Math.round((taskDoneCount / count) * 100)) + '%';
        document.querySelector('.percent').style.color = 'red';
    } else if (taskDoneCount == taskIncompleteCount) {
        document.querySelector('.percent').textContent = '50%';
        document.querySelector('.percent').style.color = 'orange';
    } else if (taskDoneCount > taskIncompleteCount || taskIncompleteCount != 0) {
        document.querySelector('.percent').textContent = Math.round((taskDoneCount / count) * 100) + '%';
        document.querySelector('.percent').style.color = 'orange';
    }

}




// Line for task
function taskLine(textTask, id, newTask = true) {

    let tasks = document.querySelector(newTask ? '.tasks' : '.tasks__done');

    let div = document.createElement('div');
    div.classList.add(newTask ? 'tasks__list' : 'task__done');
    div.classList.add('retreat');
    div.id = id;
    tasks.prepend(div);

    let a = document.createElement('a');
    a.classList.add(newTask ? 'circle' : 'circle__done');
    a.addEventListener('click', a.className == 'circle' ? tasksDoDone : taskNotDone);
    div.appendChild(a);

    let span = document.createElement('span');
    span.classList.add("task__name");
    span.setAttribute('contenteditable', 'true');

    span.addEventListener('keydown', function (e) {
        if (e.keyCode === 13) {
            e.preventDefault();
            this.blur();
        }
    })
    span.textContent = textTask;
    div.appendChild(span);

    let button = document.createElement('button');
    button.className = 'delete';
    button.addEventListener('click', modalWindow);
    div.appendChild(button);

    event.target.value = '';
    incompleteCount();
}
//========================


// add task to done

function taskDone(event) {
    let tasksDone = document.querySelector('.tasks__done');
    tasksDone.prepend(taskItem);

}
//========================



// Local Storage

function addNewTaskToLocalStorage(taskName) {

    if (localStorage.getItem('tasks') === null) {
        localStorage.setItem('tasks', '[]')
    };
    let tasks = JSON.parse(localStorage.getItem('tasks'));
    let id;
    if (tasks.length == 0) { id = 1; }
    else {
        let taskLastEl = tasks.length;
        id = taskLastEl + 1;
    };
    let task = {
        id: id,
        name: taskName,
        checked: false,
        editing: false,
    }
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    drawElementsFromLocalStorage();
}
//========================

function doneOrNotTasks() {
    let tasksLS = localStorage.getItem('tasks')
    let tasks = JSON.parse(tasksLS);

    if (tasks !== null) {
        var tasksArr = tasks.filter(function (task) {
            return task.checked === false;
        });
    }
    document.querySelector('.no__tasks').style.display = 'none';
    document.querySelector('.percent__work').style.display = 'grid';
    document.querySelector('.all__done').style.display = 'none';

    if (tasksLS === null || tasks.length == false) {
        document.querySelector('.no__tasks').style.display = 'grid';
        document.querySelector('.percent__work').style.display = 'none';
    } else if (tasksArr.length === 0) {
        document.querySelector('.all__done').style.display = 'grid';
    };
}

function drawElementsFromLocalStorage() {
    doneOrNotTasks();

    let tasks = JSON.parse(localStorage.getItem('tasks'));

    document.getElementsByClassName('tasks__done')[0].innerHTML = '';
    document.getElementsByClassName('tasks')[0].innerHTML = '';

    tasks.forEach(function (task) {

        let taskHtml = document.createElement('span');
        taskHtml.classList.add('retreat');
        if (task.checked == false) {
            taskLine(task.name, task.id);
        } else {
            taskLine(task.name, task.id, false);
        }

    });

}

document.addEventListener('DOMContentLoaded', function () {
    drawElementsFromLocalStorage();
});