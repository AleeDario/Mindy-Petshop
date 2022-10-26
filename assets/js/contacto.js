let  boton =  document.getElementById('submit-btn')
boton.addEventListener('click', captura)

function captura() {
  let nombre = document.getElementById("name").value;

  let apellido = document.getElementById("lastName").value;

  let email = document.getElementById("mail").value;

  let telefono = document.getElementById("phone").value;

  let nombreMascota = document.getElementById("petName").value;

  let textoComen = document.getElementById("textArea").value;

  swal("¡Información enviada!", "Gracias", "success");

  console.log(
    nombre +
      " " +
      apellido +
      " " +
      email +
      " " +
      telefono +
      " " +
      nombreMascota +
      " " +
      textoComen
  );
}

let checkBoxClass = Array.from(document.querySelectorAll("#inlineRadio"));

console.log(checkBoxClass);

checkBoxClass.forEach((checkbox) =>
  checkbox.addEventListener("click", checkboxFilters)
);

function checkboxFilters(check) {
  let checkboxFiltering = checkBoxClass
    .filter((check) => check.checked)
    .map((check) => check.value);
  console.log(checkboxFiltering);
  if (checkboxFiltering.length !== 0) {
    return checkboxFiltering.value;
  }
}
