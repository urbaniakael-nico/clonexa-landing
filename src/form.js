// Validacion simple del formulario de demo. Devuelve { campo: campo } por cada error; el mensaje
// en el idioma de la pagina sale de t.form.errors[campo].
export function validateDemoForm(form) {
  const errors = {};
  if (form.name.trim().length < 2) errors.name = "name";
  if (form.business.trim().length < 2) errors.business = "business";
  const digits = form.whatsapp.replace(/\D/g, "");
  if (digits.length < 7 || digits.length > 15) errors.whatsapp = "whatsapp";
  return errors;
}
