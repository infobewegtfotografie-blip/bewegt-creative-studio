/**
 * AJAX submit handling for the contact + newsletter forms, replacing
 * Netlify Forms' native POST. Loading/success/error states via a status
 * paragraph (role="status", already present in both forms' markup) rather
 * than a generic spinner — per the brief's "no generic spinner everywhere".
 */
interface FormSubmitConfig {
  formId: string;
  statusId: string;
  /** Where to send the visitor on success. Omit to just show a success message inline (newsletter). */
  successRedirect?: string;
  successMessage: string;
  loadingMessage: string;
  genericErrorMessage: string;
}

async function handleSubmit(form: HTMLFormElement, status: HTMLElement, config: FormSubmitConfig): Promise<void> {
  const submitButton = form.querySelector<HTMLButtonElement>('button[type="submit"]');
  submitButton?.setAttribute('disabled', 'true');
  status.textContent = config.loadingMessage;
  status.classList.remove('is-error', 'is-success');

  try {
    const response = await fetch(form.action, { method: 'POST', body: new FormData(form) });
    const data = (await response.json().catch(() => ({}))) as { ok?: boolean; error?: string };

    if (response.ok && data.ok) {
      status.textContent = config.successMessage;
      status.classList.add('is-success');
      form.reset();
      if (config.successRedirect) window.location.href = config.successRedirect;
    } else {
      status.textContent = data.error || config.genericErrorMessage;
      status.classList.add('is-error');
    }
  } catch {
    status.textContent = config.genericErrorMessage;
    status.classList.add('is-error');
  } finally {
    submitButton?.removeAttribute('disabled');
  }
}

export function initFormSubmit(config: FormSubmitConfig): void {
  const form = document.getElementById(config.formId) as HTMLFormElement | null;
  const status = document.getElementById(config.statusId);
  if (!form || !status) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    void handleSubmit(form, status, config);
  });
}
