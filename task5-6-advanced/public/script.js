const authBox = document.getElementById('authBox');
const taskBox = document.getElementById('taskBox');
const authForm = document.getElementById('authForm');
const authTitle = document.getElementById('authTitle');
const authBtn = document.getElementById('authBtn');
const authMsg = document.getElementById('authMsg');
const switchLink = document.getElementById('switchLink');
const usernameInput = document.getElementById('username');

const list = document.getElementById('taskList');
const taskForm = document.getElementById('taskForm');
const taskInput = document.getElementById('taskInput');
const message = document.getElementById('message');

let isSignup = false;

const getToken = () => localStorage.getItem('token');

async function api(url, method = 'GET', body) {
  const res = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + getToken()
    },
    body: body ? JSON.stringify(body) : undefined
  });
  const data = await res.json();
  if (res.status === 401) { logout(); }
  return { ok: res.ok, data };
}

switchLink.onclick = e => {
  e.preventDefault();
  isSignup = !isSignup;
  authTitle.textContent = isSignup ? 'Signup' : 'Login';
  authBtn.textContent = isSignup ? 'Signup' : 'Login';
  usernameInput.style.display = isSignup ? 'block' : 'none';
  switchLink.textContent = isSignup ? 'Account hai? Login karo' : 'Account nahi hai? Signup karo';
  authMsg.textContent = '';
};

authForm.addEventListener('submit', async e => {
  e.preventDefault();
  const url = isSignup ? '/api/auth/signup' : '/api/auth/login';
  const body = {
    email: document.getElementById('email').value,
    password: document.getElementById('password').value
  };
  if (isSignup) body.username = usernameInput.value;

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  const data = await res.json();

  if (!res.ok) { authMsg.textContent = data.error; return; }

  localStorage.setItem('token', data.token);
  localStorage.setItem('username', data.username);
  authForm.reset();
  showApp();
});

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('username');
  showAuth();
}
document.getElementById('logoutLink').onclick = e => { e.preventDefault(); logout(); };

function showAuth() {
  authBox.style.display = 'block';
  taskBox.style.display = 'none';
}

function showApp() {
  authBox.style.display = 'none';
  taskBox.style.display = 'block';
  document.getElementById('welcome').textContent = localStorage.getItem('username');
  loadTasks();
}

async function loadTasks() {
  const { ok, data } = await api('/api/tasks');
  if (!ok) return;
  list.innerHTML = '';
  data.forEach(t => {
    const li = document.createElement('li');
    if (t.done) li.classList.add('done');

    const check = document.createElement('input');
    check.type = 'checkbox';
    check.checked = t.done;
    check.onchange = () => updateTask(t._id, { done: check.checked });

    const span = document.createElement('span');
    span.textContent = t.title;

    const edit = document.createElement('button');
    edit.textContent = 'Edit';
    edit.className = 'edit';
    edit.onclick = () => {
      const title = prompt('Naya title:', t.title);
      if (title !== null) updateTask(t._id, { title });
    };

    const del = document.createElement('button');
    del.textContent = 'Delete';
    del.className = 'del';
    del.onclick = () => deleteTask(t._id);

    li.append(check, span, edit, del);
    list.appendChild(li);
  });
}

taskForm.addEventListener('submit', async e => {
  e.preventDefault();
  const { ok, data } = await api('/api/tasks', 'POST', { title: taskInput.value });
  message.textContent = ok ? '' : data.error;
  if (ok) taskInput.value = '';
  loadTasks();
});

async function updateTask(id, changes) {
  const { ok, data } = await api('/api/tasks/' + id, 'PUT', changes);
  message.textContent = ok ? '' : data.error;
  loadTasks();
}

async function deleteTask(id) {
  await api('/api/tasks/' + id, 'DELETE');
  loadTasks();
}

if (getToken()) showApp(); else showAuth();