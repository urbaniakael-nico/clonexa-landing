// Validacion simple del formulario "Agenda tu demo gratis".
export function validateDemoForm(form) {
  const errors = {};
  if (form.name.trim().length < 2) errors.name = "Escribe tu nombre.";
  if (form.business.trim().length < 2) errors.business = "Cuéntanos el nombre y el tipo de negocio.";
  const digits = form.whatsapp.replace(/\D/g, "");
  if (digits.length < 7 || digits.length > 15) errors.whatsapp = "Escribe un número de WhatsApp válido.";
  return errors;
}
