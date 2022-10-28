let boton = document.getElementById("submit-btn");
boton.addEventListener("click", captura);

function captura() {
  let nombre = document.getElementById("name").value;

  let apellido = document.getElementById("lastName").value;

  let email = document.getElementById("mail").value;

  let telefono = document.getElementById("phone").value;

  let nombreMascota = document.getElementById("petName").value;

  let textoComen = document.getElementById("textArea").value;

//let checks = document.getElementById("inlineRadio").value;

  let checks = Array.from(document.querySelectorAll("#inlineRadio:checked")).map(item => item.value);

  if (nombre == "") {
    swal("Información incompleta", "Nombre necesario", "error");
    document.getElementById("name").focus();
  } else if (telefono == "") {
    swal("Información incompleta", "Telefono necesario", "error");
    document.getElementById("phone").focus();
  } else if (typeof(nombre)==Number){
    swal("Información incompleta", "Nombre necesario", "error");
  } else if (nombre !== "" && telefono !== "") {
    swal("¡Información enviada!", "Gracias", "success");
  }

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
  localStorage.setItem("nombre", nombre);
  localStorage.setItem("apellido", apellido);
  localStorage.setItem("email", email);
  localStorage.setItem("telefono", telefono);
  localStorage.setItem("nombreMascota", nombreMascota);
  localStorage.setItem("textoComen", textoComen);
  localStorage.setItem("checks", checks);
}


/* let checkBoxClass = Array.from(document.querySelectorAll("#inlineRadio"));

checkBoxClass.forEach((checkbox) =>
  checkbox.addEventListener("click", checkboxFilters)
);

function checkboxFilters() {
  let checkboxFiltering = checkBoxClass
    .filter((check) => check.checked)
    .map((check) => check.value);
    console.log(checkboxFiltering);
    return checkboxFiltering;
    
  }
 */