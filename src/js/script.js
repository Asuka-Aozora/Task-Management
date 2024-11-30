const input = document.querySelector("#taskInput");
const addTaskBtn = document.querySelector("#addTaskBtn");
const taskList = document.querySelector("#taskList");
const emptyToDo = document.querySelector(".emptyToDo");


// ngerender tugas
const renderTugas = () => {
  const jsonTugas = JSON.parse(localStorage.getItem("tugas")) || [];
  taskList.innerHTML = "";

  if (jsonTugas.length == 0) {
    emptyToDo.classList.remove("hidden");
  } else {
    emptyToDo.classList.add("hidden");
  }

  jsonTugas.forEach((todo) => {
    const taskItem = document.createElement("li");
    taskItem.classList.add(
      "bg-white",
      "p-4",
      "rounded",
      "shadow-lg",
      "flex",
      "justify-between",
      "items-center"
    );
    // ngeset atribut data-id dengan nilai id dari todo yang ada di localStorage
    taskItem.setAttribute("data-id", todo.id);
    taskItem.innerHTML = `
    <div class="flex items-center">
      <span class="task-text ${
        todo.completed ? "line-through text-gray-400" : "text-gray-800"
      }">${todo.task}</span>
    </div>
    <div class="newBtn flex gap-2">
      <button class="complete-btn bg-green-100 ${
        todo.completed ? "bg-gray-300" : "hover:bg-green-200"
      } text-gray-800 hover:text-gray-900 transition-colors duration-300 flex items-center space-x-1 font-semibold rounded px-2 py-1">
        <i class='bx ${todo.completed ? "bx-undo" : "bx-check-circle"}'></i>
        <span class="text-sm">${todo.completed ? "Uncomplete" : "Complete"}</span>
      </button>
      <button class="edit-btn bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center space-x-2">
        <i class='bx bx-edit'></i>
      </button>
      <button class="delete-btn bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 flex items-center space-x-2">
        <i class='bx bx-trash'></i>
      </button>
    </div>
    `;

    taskList.appendChild(taskItem)
  });
};

    // Fungsi untuk menambahkan tugas baru
    const addTask = () => {
      const valueTugas = input.value.trim(); // trim untuk menghapus spasi berlebih
      if (valueTugas === "") {
        alert("Enter a task!");
        return;
      }
      const jsonTugas = JSON.parse(localStorage.getItem("tugas")) || []; // ambil data dari local storage
      const tugasBaru = {
        id: new Date().getTime(),
        task: valueTugas,
        completed: false,
      };
      jsonTugas.push(tugasBaru); // tambahkan tugas baru ke array
      localStorage.setItem("tugas", JSON.stringify(jsonTugas)); // simpan kembali ke local storage
      input.value = ""; // kosongkan input
      renderTugas(); // render ulang tugas
    };

    
    const hapusTugas = (id) => {
      let jsonTugas = JSON.parse(localStorage.getItem("tugas")) || [];
      jsonTugas =  jsonTugas.filter((todo) => todo.id !== id) // masuk kesini hanya dengan id yang tidak sama dengan yang diberikan
      localStorage.setItem('tugas', JSON.stringify(jsonTugas)); // simpan data, di set ulang, di update, maka akan terhapus yang tidak kena filter yang diberikan
      renderTugas();
    }


    const editTugas = (id) => {
      const taskItem =  document.querySelector(`li[data-id="${id}"]`) // mengambil id di dalam li
      const textTugas = taskItem.querySelector('.task-text') 
      const textAwal = textTugas.textContent; // menyimpan original text tugas

      const jsonTugas = JSON.parse(localStorage.getItem('tugas')) || [];
      textTugas.innerHTML = `
      <input type="text" class="edit-input border border-gray-300 rounded px-2 py-1" value="${textAwal}"> 
      `; // mengganti isi yang ada di task-text sebelumnya
      // mengubahnya menjadi seperti ini dalamnya :
      /*<div class="task-text">
        <input type="text" class="edit-input border border-gray-300 rounded px-2 py-1" value="Belajar JavaScript">
        </div>*/ 
      /* awalnya seperti ini, menjadi value:
      <div class="task-text">Belajar JavaScript</div>
       */
   
      const editInput = textTugas.querySelector(".edit-input");
      const buttonsDiv = taskItem.querySelector(".newBtn"); // mengambil wadah dan mengubahnya seperti yang di bawah
      buttonsDiv.innerHTML = `
        <button class="save-btn bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center space-x-2">
          <i class='bx bx-save'></i>
          <span>Save</span>
        </button>
        <button class="cancel-btn bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 flex items-center space-x-2">
          <i class='bx bx-x'></i>
          <span>Cancel</span>
        </button>
      `;
      const saveBtn = taskItem.querySelector(".save-btn");
      saveBtn.addEventListener("click", () => {
        const newTaskValue = editInput.value.trim();
        if (newTaskValue) /* memeriksa apakah newTaskValue bukan string kosong bukan null dll, sangat penting untuk memastikan tidak ada spasi atau kosong */ {
          const taskToEdit = jsonTugas.find((todo) => todo.id === id);
          taskToEdit.task = newTaskValue;
          localStorage.setItem("tugas", JSON.stringify(jsonTugas));
          renderTugas();
        } else {
          alert("Enter a task!");
        }
    });
      
    const cancelBtn = taskItem.querySelector(".cancel-btn");
    cancelBtn.addEventListener("click", () => {
      renderTugas();
    });
    
    }

    const toggleCompleteTask = (id) => {
      const jsonTugas = JSON.parse(localStorage.getItem('tugas')) || [];
      const taskToToggle = jsonTugas.find((todo) => todo.id === id);
      taskToToggle.completed = !taskToToggle.completed; // jadi kita membalikkan isi boolean didalamnya 
      /* 
      Jika sebelumnya true (selesai), diubah menjadi false (belum selesai).
      Jika sebelumnya false, diubah menjadi true.
      */
      localStorage.setItem("tugas", JSON.stringify(jsonTugas)); // simpan perubahannya
      renderTugas();
    }

    
    addTaskBtn.addEventListener("click", addTask); // tombol untuk menjalankan addTask Function

    taskList.addEventListener('click', (e) => {
      const target = e.target
      const taskItem = target.closest('li')
      if (!taskItem) return;
      const taskId = Number(taskItem.getAttribute("data-id")); // menganmbil id dari "li"

      // jika salah satu tombol ini diclick maka akan menjalakan fungsinya masing-masing, makan taskId akan mengikuti instruksi yang di berikan
      if(target.closest('.delete-btn')) {
        hapusTugas(taskId) 
      }
      if(target.closest('.edit-btn')) {
        editTugas(taskId) 
      }
      if(target.closest('.complete-btn')) {
        toggleCompleteTask(taskId) 
      }

    })
    
// filter
const filterTaskBtn = document.querySelector("#filterTaskBtn");
const filterAll = document.querySelector("#filterAll");
const filterCompleted = document.querySelector("#filterCompleted");
const filterNotCompleted = document.querySelector("#filterNotCompleted");
const filterTaskDropdown = document.querySelector("#filterTaskDropdown");
let filter = "";

const deleteAll = document.querySelector("#deleteAllBtn");

// Toggle visibility dropdown
filterTaskBtn.addEventListener("click", (event) => {
  event.stopPropagation();
  filterTaskDropdown.classList.toggle("hidden");
});

window.addEventListener("click", (event) => {
  if (!filterTaskDropdown.contains(event.target)) {
    filterTaskDropdown.classList.add("hidden");
  }
});

// Filter tugas berdasarkan status
const filterTugas = () => {
  const jsonTugas = JSON.parse(localStorage.getItem("tugas")) || [];
  let filteredTasks = jsonTugas;

  if (filter === "completed") {
    filteredTasks = jsonTugas.filter((todo) => todo.completed);
  } else if (filter === "uncompleted") {
    filteredTasks = jsonTugas.filter((todo) => !todo.completed);
  }

  taskList.innerHTML = "";

  if (filteredTasks.length === 0) {
    emptyToDo.classList.remove("hidden");
  } else {
    emptyToDo.classList.add("hidden");
  }

  filteredTasks.forEach((todo) => {
    const taskItem = document.createElement("li");
    taskItem.classList.add(
      "bg-white",
      "p-4",
      "rounded",
      "shadow-lg",
      "flex",
      "justify-between",
      "items-center"
    );
    taskItem.setAttribute("data-id", todo.id);
    taskItem.innerHTML = `
    <div class="flex items-center">
      <span class="task-text ${
        todo.completed ? "line-through text-gray-400" : "text-gray-800"
      }">${todo.task}</span>
    </div>
    <div class="newBtn flex gap-2">
      <button class="complete-btn bg-green-100 ${
        todo.completed ? "bg-gray-300" : "hover:bg-green-200"
      } text-gray-800 hover:text-gray-900 transition-colors duration-300 flex items-center space-x-1 font-semibold rounded px-2 py-1">
        <i class='bx ${todo.completed ? "bx-undo" : "bx-check-circle"}'></i>
        <span class="text-sm">${todo.completed ? "Uncomplete" : "Complete"}</span>
      </button>
      <button class="edit-btn bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center space-x-2">
        <i class='bx bx-edit'></i>
      </button>
      <button class="delete-btn bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 flex items-center space-x-2">
        <i class='bx bx-trash'></i>
      </button>
    </div>
    `;
    taskList.appendChild(taskItem);
  });
};

// Filter event listeners
filterAll.addEventListener("click", () => {
  filter = "all";
  filterTugas();
  filterTaskDropdown.classList.add("hidden");
});

filterCompleted.addEventListener("click", () => {
  filter = "completed";
  filterTugas();
  filterTaskDropdown.classList.add("hidden");
});

filterNotCompleted.addEventListener("click", () => {
  filter = "uncompleted";
  filterTugas();
  filterTaskDropdown.classList.add("hidden");
});

// Fungsi untuk menghapus semua tugas
const deleteAllTasks = () => {
  if (confirm("Apakah Anda yakin ingin menghapus semua tugas?")) {
    let jsonTugas = JSON.parse(localStorage.getItem("tugas")) || [];
    let todosJson;
    if (filter === "all" || filter === "") {
      todosJson = [];
    } else if (filter === "completed") {
      todosJson = jsonTugas.filter((todo) => !todo.completed);
    } else if (filter === "uncompleted") {
      todosJson = jsonTugas.filter((todo) => !todo.completed);
    }
    localStorage.setItem("tugas", JSON.stringify(todosJson));
    renderTugas();
  }
};

// Event listener untuk tombol delete all
const deleteAllBtn = document.querySelector("#deleteAllBtn");
deleteAllBtn.addEventListener("click", deleteAllTasks);

renderTugas();
