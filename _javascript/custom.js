document.addEventListener("DOMContentLoaded", function() {
  let pageTitle = "{{ page.title }}";
  console.log(pageTitle); 
  console.log(pageTitle.includes("[U-KNOU]"));

  if (pageTitle.includes("[U-KNOU]")) {
      var password = prompt("Please enter the password:");
      if (password !== "123456") {
          alert("Incorrect password.");
          document.body.innerHTML = ""; // Clear the page content
      }
  }
});