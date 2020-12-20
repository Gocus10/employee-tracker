INSERT INTO department (name) value ('HR');
INSERT INTO department (name) value ('Marketing');
INSERT INTO department (name) value ('Development');

INSERT INTO role (title, salary, department_id) values ('HR Manager', 70000.00, 1);
INSERT INTO role (title, salary, department_id) values ('HR Representative', 45000.00, 1);
INSERT INTO role (title, salary, department_id) values ('Marketing Manager', 85000.00, 2);
INSERT INTO role (title, salary, department_id) values ('Designer', 55000.00, 2);
INSERT INTO role (title, salary, department_id) values ('Development Manager', 95000.00, 3);
INSERT INTO role (title, salary, department_id) values ('Software Engineer', 70000.00, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id) values ('Bill', 'Billerson', 5, null);
INSERT INTO employee (first_name, last_name, role_id, manager_id) values ('Tom', 'Tommerson', 6, 1);
INSERT INTO employee (first_name, last_name, role_id, manager_id) values ('Linda', 'Linderson', 1, null);
INSERT INTO employee (first_name, last_name, role_id, manager_id) values ('Greg', 'Greggerson', 2, 3);
INSERT INTO employee (first_name, last_name, role_id, manager_id) values ('Rob', 'Robberson', 3, null);
INSERT INTO employee (first_name, last_name, role_id, manager_id) values ('Ashley', 'Asherson', 4, 5);

