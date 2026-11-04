// Simple in-memory job queue: jobs run one at a time in the background
const jobs = [];
let running = false;

const handlers = {
  sendWelcomeEmail: async ({ username, email }) => {
    await new Promise(resolve => setTimeout(resolve, 2000)); // simulate slow work
    console.log(`[queue] Welcome email sent to ${email} for user ${username} (simulated)`);
  }
};

async function processNext() {
  if (running || jobs.length === 0) return;
  running = true;
  const job = jobs.shift();
  try {
    await handlers[job.name](job.data);
  } catch (err) {
    console.error(`[queue] Job ${job.name} failed:`, err.message);
  }
  running = false;
  processNext();
}

function addJob(name, data) {
  jobs.push({ name, data });
  console.log(`[queue] Job added: ${name}`);
  processNext();
}

module.exports = { addJob };
