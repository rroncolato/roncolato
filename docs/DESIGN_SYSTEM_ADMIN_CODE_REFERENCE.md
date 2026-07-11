# 💻 Design System Admin LIGHT — Code Reference

**Quick Copy-Paste Guide para Implementação Rápida**

---

## 🔄 CSS Variables Complete Set

```css
/* Copie para seu arquivo CSS global ou <style> tag */

:root {
  /* ===== COLORS ===== */
  /* Primary */
  --color-white: #FFFFFF;
  --color-black: #1A1A1A;
  --color-yellow: #F5C518;

  /* Grays (11 shades) */
  --color-gray-50: #F9F9F9;
  --color-gray-100: #F3F3F3;
  --color-gray-200: #E8E8E8;
  --color-gray-300: #D4D4D4;
  --color-gray-400: #BDBDBD;
  --color-gray-500: #909090;
  --color-gray-600: #666666;
  --color-gray-700: #4A4A4A;
  --color-gray-800: #2D2D2D;
  --color-gray-900: #1A1A1A;

  /* Semantic */
  --color-success: #10B981;
  --color-error: #EF4444;
  --color-warning: #F59E0B;
  --color-info: #3B82F6;

  /* Backgrounds */
  --bg-primary: #FFFFFF;
  --bg-secondary: #F9F9F9;
  --bg-tertiary: #F3F3F3;
  --bg-overlay: rgba(0, 0, 0, 0.5);

  /* Text */
  --text-primary: #1A1A1A;
  --text-secondary: #4A4A4A;
  --text-tertiary: #909090;
  --text-disabled: #BDBDBD;

  /* Borders */
  --border-color: #E8E8E8;
  --border-color-dark: #D4D4D4;

  /* ===== TYPOGRAPHY ===== */
  --font-family: 'Jost', sans-serif;
  --font-weight-light: 300;
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  --font-weight-extrabold: 900;

  --font-size-xs: 11px;
  --font-size-sm: 12px;
  --font-size-base: 14px;
  --font-size-lg: 16px;
  --font-size-xl: 20px;
  --font-size-2xl: 24px;
  --font-size-3xl: 28px;
  --font-size-4xl: 32px;

  --line-height-tight: 1.2;
  --line-height-normal: 1.4;
  --line-height-relaxed: 1.6;

  /* ===== SPACING ===== */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;
  --space-2xl: 40px;
  --space-3xl: 48px;
  --space-4xl: 64px;

  /* ===== RADIUS ===== */
  --radius-none: 0;
  --radius-sm: 2px;
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-full: 9999px;

  /* ===== SHADOWS ===== */
  --shadow-none: none;
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 1px 3px rgba(0, 0, 0, 0.05);
  --shadow-lg: 0 4px 12px rgba(0, 0, 0, 0.08);
  --shadow-xl: 0 10px 25px rgba(0, 0, 0, 0.1);
  --shadow-2xl: 0 20px 25px rgba(0, 0, 0, 0.15);
  --shadow-yellow: 0 4px 12px rgba(245, 197, 24, 0.3);
  --shadow-focus: 0 0 0 3px rgba(245, 197, 24, 0.1);
  --shadow-focus-error: 0 0 0 3px rgba(239, 68, 68, 0.1);

  /* ===== TRANSITIONS ===== */
  --ease-in: cubic-bezier(0.4, 0, 1, 1);
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);

  --duration-fast: 150ms;
  --duration-normal: 250ms;
  --duration-slow: 350ms;
}

/* Dark mode support (optional) */
@media (prefers-color-scheme: dark) {
  :root {
    --bg-primary: #1A1A1A;
    --bg-secondary: #2D2D2D;
    --text-primary: #F9F9F9;
    --text-secondary: #BDBDBD;
    --border-color: #404040;
  }
}
```

---

## 🎨 Componente: Button

### HTML

```html
<!-- Primary Button (CTA) -->
<button class="btn btn-primary">Publish Project</button>

<!-- Secondary Button -->
<button class="btn btn-secondary">Cancel</button>

<!-- Outline Button -->
<button class="btn btn-outline">Learn More</button>

<!-- Danger Button -->
<button class="btn btn-danger">Delete</button>

<!-- Button Loading State -->
<button class="btn btn-primary" disabled>
  <span class="spinner"></span>
  Saving...
</button>

<!-- Button with Icon -->
<button class="btn btn-primary">
  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
    <path d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" />
  </svg>
  Add New
</button>
```

### CSS

```css
/* Base Button */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-sm);
  padding: 12px 24px;
  font-family: var(--font-family);
  font-weight: var(--font-weight-bold);
  font-size: var(--font-size-sm);
  letter-spacing: 0.05em;
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-out);
  text-decoration: none;
}

/* Button Variants */
.btn-primary {
  background-color: var(--color-yellow);
  color: var(--color-black);
  box-shadow: var(--shadow-yellow);
}

.btn-primary:hover {
  opacity: 0.85;
  transform: translateY(-1px);
}

.btn-primary:active {
  transform: translateY(0);
  opacity: 0.7;
}

.btn-primary:focus-visible {
  outline: 2px solid var(--color-yellow);
  outline-offset: 2px;
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

/* Secondary Button */
.btn-secondary {
  background-color: var(--bg-secondary);
  color: var(--text-primary);
  border: 1px solid var(--border-color-dark);
}

.btn-secondary:hover {
  background-color: var(--bg-tertiary);
  border-color: var(--color-gray-400);
}

.btn-secondary:active {
  background-color: var(--color-gray-200);
}

/* Outline Button */
.btn-outline {
  background-color: transparent;
  color: var(--color-yellow);
  border: 1px solid var(--color-yellow);
}

.btn-outline:hover {
  background-color: var(--color-yellow);
  color: var(--color-black);
}

/* Danger Button */
.btn-danger {
  background-color: var(--color-error);
  color: white;
}

.btn-danger:hover {
  opacity: 0.85;
}

.btn-danger:active {
  opacity: 0.7;
}

/* Button Sizes */
.btn-sm {
  padding: 8px 16px;
  font-size: var(--font-size-xs);
}

.btn-lg {
  padding: 16px 32px;
  font-size: var(--font-size-base);
}

/* Loading spinner */
.btn:disabled .spinner {
  display: inline-block;
  width: 14px;
  height: 14px;
  border: 2px solid rgba(0, 0, 0, 0.2);
  border-top-color: currentColor;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
```

### Tailwind

```html
<!-- Primary -->
<button class="px-lg py-sm bg-yellow text-black font-bold text-sm rounded hover:opacity-85 active:opacity-70 transition-all duration-fast shadow-btn-yellow">
  Publish Project
</button>

<!-- Secondary -->
<button class="px-lg py-sm bg-gray-100 text-black border border-gray-300 font-semibold text-sm rounded hover:bg-gray-200 transition-all">
  Cancel
</button>

<!-- Outline -->
<button class="px-lg py-sm border border-yellow text-yellow bg-transparent font-semibold text-sm rounded hover:bg-yellow hover:text-black transition-all">
  Learn More
</button>
```

---

## 📝 Componente: Form Input

### HTML

```html
<!-- Text Input -->
<div class="form-group">
  <label for="project-name" class="form-label">Project Name *</label>
  <input
    type="text"
    id="project-name"
    class="form-input"
    placeholder="Enter project name"
    required
  >
  <span class="form-hint">Maximum 100 characters</span>
</div>

<!-- With Error State -->
<div class="form-group">
  <label for="email" class="form-label">Email Address *</label>
  <input
    type="email"
    id="email"
    class="form-input form-error"
    placeholder="your@email.com"
    aria-invalid="true"
    aria-describedby="email-error"
  >
  <span class="form-error-message" id="email-error">
    Please enter a valid email address
  </span>
</div>

<!-- Textarea -->
<div class="form-group">
  <label for="description" class="form-label">Description *</label>
  <textarea
    id="description"
    class="form-input"
    placeholder="Enter project description"
    rows="5"
  ></textarea>
  <span class="form-hint">Maximum 500 characters</span>
</div>

<!-- Select -->
<div class="form-group">
  <label for="category" class="form-label">Category *</label>
  <select id="category" class="form-input" required>
    <option value="">Select a category</option>
    <option value="corporate">Corporate</option>
    <option value="headshots">Headshots</option>
    <option value="events">Events</option>
  </select>
</div>

<!-- Checkbox -->
<div class="form-group">
  <label class="form-checkbox">
    <input type="checkbox" class="form-checkbox-input">
    <span>Featured on homepage</span>
  </label>
</div>

<!-- Radio -->
<div class="form-group">
  <label class="form-label">Status</label>
  <div class="space-y-md">
    <label class="form-radio">
      <input type="radio" name="status" value="draft" checked>
      <span>Draft</span>
    </label>
    <label class="form-radio">
      <input type="radio" name="status" value="published">
      <span>Published</span>
    </label>
  </div>
</div>
```

### CSS

```css
.form-group {
  margin-bottom: var(--space-lg);
}

.form-label {
  display: block;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary);
  margin-bottom: var(--space-md);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.form-input,
.form-textarea,
.form-select {
  width: 100%;
  padding: var(--space-sm) var(--space-md);
  font-family: var(--font-family);
  font-size: var(--font-size-base);
  color: var(--text-primary);
  background-color: var(--bg-primary);
  border: 1px solid var(--border-color-dark);
  border-radius: var(--radius-md);
  transition: all var(--duration-fast);
}

.form-input:hover,
.form-textarea:hover,
.form-select:hover {
  border-color: var(--color-gray-500);
}

.form-input:focus,
.form-textarea:focus,
.form-select:focus {
  outline: none;
  border-color: var(--color-yellow);
  box-shadow: var(--shadow-focus);
}

.form-input::placeholder {
  color: var(--color-gray-400);
}

.form-input:disabled,
.form-textarea:disabled,
.form-select:disabled {
  background-color: var(--bg-secondary);
  color: var(--text-disabled);
  cursor: not-allowed;
}

.form-input[type="file"] {
  padding: var(--space-md);
}

/* Error State */
.form-error {
  border-color: var(--color-error) !important;
  box-shadow: var(--shadow-focus-error) !important;
}

.form-error-message {
  display: block;
  margin-top: var(--space-sm);
  color: var(--color-error);
  font-size: var(--font-size-sm);
}

/* Success State */
.form-success {
  border-color: var(--color-success) !important;
}

/* Hint/Help Text */
.form-hint {
  display: block;
  margin-top: var(--space-sm);
  color: var(--text-tertiary);
  font-size: var(--font-size-xs);
}

/* Checkbox */
.form-checkbox {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  cursor: pointer;
}

.form-checkbox-input {
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: var(--color-yellow);
}

/* Radio */
.form-radio {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  cursor: pointer;
}

.form-radio input[type="radio"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: var(--color-yellow);
}
```

---

## 🎯 Componente: Card

### HTML

```html
<div class="card">
  <h3 class="card-title">Add New Project</h3>
  <p class="card-description">Fill in the details below to add a new project to your portfolio.</p>

  <div class="card-content">
    <!-- Form or content here -->
  </div>

  <div class="card-footer">
    <button class="btn btn-secondary">Cancel</button>
    <button class="btn btn-primary">Save Project</button>
  </div>
</div>

<!-- Card Grid -->
<div class="card-grid">
  <div class="card card-sm">
    <h4 class="card-title">12</h4>
    <p class="card-subtitle">Total Projects</p>
  </div>
  <div class="card card-sm">
    <h4 class="card-title">8</h4>
    <p class="card-subtitle">Published</p>
  </div>
  <div class="card card-sm">
    <h4 class="card-title">4</h4>
    <p class="card-subtitle">Drafts</p>
  </div>
</div>
```

### CSS

```css
.card {
  background-color: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: var(--space-lg);
  box-shadow: var(--shadow-sm);
  transition: all var(--duration-normal);
}

.card:hover {
  border-color: var(--border-color-dark);
  box-shadow: var(--shadow-lg);
}

.card-title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--text-primary);
  margin: 0 0 var(--space-sm) 0;
}

.card-subtitle {
  font-size: var(--font-size-base);
  color: var(--text-secondary);
  margin: 0 0 var(--space-md) 0;
}

.card-description {
  font-size: var(--font-size-base);
  color: var(--text-secondary);
  margin-bottom: var(--space-lg);
  line-height: var(--line-height-relaxed);
}

.card-content {
  margin-bottom: var(--space-lg);
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: var(--space-md);
  padding-top: var(--space-md);
  border-top: 1px solid var(--border-color);
}

/* Card Sizes */
.card-sm {
  padding: var(--space-md);
}

.card-lg {
  padding: var(--space-2xl);
}

/* Card Grid */
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--space-lg);
  margin-bottom: var(--space-2xl);
}

/* Compact Card Style */
.card-compact {
  padding: var(--space-md);
  border-radius: var(--radius-md);
}
```

---

## 🚨 Componente: Alert

### HTML

```html
<!-- Success Alert -->
<div class="alert alert-success">
  <svg class="alert-icon" fill="currentColor" viewBox="0 0 20 20">
    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
  </svg>
  <div class="alert-content">
    <div class="alert-title">Success!</div>
    <div class="alert-description">Your project has been published successfully.</div>
  </div>
</div>

<!-- Error Alert -->
<div class="alert alert-error">
  <svg class="alert-icon" fill="currentColor" viewBox="0 0 20 20">
    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
  </svg>
  <div class="alert-content">
    <div class="alert-title">Error</div>
    <div class="alert-description">Something went wrong. Please try again.</div>
  </div>
</div>

<!-- Warning Alert -->
<div class="alert alert-warning">
  <svg class="alert-icon" fill="currentColor" viewBox="0 0 20 20">
    <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
  </svg>
  <div class="alert-content">
    <div class="alert-title">Warning</div>
    <div class="alert-description">This action may have unintended consequences.</div>
  </div>
</div>

<!-- Info Alert -->
<div class="alert alert-info">
  <svg class="alert-icon" fill="currentColor" viewBox="0 0 20 20">
    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
  </svg>
  <div class="alert-content">
    <div class="alert-title">Info</div>
    <div class="alert-description">This project will be visible on your public portfolio.</div>
  </div>
</div>
```

### CSS

```css
.alert {
  padding: var(--space-md) var(--space-lg);
  border-radius: var(--radius-md);
  border: 1px solid transparent;
  display: flex;
  gap: var(--space-md);
  align-items: flex-start;
  margin-bottom: var(--space-lg);
}

.alert-success {
  background-color: #ECFDF5;
  border-color: #D1FAE5;
  color: #047857;
}

.alert-error {
  background-color: #FEF2F2;
  border-color: #FECACA;
  color: #DC2626;
}

.alert-warning {
  background-color: #FFFBEB;
  border-color: #FCD34D;
  color: #B45309;
}

.alert-info {
  background-color: #EFF6FF;
  border-color: #BFDBFE;
  color: #1E40AF;
}

.alert-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  margin-top: 2px;
}

.alert-content {
  flex: 1;
}

.alert-title {
  font-weight: var(--font-weight-bold);
  margin-bottom: 2px;
}

.alert-description {
  font-size: var(--font-size-sm);
  opacity: 0.9;
  line-height: var(--line-height-normal);
}
```

---

## 📊 Componente: Table

### HTML

```html
<table class="table">
  <thead>
    <tr>
      <th>Project Name</th>
      <th>Client</th>
      <th>Status</th>
      <th>Date</th>
      <th>Actions</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Brand Photography</td>
      <td>Acme Inc.</td>
      <td>
        <span class="badge badge-success">Published</span>
      </td>
      <td>March 15, 2024</td>
      <td>
        <button class="btn btn-sm btn-secondary">Edit</button>
        <button class="btn btn-sm btn-danger">Delete</button>
      </td>
    </tr>
    <tr>
      <td>Headshots</td>
      <td>TechCorp</td>
      <td>
        <span class="badge badge-warning">Draft</span>
      </td>
      <td>March 10, 2024</td>
      <td>
        <button class="btn btn-sm btn-secondary">Edit</button>
        <button class="btn btn-sm btn-danger">Delete</button>
      </td>
    </tr>
  </tbody>
</table>
```

### CSS

```css
.table {
  width: 100%;
  border-collapse: collapse;
  font-size: var(--font-size-base);
  background-color: var(--bg-primary);
}

.table thead {
  background-color: var(--bg-secondary);
  border-bottom: 2px solid var(--border-color-dark);
}

.table th {
  padding: var(--space-md) var(--space-lg);
  text-align: left;
  font-weight: var(--font-weight-bold);
  color: var(--text-primary);
  font-size: var(--font-size-sm);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.table td {
  padding: var(--space-md) var(--space-lg);
  border-bottom: 1px solid var(--border-color);
  color: var(--text-secondary);
}

.table tbody tr:hover {
  background-color: var(--bg-secondary);
}

.table tbody tr:last-child td {
  border-bottom: none;
}

/* Badge Component (for status) */
.badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: var(--radius-full);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-bold);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.badge-success {
  background-color: #ECFDF5;
  color: #047857;
}

.badge-warning {
  background-color: #FFFBEB;
  color: #B45309;
}

.badge-error {
  background-color: #FEF2F2;
  color: #DC2626;
}

.badge-info {
  background-color: #EFF6FF;
  color: #1E40AF;
}
```

---

## 🧭 Componente: Modal

### HTML

```html
<div class="modal-overlay" id="modal-overlay">
  <div class="modal">
    <div class="modal-header">
      <h2 class="modal-title">Confirm Delete</h2>
      <button class="modal-close" aria-label="Close modal">×</button>
    </div>
    <div class="modal-body">
      <p>Are you sure you want to delete this project? This action cannot be undone.</p>
    </div>
    <div class="modal-footer">
      <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
      <button class="btn btn-danger" onclick="deleteProject()">Delete</button>
    </div>
  </div>
</div>
```

### CSS

```css
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  opacity: 0;
  pointer-events: none;
  transition: opacity var(--duration-normal);
}

.modal-overlay.active {
  opacity: 1;
  pointer-events: auto;
}

.modal {
  background-color: var(--bg-primary);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-2xl);
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  z-index: 1001;
  transform: scale(0.95);
  transition: transform var(--duration-normal);
}

.modal-overlay.active .modal {
  transform: scale(1);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-lg);
  border-bottom: 1px solid var(--border-color);
}

.modal-title {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--text-primary);
  margin: 0;
}

.modal-close {
  background: none;
  border: none;
  font-size: 24px;
  color: var(--text-tertiary);
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-md);
  transition: all var(--duration-fast);
}

.modal-close:hover {
  background-color: var(--bg-secondary);
  color: var(--text-primary);
}

.modal-body {
  padding: var(--space-lg);
}

.modal-footer {
  display: flex;
  gap: var(--space-md);
  justify-content: flex-end;
  padding: var(--space-md) var(--space-lg);
  border-top: 1px solid var(--border-color);
}
```

### JavaScript

```javascript
function openModal(modalId) {
  const overlay = document.getElementById(modalId);
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal(modalId) {
  const overlay = document.getElementById(modalId);
  overlay.classList.remove('active');
  document.body.style.overflow = '';
}

// Close on overlay click
document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  });

  // Close on close button click
  overlay.querySelector('.modal-close')?.addEventListener('click', () => {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  });
});

// Close on ESC key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.active').forEach(overlay => {
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    });
  }
});
```

---

## 🔌 Componente: Spinner/Loading

### HTML

```html
<!-- Spinner -->
<div class="spinner"></div>

<!-- Spinner Small -->
<div class="spinner spinner-sm"></div>

<!-- Spinner with Text -->
<div class="flex items-center gap-md">
  <div class="spinner spinner-sm"></div>
  <span>Loading...</span>
</div>

<!-- Button with Loading -->
<button class="btn btn-primary" id="submit-btn" disabled>
  <span class="spinner spinner-sm"></span>
  Saving...
</button>
```

### CSS

```css
.spinner {
  display: inline-block;
  width: 24px;
  height: 24px;
  border: 3px solid rgba(0, 0, 0, 0.1);
  border-top-color: var(--color-yellow);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.spinner-sm {
  width: 16px;
  height: 16px;
  border-width: 2px;
}

.spinner-lg {
  width: 32px;
  height: 32px;
  border-width: 4px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
```

---

## 🌈 Gradients & Effects

### CSS

```css
/* Gradient Background (optional) */
.bg-gradient {
  background: linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 100%);
}

/* Smooth gradient for hover effects */
.card-hover-gradient {
  position: relative;
  overflow: hidden;
}

.card-hover-gradient::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(245, 197, 24, 0.1), transparent);
  transition: left 0.5s ease;
}

.card-hover-gradient:hover::before {
  left: 100%;
}

/* Smooth shadows */
.shadow-smooth {
  box-shadow:
    0 1px 3px rgba(0, 0, 0, 0.04),
    0 4px 6px rgba(0, 0, 0, 0.04),
    0 10px 20px rgba(0, 0, 0, 0.05);
}

/* Focus state with smooth transition */
.focus-ring:focus {
  outline: none;
  box-shadow: 0 0 0 3px var(--bg-primary), 0 0 0 5px var(--color-yellow);
}
```

---

## ♿ Accessibility Essentials

### HTML

```html
<!-- Proper form structure -->
<form>
  <fieldset>
    <legend>Project Details</legend>

    <label for="project-name">
      Project Name
      <span aria-label="required">*</span>
    </label>
    <input
      type="text"
      id="project-name"
      required
      aria-required="true"
      aria-describedby="name-hint"
    >
    <small id="name-hint">Enter a descriptive project name</small>
  </fieldset>
</form>

<!-- Skip link -->
<a href="#main-content" class="sr-only">Skip to main content</a>

<!-- Focus visible indicator -->
<button>Click me</button>
```

### CSS

```css
/* Screen reader only text */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

/* High contrast focus states */
button:focus-visible,
a:focus-visible,
input:focus-visible,
select:focus-visible,
textarea:focus-visible {
  outline: 2px solid var(--color-yellow);
  outline-offset: 2px;
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* High contrast mode support */
@media (prefers-contrast: more) {
  .btn-primary {
    border: 2px solid var(--color-yellow);
  }

  .form-input {
    border-width: 2px;
  }
}
```

---

## 📦 HTML Template Pronto

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="theme-color" content="#FFFFFF">
  <title>Admin — Rodrigo Roncolato</title>

  <!-- Fonts -->
  <link href="https://fonts.googleapis.com/css2?family=Jost:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet">

  <!-- Stylesheets -->
  <link rel="stylesheet" href="css/reset.css">
  <link rel="stylesheet" href="css/variables.css">
  <link rel="stylesheet" href="css/components.css">
  <link rel="stylesheet" href="css/utilities.css">
  <link rel="stylesheet" href="css/layout.css">

  <style>
    body {
      font-family: var(--font-family);
      background-color: var(--bg-primary);
      color: var(--text-primary);
      line-height: var(--line-height-relaxed);
    }

    main {
      display: flex;
      min-height: 100vh;
    }

    .sidebar {
      width: 280px;
      background-color: var(--bg-primary);
      border-right: 1px solid var(--border-color);
      padding: var(--space-lg) 0;
      height: 100vh;
      overflow-y: auto;
      position: sticky;
      top: 0;
    }

    .sidebar-logo {
      padding: 0 var(--space-lg) var(--space-lg);
      border-bottom: 1px solid var(--border-color);
      margin-bottom: var(--space-lg);
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-bold);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--color-yellow);
    }

    .sidebar-nav {
      list-style: none;
    }

    .sidebar-nav a {
      display: block;
      padding: var(--space-sm) var(--space-lg);
      color: var(--text-secondary);
      text-decoration: none;
      font-size: var(--font-size-base);
      transition: all var(--duration-fast);
      border-left: 3px solid transparent;
    }

    .sidebar-nav a:hover,
    .sidebar-nav a.active {
      background-color: var(--bg-secondary);
      color: var(--color-yellow);
      border-left-color: var(--color-yellow);
      font-weight: var(--font-weight-bold);
    }

    .main-content {
      flex: 1;
      padding: var(--space-2xl);
      overflow-y: auto;
    }

    .header {
      margin-bottom: var(--space-2xl);
    }

    .header-title {
      font-size: var(--font-size-4xl);
      font-weight: var(--font-weight-bold);
      color: var(--text-primary);
      margin: 0 0 var(--space-md) 0;
      line-height: var(--line-height-tight);
    }

    @media (max-width: 768px) {
      main {
        flex-direction: column;
      }

      .sidebar {
        width: 100%;
        height: auto;
        border-right: none;
        border-bottom: 1px solid var(--border-color);
        position: static;
      }

      .main-content {
        padding: var(--space-lg);
      }
    }
  </style>
</head>
<body>
  <main>
    <aside class="sidebar">
      <div class="sidebar-logo">Admin Panel</div>
      <nav class="sidebar-nav">
        <li><a href="#dashboard" class="active">Dashboard</a></li>
        <li><a href="#portfolio">Portfolio</a></li>
        <li><a href="#blog">Blog</a></li>
        <li><a href="#settings">Settings</a></li>
      </nav>
    </aside>

    <div class="main-content">
      <div class="header">
        <h1 class="header-title">Dashboard</h1>
      </div>

      <!-- Your content here -->
    </div>
  </main>

  <script src="js/api.js"></script>
  <script src="js/auth.js"></script>
  <script src="js/ui.js"></script>
</body>
</html>
```

---

**Use este arquivo como referência rápida durante a implementação. Copie e adapte conforme necessário!**

