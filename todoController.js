
const url = "https://prashant-todo-app.herokuapp.com/user";
var taskToEdit = -1;
let currentTasks =[];
let editing = false;
getAll();
closeForm();

// Add a "checked" symbol when clicking on a list item
var list = document.querySelector('ul');
list.addEventListener('click', function(ev) {
    if(editing==false){
        let flag = true;
        if(ev.target.classList.value=='checked'){
            flag=false;
        }
        let elementId = ev.target.getAttribute('elid');
        if (ev.target.tagName === 'LI') {
            ev.target.classList.toggle('checked');
        }
        checkUncheckTask(elementId, flag);
    }
}, false);

// search taska..............
var search = document.getElementById('searching')
search.addEventListener("keyup", (e)=> {  
    let filteredTask =  currentTasks.filter(elem => {
        return elem.title.match(search.value.toLowerCase())
        
    })

    list.innerHTML='';
    for(key in filteredTask){
        newElement(filteredTask[key]);
    }
 
})

// Get all element from json db
function getAll() {
     fetch(`${url}`)
    .then(res => res.json())
    .then(data => {

        if(data.length!=0){
            list.innerHTML=''
            currentTasks = data;
            for(key in data){
                newElement(data[key]);
            }
        }
        else{
            alert('No Task Found');
        }

    });
}

// UpdateTask for title
function updateTask(){
    
    document.querySelector(`.header`).classList.remove(`blur`);
    document.querySelector(`.maincont`).classList.remove(`blur`);
    document.querySelector(`#todoList`).classList.remove(`blur`);
    var editTaskFrom = document.getElementById("taskFrom");
    var nameValue = document.getElementById("editedTaskName").value.toLowerCase().trim();

    let filter = currentTasks?.filter(elem => {
        return elem.title === nameValue
    })
    if (filter.length === 0) {
        nameValue && fetch(`${url}/${taskToEdit}`,{
            method: "PATCH",
            headers: {
             "Content-Type": "application/json"
         },
         body: JSON.stringify({
             title: nameValue
         })
        })
       .then(res => {
           closeForm();
           getAll();
    
        }) 
    }else{
        alert("Duplicate task found")
    }
    
 }

 function checkUncheckTask(taskId, value){
    fetch(`${url}/${taskId}`,{
        method: "PATCH",
        headers: {
         "Content-Type": "application/json"
     },
     body: JSON.stringify({
        checked: value
     })
    })
   .then(res => {
      
    })
 }


 function openForm(e) {

    document.querySelector(`.header`).classList.add(`blur`);
    document.querySelector(`.maincont`).classList.add(`blur`);
    document.querySelector(`#todoList`).classList.add(`blur`);
     
    taskToEdit = e.target.id;
    let result = currentTasks.find(elem => {
        return elem.id == taskToEdit
    })
    document.getElementById("editedTaskName").value = result.title;
    document.getElementById("taskForm").style.display = "block";
    editing=true;
  }
  
  function closeForm() {
    editing=false;
    document.getElementById("taskForm").style.display = "none";
    document.querySelector(`.header`).classList.remove(`blur`);
    document.querySelector(`.maincont`).classList.remove(`blur`);
    document.querySelector(`#todoList`).classList.remove(`blur`);
  }

// deleteTask 
function deleteTask(e){
    
    fetch(`${url}/${e.target.id}`,{
        method: "DELETE",
    })
    .then(res =>{ 
     res.json() 
     getAll()
     window.location.reload()
    })
}

// Get All checked task
function getChecked() {
    fetch(`${url}?checked=true`)
    .then(res => res.json())
    .then(data => {
        list.innerHTML=''
        for(key in data){
            newElement(data[key]);
        }
    });
}

// get all unchecked task
function getUnChecked() {
    fetch(`${url}?checked=false`)
    .then(res => res.json())
    .then(data => {
        list.innerHTML=''
        for(key in data){
            newElement(data[key]);
        }
    });
}

// Add New Task when clicking on the "Add" button
async  function addNewTask () {
    if (!document.getElementById("taskName").value.length) {
        alert('Your Input is Empty')
    } else {
        var titlevalue = document.getElementById("taskName").value.toLowerCase().trim();
    console.log({titlevalue})
    if(!titlevalue == " "){
        // let res = await fetch(url)
        // let dd = await res.json(); 
        // let result = dd.find(elem => {
        //     return elem.title === titlevalue
        // }) 
        let filter = currentTasks?.filter(elem => {
            return elem.title === titlevalue
        })
       if(filter.length==0){
           fetch(url, {
                method: "post",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    title: titlevalue,
                    checked:false
                }) 
            })
            .then(res => res.json())
            .then(data =>{
            
                getAll();
            })
        }else{
            document.getElementById("taskName").value=" "
            alert("Duplicate Element Found");
            
        }
     
    }
    else{
        console.log("Invalid Name")    
    }
    }
   
    
}

document.getElementById('taskName').addEventListener('keyup', (e)=> {
  if (e.key === "Enter") {
      addNewTask();
      document.getElementById('taskName').value =""
  }
})


// Create a new list item 
function newElement(data) {
    var li = document.createElement("li");
    li.setAttribute('elId', data.id);
    var t = document.createTextNode(data.title);
    li.appendChild(t);
    document.getElementById("todoList").appendChild(li);
  
    var span = document.createElement("SPAN");
    var txt = document.createTextNode("Delete");
    var updateIcon = document.createElement("i");
    updateIcon.setAttribute('class', 'bx bx-message-square-x');
    //<i class='bx bx-message-square-x'></i>
    span.className = "close";
    span.id = data.id;
    span.appendChild(updateIcon);
    span.appendChild(txt);
    span.onclick = deleteTask;
    li.appendChild(span);

    var updateTaskSpan = document.createElement("SPAN")
    var updateTxt = document.createTextNode("Edit");
    var updateIcon = document.createElement("i");
    updateIcon.setAttribute('class', 'bx bxs-edit');
    updateTaskSpan.className="edit"
    updateTaskSpan.id = data.id;
    updateTaskSpan.appendChild(updateIcon)
    updateTaskSpan.appendChild(updateTxt)
    updateTaskSpan.onclick = openForm;
    li.appendChild(updateTaskSpan)


    // Check task if checked flag is true;
    if(data.checked)
        li.classList.toggle('checked');
}



