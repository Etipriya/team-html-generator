const inquirer = require("inquirer");
const fs = require("fs");
const Engineer = require("./lib/engineer");
const Intern = require("./lib/intern");
const Manager = require("./lib/manager");

const employees = [];

//Declare init application function
function initApp() {
  startHtml();
  addMember();
}

//Declare a function to add the member using inquirer and prompt
async function addMember() {
  const answers = await inquirer.prompt([
    {
      message: "Enter team member's name",
      name: "name",
    },
    {
      type: "list",
      message: "Select team member's role",
      choices: ["Engineer", "Intern", "Manager"],
      name: "role",
    },
    {
      message: "Enter team member's id",
      name: "id",
    },
    {
      message: "Enter team member's email address",
      name: "email",
    },
  ]);
  const { name, role, id, email } = answers;
  let roleInfo = "";
  if (role === "Engineer") {
    roleInfo = "GitHub username";
  } else if (role === "Intern") {
    roleInfo = "school name";
  } else {
    roleInfo = "office phone number";
  }
  const response = await inquirer.prompt([
    {
      message: `Enter team member's ${roleInfo}`,
      name: "roleInfo",
    },
    {
      type: "list",
      message: "Would you like to add more team members?",
      choices: ["yes", "no"],
      name: "moreMembers",
    },
  ]);
  //const { roleInfo, moreMembers } = response;
  let newMember;
  if (role === "Engineer") {
    newMember = new Engineer(name, id, email, response.roleInfo);
  } else if (role === "Intern") {
    newMember = new Intern(name, id, email, response.roleInfo);
  } else {
    newMember = new Manager(name, id, email, response.roleInfo);
  }
  employees.push(newMember);
  addHtml(newMember).then(function () {
    if (response.moreMembers === "yes") {
      addMember();
    } else {
      finishHtml();
    }
  });
}

//Declare a function which contains the HTML content to create a navbar
function startHtml() {
  const html = `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
        <title>Team Profile</title>
    </head>
    <body>
        <nav class="navbar navbar-dark bg-dark mb-5">
            <span class="navbar-brand mb-0 h1 w-100 text-center">Team Profile</span>
        </nav>
        <div class="container">
            <div class="row">`;

  //using fs.writeFile
  fs.writeFile("./output/team.html", html, function (err) {
    if (err) {
      console.log(err);
    }
  });
  console.log("file created");
}

// Declare a function which contains the HTMl for adding engineer, intern and manager
function addHtml(member) {
  return new Promise(function (resolve, reject) {
    const name = member.getName();
    const role = member.getRole();
    const id = member.getId();
    const email = member.getEmail();
    let data = "";
    if (role === "Engineer") {
      const gitHub = member.getGithub();
      data = `<div class="col-6">
            <div class="card mx-auto mb-3" style="width: 18rem">
            <div class="card-header bg-success">${name}<br /><br />Engineer</div>
            <ul class="list-group list-group-flush ">
                <li class="list-group-item bg-secondary text-light">ID: ${id}</li>
                <li class="list-group-item bg-secondary text-light">Email Address: ${email}</li>
                <li class="list-group-item bg-secondary text-light">GitHub: ${gitHub}</li>
            </ul>
            </div>
        </div>`;
    } else if (role === "Intern") {
      const school = member.getSchool();
      data = `<div class="col-6">
            <div class="card mx-auto mb-3" style="width: 18rem">
            <div class="card-header bg-success">${name}<br /><br />Intern</div>
            <ul class="list-group list-group-flush">
                <li class="list-group-item bg-secondary text-light">ID: ${id}</li>
                <li class="list-group-item bg-secondary text-light">Email Address: ${email}</li>
                <li class="list-group-item bg-secondary text-light">School: ${school}</li>
            </ul>
            </div>
        </div>`;
    } else {
      const officePhone = member.getOfficeNumber();
      data = `<div class="col-6">
            <div class="card mx-auto mb-3" style="width: 18rem">
            <div class="card-header bg-success">${name}<br /><br />Manager</div>
            <ul class="list-group list-group-flush">
                <li class="list-group-item bg-secondary text-light">ID: ${id}</li>
                <li class="list-group-item bg-secondary text-light">Email Address: ${email}</li>
                <li class="list-group-item bg-secondary text-light">Office Phone: ${officePhone}</li>
            </ul>
            </div>
        </div>`;
    }
    console.log("adding team member");

    //using appendFile to get the output from html
    fs.appendFile("./output/team.html", data, function (err) {
      if (err) {
        return reject(err);
      }
      return resolve();
    });
  });
}

//Declare a function to finish the HTML
function finishHtml() {
  const html = ` </div>
    </div>
    
</body>
</html>`;

  //Declare append function again to end the HTML and error
  fs.appendFile("./output/team.html", html, function (err) {
    if (err) {
      console.log(err);
    }
  });
  console.log("end");
}

//Declare empty initApp
initApp();
