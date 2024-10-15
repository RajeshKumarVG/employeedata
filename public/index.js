document.addEventListener('DOMContentLoaded', () => {
    const employeeTableBody = document.getElementById('employeeTableBody');
    const addEmployeeForm = document.getElementById('addEmployeeForm');
    const searchBar = document.getElementById('searchBar');
    const clearSearchButton = document.getElementById('clearSearch');
    let employees = [];

    // Fetch and display employees
    const fetchEmployees = async () => {
        try {
            console.log('Fetching employees from the API...');
            const response = await fetch('/api/employees');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            employees = await response.json();
            console.log('Employees fetched successfully:', employees);
            renderEmployees(employees);
        } catch (error) {
            console.error('Error fetching employees:', error.message, error.stack);
        }
    };

    // Render employees in the table
    const renderEmployees = (employeeList) => {
        employeeTableBody.innerHTML = '';
        employeeList.forEach(employee => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${employee.id}</td>
                <td>${employee.name}</td>
                <td>${employee.age}</td>
                <td>${employee.department}</td>
                <td>${employee.role}</td>
                <td>
                    <button class="btn btn-danger btn-sm delete-btn" data-id="${employee.id}">Delete</button>
                </td>
            `;
            employeeTableBody.appendChild(row);
        });
    };

    // Add new employee
    addEmployeeForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const newEmployee = {
            id: document.getElementById('empId').value,
            name: document.getElementById('empName').value,
            age: document.getElementById('empAge').value,
            department: document.getElementById('empDepartment').value,
            role: document.getElementById('empRole').value,
        };

        try {
            console.log('Adding a new employee:', newEmployee);
            const response = await fetch('/api/employees', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newEmployee),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const addedEmployee = await response.json();
            console.log('Employee added successfully:', addedEmployee);
            // Refresh the employee list after adding a new employee
            fetchEmployees();
            addEmployeeForm.reset();
        } catch (error) {
            console.error('Error adding employee:', error.message, error.stack);
        }
    });

    // Search employees by name
    searchBar.addEventListener('input', (event) => {
        const searchTerm = event.target.value.toLowerCase();
        const filteredEmployees = employees.filter(employee =>
            employee.name.toLowerCase().includes(searchTerm)
        );
        renderEmployees(filteredEmployees);
    });

    // Clear search input and refresh employee list
    clearSearchButton.addEventListener('click', () => {
        console.log('Clear search button clicked');
        searchBar.value = '';
        renderEmployees(employees);
    });

    // Sort employees by column
    document.querySelectorAll('th').forEach((header, index) => {
        header.addEventListener('click', () => {
            const sortedEmployees = [...employees].sort((a, b) => {
                const aValue = Object.values(a)[index];
                const bValue = Object.values(b)[index];
                return aValue > bValue ? 1 : -1;
            });
            renderEmployees(sortedEmployees);
        });
    });

    // Add event listener for delete buttons
    employeeTableBody.addEventListener('click', async (event) => {
        if (event.target.classList.contains('delete-btn')) {
            const employeeId = event.target.getAttribute('data-id');
            try {
                console.log(`Attempting to delete employee with ID: ${employeeId}`);
                const response = await fetch(`/api/employees/${employeeId}`, {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                console.log(`Employee with ID: ${employeeId} deleted successfully`);
                // Refresh the employee list after deletion
                fetchEmployees();
            } catch (error) {
                console.error('Error deleting employee:', error.message, error.stack);
            }
        }
    });

    // Initial fetch
    fetchEmployees();
});