const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');

const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  // Your MySQL username
  user: 'root',
  // Your MySQL password
  password: 'Digital713!',
  database: 'employees_db'
});

connection.connect(err => {
    if (err) throw err;
  });

readEmployees = () => {
    console.log('Selecting all employee data...\n');

    const query = connection.query(
      "SELECT e.id,e.first_name,e.last_name,title,name,salary,concat(m.first_name,' ',m.last_name) AS Manager from employee e left join role on e.role_id = role.id left join department on role.department_id = department.id left join employee m on e.manager_id = m.id;",
      function(err, res){
        if (err) throw err;
        console.log('\n');
        console.table(res); 
      }
    )
};

readDepartments = () => {
    console.log('Selecting all department data...\n');

    const query = connection.query(
      "SELECT * FROM department",
      function(err, res){
        if (err) throw err;
        console.log('\n');
        console.table(res); 
      }
    )
};

readRoles = () => {
    console.log('Selecting all role data...\n');

    const query = connection.query(
      "SELECT * FROM role",
      function(err, res){
        if (err) throw err;
        console.log('\n');
        console.table(res); 
      }
    )
};

addDepartment = async () => {
    const newDep = await inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: 'Please enter the name of the new department:'
        }
    ]);
    const query = connection.query(
        'INSERT INTO department SET ?',
        {
            name: newDep.name
        },
        function (err) {
            if (err)
                throw err;
            console.log('\n');
            readDepartments();
        }
    );
};

addRole = async () => {
    let choiceOptions = [];
    connection.promise().query('SELECT name FROM department')
    .then(([rows]) =>{
        for(i=0;i<rows.length;i++){
            choiceOptions.push(rows[i].name)
        }
    })
    const newRole = await inquirer.prompt([
        {
            type: 'input',
            name: 'title',
            message: 'Please enter the title of the new role:'
        },
        {
            type: 'input',
            name: 'salary',
            message: 'Please enter the salary of the new role:'
        },
        {
            type: 'list',
            name: 'department',
            message: 'Please select which department the new role belongs to:',
            choices: choiceOptions
        },
    ]);
    let depId = (choiceOptions.indexOf(newRole.department));
    const query = connection.query(
        'INSERT INTO role SET ?',
        {
            title: newRole.title,
            salary: newRole.salary,
            department_id: depId
        },
        function (err) {
            if (err)
                throw err;
            console.log('\n');
            readRoles();
        }
    );
};
addEmployee = async () => {
    let choiceOptions = [];
    let choiceOptionsTwo = [];
    let rowsTwo = {};
    connection.promise().query("SELECT e.id,e.first_name,e.last_name,title,e.role_id,salary,concat(m.first_name,' ',m.last_name) AS Manager from employee e left join role on e.role_id = role.id left join department on role.department_id = department.id left join employee m on e.manager_id = m.id")
    .then(([rows]) =>{
        for(i=0;i<rows.length;i++){
            if(rows[i].Manager){
            choiceOptions.push(rows[i].Manager)
            }
            choiceOptionsTwo.push(rows[i].title)
        }
        rowsTwo = rows;
        
    })
    const newEmp = await inquirer.prompt([
        {
            type: 'input',
            name: 'fName',
            message: 'Please enter the first name of this employee:'
        },
        {
            type: 'input',
            name: 'lName',
            message: 'Please enter the last name of this employee:'
        },
        {
            type: 'list',
            name: 'manager',
            message: "Please select this employee's manager:",
            choices: choiceOptions
        },
        {
            type: 'list',
            name: 'title',
            message: "Please select this employee's title:",
            choices: choiceOptionsTwo
        }
    ]);
    let titleNum = (choiceOptionsTwo.indexOf(newEmp.title));
    let depId = (choiceOptions.indexOf(newEmp.manager));
    const query = connection.query(
        'INSERT INTO employee SET ?',
        {
            first_name: newEmp.fName,
            last_name: newEmp.lName,
            manager_id: rowsTwo[depId].id,
            role_id: rowsTwo[titleNum].role_id
        },
        function (err) {
            if (err)
                throw err;
            console.log('\n');
            readEmployees();
        }
    );   
};

updateEmployee = () => {
    let rowsTwo = {};
    let choiceOptions = [];
    let choiceOptionsTwo = [];
    connection.promise().query("SELECT employee.id,first_name,role_id,title,salary,department_id FROM employee left join role on role.id = employee.role_id")
    .then(([rows]) =>{
    for(i=0;i<rows.length;i++){
        choiceOptions.push(rows[i].first_name);
        choiceOptionsTwo.push(rows[i].title);   
        rowsTwo = rows;
      
    }
    return inquirer.prompt([
        {
            type: 'list',
            name: 'first_name',
            message: 'Which employee would you like to update?',
            choices: choiceOptions
        },
        {
            type: 'list',
            name: 'title',
            message: 'What is their new title?',
            choices: choiceOptionsTwo
        }

    ])
})
    .then(upEmp =>{
        let depId = (choiceOptions.indexOf(upEmp.first_name));
        let otherId = choiceOptionsTwo.indexOf(upEmp.title);
        const query = connection.query(
            'UPDATE employee SET ? WHERE ?',
            [{
                role_id: rowsTwo[otherId].role_id
            },
            {
                id: rowsTwo[depId].id
            }],  
            function(err){
              if (err) throw err;
              console.log('\n');
            readEmployees();
            }
          )
    })
}

const promptUser = () => {
    return inquirer.prompt([
        {
            type: 'list',
            name: 'tasks',
            message: 'What would you like to do?',
            choices: ['View All Employees', 'View All Departments','View All Roles', 'Add a Department', 'Add a Role', 'Add an Employee', 'Update an Employees Role']
        }
    ]);
}


promptUser()
.then(resData => {
    switch(resData.tasks){
       case 'View All Employees': readEmployees();
       break;
       case 'View All Departments': readDepartments();
       break;
       case 'View All Roles': readRoles();
       break;
       case 'Add a Department': addDepartment();
       break;
       case 'Add a Role': addRole();
       break;
       case 'Add an Employee': addEmployee();
       break;
       case 'Update an Employees Role': updateEmployee();
       break;
    } 
});