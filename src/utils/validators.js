export const isValidEmail = (v = '') => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());

export const validateUrl = (raw = '') => {
  const v = raw.trim();
  if (!v) return 'Enter a website URL.';
  let u;
  try { u = new URL(v); } catch { return 'Enter a valid URL that starts with http:// or https://'; }
  if (!['http:', 'https:'].includes(u.protocol) || !u.hostname.includes('.')) return 'Enter a valid URL that starts with http:// or https://';
  return '';
};

export const validateLogin = ({ email, password }) => {
  const e = {};
  if (!email.trim()) e.email = 'Email is required.';
  else if (!isValidEmail(email)) e.email = 'Enter a valid email address.';
  if (!password) e.password = 'Password is required.';
  return e;
};

export const validateRegister = ({ name, email, password, confirm }) => {
  const e = {};
  if (!name.trim()) e.name = 'Full name is required.';
  if (!email.trim()) e.email = 'Email is required.';
  else if (!isValidEmail(email)) e.email = 'Enter a valid email address.';
  if (!password) e.password = 'Password is required.';
  else if (password.length < 8) e.password = 'Use at least 8 characters.';
  if (!confirm) e.confirm = 'Confirm your password.';
  else if (confirm !== password) e.confirm = 'Passwords do not match.';
  return e;
};

export const validateEmailForm = ({ sender, receiver, body }) => {
  const e = {};
  if (!sender.trim()) e.sender = 'Sender address is required.';
  else if (!isValidEmail(sender)) e.sender = 'Enter a valid sender address.';
  if (receiver.trim() && !isValidEmail(receiver)) e.receiver = 'Enter a valid receiver address.';
  if (!body.trim()) e.body = 'Email body is required.';
  else if (body.trim().length < 20) e.body = 'Add more of the email body (at least 20 characters).';
  return e;
};
