// 할 일 적기
const inputForm = document.querySelector(".sumbit-todos");
const inputText = inputForm.querySelector("input");
const inputListDiv = document.querySelector(".todo-content");

let todos = [];
const TODOLIST_KEY = 'todolist';
let id = 0;

// Select All 버튼 이벤트 처리
const doneListsAll = document.querySelector(".btn-select-all");
function handleDoneAllClicked(event){
    for(let i = 0; i < todos.length; i++){
        todos[i].done = true;
        checkListDone(todos[i]);
    }
    saveToDo();
    countDoneList();
    countLeftList();
}
doneListsAll.addEventListener('click', handleDoneAllClicked);

// Delete All 버튼 이벤트 처리
const deleteListsAll = document.querySelector(".btn-delete-all");
function handleDeleteAllClicked(event){
    // 할일리스트 todos와 localStorage 비우기
    todos = [];
    saveToDo();
    id = 0;     // 할일 전부 삭제하고 다시 입력할 때 --> id 값도 0이 됨
    // 화면에서 삭제하기
    const allLists = inputListDiv.children;
    for(let i = allLists.length-1; i > -1; i--){    // 0부터 allLists.length-1하면 id 관련 문제 발생 --> 다 안 지워짐! 따라서 뒤에서부터 삭제하면 됨
        allLists[i].remove();
    }
    countAllList();
    countDoneList();
    countLeftList();
}
deleteListsAll.addEventListener('click', handleDeleteAllClicked);


// 항목 한 개 끝내는 것 처리
function handleBtn1Clicked(event){
    const element = event.target.parentElement;
    const doneListId = element.id;
    for(let i = 0; i < todos.length; i++){
        if((todos[i].id) === doneListId){
            if(todos[i].done === false){
                todos[i].done = true;
            } else{
                todos[i].done = false;
            }
        }
    }
    checkListDone(element);
    saveToDo();
    countDoneList();
    countLeftList();
}

function checkListDone(checkList){
    const list = inputListDiv.querySelector(`#${checkList.id}`);
    for(let i = 0; i < todos.length; i++){
        if((todos[i].id) === list.id){
            if(todos[i].done === false){
                list.classList.remove("doneList");
            }else{
                list.classList.add("doneList");
            }
        }
    }
}

// 발생했던 문제 : 중간에 있는 할 일 삭제하면 id가 붕 뜨는 현상 발생
// --> 해결: 삭제할 때마다 reSetId 함수 호출해서 메서드 id값 옳게 정해준다.
function handleBtn2Clicked(event){
    const removeList = event.target.parentElement;
    removeList.remove();
    todos = todos.filter((list) => list.id != removeList.id);
    saveToDo();     // 개별 삭제 버튼 누른 리스트 항목 제외한 todos 배열 다시 localStorage에 세이브해야 화면에서 사라진 것 새로고침해도 유지됨
    reSetId();
    countAllList();
    countDoneList();
    countLeftList();
}

function showAgain(toDoList){
    if(toDoList != null){
        const parsedToDo = JSON.parse(toDoList);
        todos = parsedToDo;
        // console.log(parsedToDo);
        parsedToDo.forEach(todo => showToDoWindow(todo));
    }
}

function saveToDo(){
    localStorage.setItem(TODOLIST_KEY, JSON.stringify(todos));
}

function showToDoWindow(newToDoObj){
    const list = document.createElement('div');
    list.classList.add('listClass');
    list.id = newToDoObj.id;
    const btn1 = document.createElement('button');
    btn1.classList.add("btn-done");
    btn1.innerText = '';
    btn1.addEventListener('click', handleBtn1Clicked);
    const text = document.createElement('span');
    text.classList.add('textClass');
    text.innerText = newToDoObj.text;
    const btn2 = document.createElement('button');
    btn2.innerText = 'X';
    btn2.classList.add("btn-delete");
    btn2.addEventListener("click", handleBtn2Clicked);
    list.appendChild(btn1);
    list.appendChild(text);
    list.appendChild(btn2);
    inputListDiv.appendChild(list);
    checkListDone(newToDoObj);
}

function handleSumbitForm(event){
    event.preventDefault();
    const todoInput = inputText.value;
    inputText.value = "";
    console.log(`list${id}`);
    const newToDoObj = {
        "id": `list${id}`,
        "text": todoInput,
        "done": false
    }
    id++;
    todos.push(newToDoObj);
    showToDoWindow(newToDoObj);
    saveToDo();
    countAllList();     // 할 일 추가하면 total에 변화 생기므로 여기에 추가
    countLeftList();
}
inputForm.addEventListener("submit", handleSumbitForm);

const toDoList = localStorage.getItem(TODOLIST_KEY);
showAgain(toDoList);

// localStorage.length가 자꾸 1이 나왔는데, 그 이유 생각해보면 stringfy해서 저장해서 그런 것임
if(localStorage.getItem(TODOLIST_KEY) != null){
    // console.log(todos.length);
    id = todos.length;
}

function reSetId(){
    for(let i = 0; i < todos.length; i++){
        todos[i].id = `list${i}`;
        saveToDo();
    }
}

// 할일 총 몇 개인지 알려주기
const cntAll = document.querySelector(".cnt-all");
function countAllList(){
    cntAll.innerText = `Total: ${todos.length}`;
}
countAllList();

// 완료 항목 몇 개인지 알려주기
const cntDone = document.querySelector(".cnt-done");
function countDoneList(){
    let cnt = 0;
    for(let i = 0; i < todos.length; i++){
        if(todos[i].done === true){
            cnt++;
        }
    }
    cntDone.innerText = `Done: ${cnt}`;
}
countDoneList();

// 남은 항목 몇 개인지 알려주기
const cntLeft = document.querySelector(".cnt-left");
function countLeftList(){
    let cnt = 0;
    for(let i = 0; i < todos.length; i++){
        if(todos[i].done === false){
            cnt++;
        }
    }
    cntLeft.innerText = `Left: ${cnt}`;
}
countLeftList();