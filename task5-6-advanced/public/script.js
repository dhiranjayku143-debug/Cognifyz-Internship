const API = '/api/tasks';
const list = document.getElementById('taskList');
const form = document.getElementById('taskForm');
const input = document.getElementById('taskInput');
const message = document.getElementById('message');

async function loadTasks() {
  const res = await fetch(API);
  const tasks = await res.json();
  list.innerHTML = '';
  tasks.forEach(t => {
    const li = document.createElement('li');
    if (t.done) li.classList.add('done');

    const check = document.createElement('input');
    check.type = 'checkbox';
    check.checked = t.done;
    check.onchange = () => updateTask(t.id, { done: check.checked });

    const span = document.createElement('span');
    span.textContent = t.title; // textContent = XSS safe

    const edit = document.createElement('button');
    edit.textContent = 'Edit';
    edit.className = 'edit';
    edit.onclick = () => {
      const title = prompt('Naya title:', t.title);
      if (title !== null) updateTask(t.id, { title });
    };

    const del = document.createElement('button');
    del.textContent = 'Delete';
    del.className = 'del';
    del.onclick = () => deleteTask(t.id);

    li.append(check, span, edit, del);
    list.appendChild(li);
  });
}

form.addEventListener('submit', async e => {
  e.preventDefault();
  const res = await fetch(API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: input.value })
  });
  const data = await res.json();
  message.textContent = res.ok ? '' : data.error;
  if (res.ok) input.value = '';
  loadTasks();
});

async function updateTask(id, changes) {
  const res = await fetch(`${API}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(changes)
  });
  const data = await res.json();
  message.textContent = res.ok ? '' : data.error;
  loadTasks();
}

async function deleteTask(id) {
  await fetch(`${API}/${id}`, { method: 'DELETE' });
  loadTasks();
}

loadTasks();