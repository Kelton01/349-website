document.addEventListener("DOMContentLoaded", function () {
  const informationDiv = document.querySelector(".information");
  const colors = [
    "#FF5733",
    "#C70039",
    "#4dffc3",
    "#581845",
    "#E8E8E8",
    "#008080",
    "#FFD700",
    "#4CAF50",
    "#2196F3",
    "#ddccff",
    "#FF4500"
  ]; 

  let colorIndex = 0;

  const changeColorButton = document.getElementById("changeColorButton");
  changeColorButton.addEventListener("click", function () {
    informationDiv.style.backgroundColor = colors[colorIndex];
    colorIndex = (colorIndex + 1) % colors.length;
    
    if (colorIndex === 0) informationDiv.style.backgroundColor = 'white';
  });

  const changeFontButton = document.getElementById("changeFontButton");
  changeFontButton.addEventListener("click", function () {
    const informationDiv = document.querySelector(".information");
    const fonts = [
      "Arial, sans-serif",
      "Times New Roman, serif",
      "Courier New, monospace",
      "Verdana, sans-serif",
      "Georgia, serif",
      "Comic Sans MS, cursive"
    ];
    const randomFont = fonts[Math.floor(Math.random() * fonts.length)];
    informationDiv.style.fontFamily = randomFont;
  });

  const changeNameButton = document.getElementById("changeNameButton");
  changeNameButton.addEventListener("click", function () {
    const newName = document.getElementById("changeText1").value;
    const nameElement = document.getElementById("name");
    nameElement.textContent = newName;
  });

  const changePositionButton = document.getElementById("changePositionButton");
  changePositionButton.addEventListener("click", function () {
    const newPosition = document.getElementById("changeText2").value;
    const positionElement = document.getElementById("position");
    positionElement.textContent = newPosition;
  });

  const changeNumberButton = document.getElementById("changeNumberButton");
  changeNumberButton.addEventListener("click", function () {
    const newNumber = document.getElementById("changeText3").value;
    const numberElement = document.getElementById("number");
    numberElement.textContent = "Phone: " + newNumber;
  });

  const changeEmailButton = document.getElementById("changeEmailButton");
  changeEmailButton.addEventListener("click", function () {
    const newEmail = document.getElementById("changeText4").value;
    const emailElement = document.getElementById("email");
    emailElement.textContent = "Email: " + newEmail;
  });

  const changeWebsiteButton = document.getElementById("changeWebsiteButton");
  const websiteLink = document.getElementById("website-link");

  changeWebsiteButton.addEventListener("click", function () {
  const newWebsite = document.getElementById("changeText5").value;
  websiteLink.href = newWebsite;
  websiteLink.textContent = newWebsite;
  });

  const saveDataButton = document.getElementById("saveDataButton");
  saveDataButton.addEventListener("click", function () {
    saveData();
  });

  const loadDataButton = document.getElementById("loadDataButton");
  loadDataButton.addEventListener("click", function () {
    loadData();
  });

  // Function to save data to the server
  function saveData() {
    const data = {
      backgroundColor: document.querySelector(".information").style.backgroundColor,
      font: document.querySelector(".information").style.fontFamily,
      name: document.getElementById("name").textContent,
      position: document.getElementById("position").textContent,
      phone: document.getElementById("number").textContent,
      email: document.getElementById("email").textContent,
      website: document.getElementById("website-link").href,
    };
  
    // Replace undefined properties with null
    for (const key in data) {
      if (data[key] === undefined) {
        data[key] = null;
      }
    }
  
    fetch("/save-data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error("Error saving data:", error);
      });
  }

  function loadData() {
    fetch("/load-data")
      .then((response) => response.json())
      .then((data) => {
        // Update the card details with the loaded data
        informationDiv.style.backgroundColor = data.backgroundColor;
        informationDiv.style.fontFamily = data.font;
        document.getElementById("name").textContent = data.name;
        document.getElementById("position").textContent = data.position;
        document.getElementById("number").textContent = data.phone;
        document.getElementById("email").textContent = data.email;
        document.getElementById("website-link").textContent = data.website;
      })
      .catch((error) => {
        console.error("Error loading data:", error);
      });
  }
});