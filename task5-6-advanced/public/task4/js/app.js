const app = document.getElementById('app');
const users = []; // temporary list (Task 6 me database aayega)

// ---------- Pages (templates) ----------
const pages = {
  home: () => `
    <div class="page text-center">
      <h1 class="fw-bold">Welcome 👋</h1>
      <p class="lead">Ye ek Single Page App hai. Page reload nahi hota, sirf content badalta hai.</p>
      <a href="#/signup" class="btn btn-primary btn-lg">Create Account</a>
    </div>`,

  signup: () => `
    <div class="page form-card">
      <h3 class="mb-4">Signup</h3>
      <form id="signupForm" novalidate>
        <label class="form-label">Username</label>
        <input type="text" id="username" class="form-control">
        <div class="field-error" id="usernameErr"></div>

        <label class="form-label mt-2">Email</label>
        <input type="email" id="email" class="form-control">
        <div class="field-error" id="emailErr"></div>

        <label class="form-label mt-2">Password</label>
        <div class="input-group">
          <input type="password" id="password" class="form-control">
          <button type="button" class="btn btn-outline-secondary" id="toggleBtn">Show</button>
        </div>
        <div class="strength-track"><div class="strength-bar" id="strengthBar"></div></div>
        <small id="strengthText" class="text-muted"></small>
        <div class="mt-2">
          <div class="rule" id="r-len">Kam se kam 8 characters</div>
          <div class="rule" id="r-upper">Ek uppercase letter</div>
          <div class="rule" id="r-num">Ek number</div>
          <div class="rule" id="r-special">Ek special character (!@#$...)</div>
        </div>

        <label class="form-label mt-3">Confirm Password</label>
        <input type="password" id="confirm" class="form-control">
        <div class="field-error" id="confirmErr"></div>

        <button type="submit" class="btn btn-primary w-100 mt-3">Sign Up</button>
      </form>
      <div id="successMsg" class="alert alert-success mt-3 d-none"></div>
    </div>`,

  users: () => `
    <div class="page">
      <h3 class="mb-4">Registered Users</h3>
      <div id="userList">
        ${users.length === 0
          ? '<p class="text-muted">Abhi koi user nahi hai.</p>'
          : users.map((u, i) => `
              <div class="user-card">
                <div><strong>${escapeHtml(u.username)}</strong><br><small>${escapeHtml(u.email)}</small></div>
                <button class="btn btn-sm btn-outline-danger" data-index="${i}">Delete</button>
              </div>`).join('')}
      </div>
    </div>`
};

// XSS se bachne ke liye user input ko escape karte hain
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// ---------- Router ----------
function router() {
  const route = (location.hash.replace('#/', '') || 'home');
  const page = pages[route] ? route : 'home';
  app.innerHTML = pages[page]();

  document.querySelectorAll('.nav-link-spa').forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#/' + page);
  });

  if (page === 'signup') initSignup();
  if (page === 'users') initUsers();
  document.getElementById('userCount').textContent = users.length;
}
window.addEventListener('hashchange', router);
window.addEventListener('load', router);

// ---------- Signup logic ----------
function checkPassword(pw) {
  return {
    len: pw.length >= 8,
    upper: /[A-Z]/.test(pw),
    num: /[0-9]/.test(pw),
    special: /[^A-Za-z0-9]/.test(pw)
  };
}

function initSignup() {
  const form = document.getElementById('signupForm');
  const pw = document.getElementById('password');
  const bar = document.getElementById('strengthBar');
  const text = document.getElementById('strengthText');

  // Live password strength (DOM har keystroke pe update)
  pw.addEventListener('input', () => {
    const r = checkPassword(pw.value);
    document.getElementById('r-len').classList.toggle('ok', r.len);
    document.getElementById('r-upper').classList.toggle('ok', r.upper);
    document.getElementById('r-num').classList.toggle('ok', r.num);
    document.getElementById('r-special').classList.toggle('ok', r.special);

    const score = Object.values(r).filter(Boolean).length;
    const levels = [
      { w: '0%',   c: '#e0e0e0', t: '' },
      { w: '25%',  c: '#e74c3c', t: 'Weak' },
      { w: '50%',  c: '#e67e22', t: 'Fair' },
      { w: '75%',  c: '#f1c40f', t: 'Good' },
      { w: '100%', c: '#27ae60', t: 'Strong' }
    ];
    const lv = pw.value ? levels[score] : levels[0];
    bar.style.width = lv.w;
    bar.style.background = lv.c;
    text.textContent = lv.t ? 'Strength: ' + lv.t : '';
  });

  // Show/Hide password
  document.getElementById('toggleBtn').addEventListener('click', e => {
    const hidden = pw.type === 'password';
    pw.type = hidden ? 'text' : 'password';
    e.target.textContent = hidden ? 'Hide' : 'Show';
  });

  // Submit validation
  form.addEventListener('submit', e => {
    e.preventDefault();
    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const confirm = document.getElementById('confirm').value;
    let valid = true;

    const setErr = (id, msg) => { document.getElementById(id).textContent = msg; if (msg) valid = false; };

    setErr('usernameErr', /^[a-zA-Z0-9_]{4,15}$/.test(username) ? '' : '4-15 characters, sirf letters, numbers, underscore.');
    setErr('emailErr', /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? '' : 'Sahi email daalo.');
    const r = checkPassword(pw.value);
    setErr('confirmErr', pw.value === confirm ? '' : 'Passwords match nahi karte.');
    if (!(r.len && r.upper && r.num && r.special)) {
      valid = false;
      document.getElementById('strengthText').textContent = 'Password saari rules poori kare.';
    }
    if (users.some(u => u.username.toLowerCase() === username.toLowerCase())) {
      setErr('usernameErr', 'Ye username pehle se hai.');
    }

    if (valid) {
      users.push({ username, email });
      document.getElementById('userCount').textContent = users.length;
      form.reset();
      const msg = document.getElementById('successMsg');
      msg.textContent = 'Account ban gaya! Users page pe dekho.';
      msg.classList.remove('d-none');
      setTimeout(() => { location.hash = '#/users'; }, 1200);
    }
  });
}

// ---------- Users page ----------
function initUsers() {
  document.getElementById('userList').addEventListener('click', e => {
    if (e.target.dataset.index !== undefined) {
      users.splice(Number(e.target.dataset.index), 1);
      router(); // list dobara draw
    }
  });
}