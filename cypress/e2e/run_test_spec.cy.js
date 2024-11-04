function random(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

describe('Authentication | Login', () => {
	beforeEach(() => {
		cy.visit('http://localhost:8080/login');
	});

	it('username does not exist', () => {
		cy.get('input[name="username"]').clear().type('admin_does_not_exist'); 
		cy.get('#login_button').click();
		cy.get('#login_errors_username').should('contain', 'username is wrong');
	});

	it('password is incorrect', () => {
		cy.get('input[name="username"]').clear().type('admin'); 
		cy.get('input[name="password"]').clear().type('admin is incorrect'); 
		cy.get('#login_button').click();
		cy.get('#login_errors_password').should('contain', 'password is wrong');
	});

	it('log in successfully', () => {
		cy.get('input[name="username"]').clear().type('admin'); 
		cy.get('input[name="password"]').clear().type('123456'); 
		cy.get('#login_button').click();
		cy.url().should('eq', 'http://localhost:8080/dashboard/chat-bot');
	});
});

describe('Authentication | Register', () => {
	beforeEach(() => {
		cy.visit('http://localhost:8080/register');
	});

	it('email must be in correct format', () => {
		cy.get('input[name="email"]').clear().type('email'); 
		cy.get('input[name="username"]').clear().type('username'); 
		cy.get('input[name="password"]').clear().type('password'); 
		cy.get('input[name="first_name"]').clear().type('First Name'); 
		cy.get('input[name="last_name"]').clear().type('Last Name'); 
		cy.get('#register_button').click();
		cy.get('#register_errors_email').should('contain', 'Enter a valid email address.');
	});

	it('username already exists', () => {
		cy.get('input[name="email"]').clear().type('admin@gmail.com'); 
		cy.get('input[name="username"]').clear().type('admin'); 
		cy.get('input[name="password"]').clear().type('password'); 
		cy.get('input[name="first_name"]').clear().type('First Name'); 
		cy.get('input[name="last_name"]').clear().type('Last Name'); 
		cy.get('#register_button').click();
		cy.get('#register_errors_username').should('contain', 'A user with that username already exists.');
	});

	it('register successfully', () => {
		var username = 'user' + random(999999, 9999999);
		cy.get('input[name="email"]').clear().type(username + '@gmail.com'); 
		cy.get('input[name="username"]').clear().type(username); 
		cy.get('input[name="password"]').clear().type('password'); 
		cy.get('input[name="first_name"]').clear().type('First Name'); 
		cy.get('input[name="last_name"]').clear().type('Last Name'); 
		cy.get('#register_button').click();
		cy.url().should('eq', 'http://localhost:8080/login');
	});
});

describe('Folder | Create Folder', () => {
	beforeEach(() => {
		cy.visit('http://localhost:8080/login');
		cy.get('input[name="username"]').clear().type('admin'); 
		cy.get('input[name="password"]').clear().type('123456'); 
		cy.get('#login_button').click(); 
		cy.wait(500);
		cy.visit('http://localhost:8080/dashboard/manage-folder');
	});

	it('should open the create folder modal', () => {
		cy.get('button[data-target="#addRecord"]').should('be.visible').click();
		cy.get('#addRecord').should('be.visible');
	});

	it('should show validation error when folder name is empty', () => {
		cy.get('button[data-target="#addRecord"]').click();
		cy.get('#folder_add_button').click();
		cy.get('#add_folder_errors_name').should('contain', 'name is not empty');
	});

	it('should create a new folder successfully', () => {
		cy.get('button[data-target="#addRecord"]').click();
		const newFolderName = 'New Name Folder';
		cy.get('input[name="add_folder_name"]').type(newFolderName); 
		cy.get('#folder_add_button').click();
		cy.get('#addRecord').should('not.be.visible');
		cy.get('#table_body_folder').should('contain', newFolderName);
	});
});

describe('Folder | Update Folder', () => {
	beforeEach(() => {
		cy.visit('http://localhost:8080/login');
		cy.get('input[name="username"]').clear().type('admin'); 
		cy.get('input[name="password"]').clear().type('123456'); 
		cy.get('#login_button').click(); 
		cy.wait(500);
		cy.visit('http://localhost:8080/dashboard/manage-folder');
	});

	it('should open the update folder modal', () => {
		cy.get('#table_body_folder tr').should('have.length.greaterThan', 0);
		cy.get('#table_body_folder tr')
			.first()
			.find('.updateRecord')
			.click();
		cy.get('#updateRecord').should('be.visible');
	});

	it('should update the first folder successfully', () => {
		cy.get('#table_body_folder tr').should('have.length.greaterThan', 0);
		cy.get('#table_body_folder tr')
			.first()
			.find('.updateRecord')
			.click();
		cy.get('#updateRecord').should('be.visible');
		const newFolderName = 'Updated Folder Name';
		cy.get('#updateRecord input[name="update_folder_name"]').clear().invoke('val', newFolderName).trigger('input'); 
		cy.get('#updateRecord #folder_save_button').click();
		cy.get('#updateRecord').should('not.be.visible');
		cy.get('#table_body_folder tr').first().find('td:nth-child(3)').should('contain.text', newFolderName);
	});
});

describe('Folder | Delete Folder', () => {
	beforeEach(() => {
		cy.visit('http://localhost:8080/login');
		cy.get('input[name="username"]').clear().type('admin'); 
		cy.get('input[name="password"]').clear().type('123456'); 
		cy.get('#login_button').click(); 
		cy.wait(500);
		cy.visit('http://localhost:8080/dashboard/manage-folder');
	});

	it('should open the delete folder modal', () => {
		cy.get('#table_body_folder tr').should('have.length.greaterThan', 0);
		cy.get('#table_body_folder tr')
			.first()
			.find('.deleteRecord')
			.click();
		cy.get('#deleteRecord').should('be.visible');
	});

	it('should delete the first folder successfully', () => { 
		cy.get('#table_body_folder tr').should('have.length.greaterThan', 0);
		let folderId;
		cy.get('#table_body_folder tr')
		  .first()
		  .find('td:nth-child(2)')
		  .invoke('text')
		  .then((id) => {
			  folderId = id.trim();
		  });
		cy.get('#table_body_folder tr')
		  .first()
		  .find('.deleteRecord')
		  .click();
		cy.get('#deleteRecord').should('be.visible');
		cy.wait(1000);
		cy.get('#deleteRecord #folder_delete_button').click();
		cy.get('#deleteRecord').should('not.be.visible');
		cy.get('#table_body_folder tr')
		  .should('not.contain', folderId);
	});
});

describe('Folder | Search Sort Pagination', () => {
	beforeEach(() => {
		cy.visit('http://localhost:8080/login');
		cy.get('input[name="username"]').clear().type('admin'); 
		cy.get('input[name="password"]').clear().type('123456'); 
		cy.get('#login_button').click(); 
		cy.wait(500);
		cy.visit('http://localhost:8080/dashboard/manage-folder');
	});

	it('should update the number of records displayed per page', () => {
		cy.get('#folder_per_page').select('10');
		cy.get('#table_body_folder tr').should('have.length', 10);
		cy.get('#folder_per_page').select('20');
		cy.get('#table_body_folder tr').should('have.length', 20);
	});

	it('should sort the records by the selected field', () => {
		cy.get('#folder_sort_by').select('name');
		cy.get('#table_body_folder tr td:nth-child(3)').then(($cells) => {
			const textValues = $cells.map((i, el) => Cypress.$(el).text()).get();
			const sortedValues = [...textValues].sort().reverse(); 
			expect(textValues).to.deep.equal(sortedValues);
		});
	});

	it('should filter the table based on the search input', () => {
		cy.get('button[data-target="#addRecord"]').click();
		const newFolderName = 'Test Search New Name Folder';
		cy.get('input[name="add_folder_name"]').invoke('val', newFolderName).trigger('input');
		cy.get('#folder_add_button').click();

		cy.visit('http://localhost:8080/dashboard/manage-folder'); 
		const searchText = newFolderName;
		cy.get('#folder_input_search').invoke('val', searchText).trigger('input');
		cy.wait(500);
		cy.get('#table_body_folder tr').each(($row) => {
			cy.wrap($row).find('td:nth-child(3)').should('contain.text', searchText);
		});
		cy.get('#folder_input_search').clear().trigger('input');
		cy.wait(500);
		cy.get('#table_body_folder tr').should('have.length.greaterThan', 0);
	});

	it('should not find any folders when searching with a non-existent name', () => {
		const nonExistentSearchText = 'NonExistentFolderName12345';
		cy.get('#folder_input_search').invoke('val', nonExistentSearchText).trigger('input');
		cy.wait(500);
		cy.get('#table_body_folder tr').should('have.length', 0);
		cy.get('#folder_input_search').clear().trigger('input');
		cy.wait(500);
		cy.get('#table_body_folder tr').should('have.length.greaterThan', 0);
	});
});

describe('File | Create File', () => {
	beforeEach(() => {
		cy.visit('http://localhost:8080/login');
		cy.get('input[name="username"]').clear().type('admin'); 
		cy.get('input[name="password"]').clear().type('123456'); 
		cy.get('#login_button').click(); 
		cy.wait(500);
		cy.visit('http://localhost:8080/dashboard/manage-file');
	});

	it('should open the create file modal', () => {
		cy.get('button[data-target="#addRecord"]').should('be.visible').click();
		cy.get('#addRecord').should('be.visible');
	});

	it('should show validation error when not upload file', () => {
		cy.get('button[data-target="#addRecord"]').click();
		cy.get('#file_add_button').click();
		cy.get('#add_file_errors_name').should('contain', 'Field file is required');
	});

	it('should show an error when folder is not selected', () => {
		cy.get('button[data-target="#addRecord"]').click();
		const fileName = 'e2e_file_upload_benh_ho_van_tim.txt';
		cy.fixture(fileName).then(fileContent => {
			cy.get('input[type="file"]').attachFile({
				fileContent,
				fileName,
				mimeType: 'text/plain' 
			});
		});
		cy.get('#file_add_button').click();
		cy.get('#add_file_errors_id_folder').should('contain.text', 'Folder not found');
	});

	/** Takes time
	it('should add the file successfully when folder is selected and file is uploaded', () => {
		cy.get('button[data-target="#addRecord"]').click();
		cy.get('#select_id_folder').click();
		cy.get('ul.multiselect-options > li').first().click({ force: true });
		const fileName = 'e2e_file_upload_benh_ho_van_tim.txt';
		cy.fixture(fileName).then(fileContent => {
			cy.get('input[type="file"]').attachFile({
				fileContent,
				fileName,
				mimeType: 'text/plain'
			});
		});
		cy.get('#file_add_button').click();
		cy.on('window:alert', (str) => {
			expect(str).to.equal('File added successfully !');
		});
		cy.wait(60000);
		cy.get('#addRecord').should('not.be.visible');
		cy.get('#select_id_folder').should('have.value', '');
		cy.get('input[type="file"]').should('have.value', '');
		cy.get('#table_body_file tr').first().find('td:nth-child(3)').should('contain.text', fileName);
	});
	 */
});

describe('File | Update File', () => {
	beforeEach(() => {
		cy.visit('http://localhost:8080/login');
		cy.get('input[name="username"]').clear().type('admin'); 
		cy.get('input[name="password"]').clear().type('123456'); 
		cy.get('#login_button').click(); 
		cy.wait(500);
		cy.visit('http://localhost:8080/dashboard/manage-file');
	});

	it('should open the update file modal', () => {
		cy.get('#table_body_file tr').should('have.length.greaterThan', 0);
		cy.get('#table_body_file tr')
			.first()
			.find('.updateRecord')
			.click();

		cy.get('#updateRecord').should('be.visible');
	});

	it('should update the first file successfully', () => {
		cy.get('#table_body_file tr').should('have.length.greaterThan', 0);
		cy.get('#table_body_file tr')
			.first()
			.find('.updateRecord')
			.click();
		cy.get('#updateRecord').should('be.visible');
		const newFolderName = 'updated_file_name.txt';
		cy.get('#updateRecord input[name="update_file_name"]').clear().type(newFolderName); 
		cy.get('#updateRecord #file_save_button').click();
		cy.get('#updateRecord').should('not.be.visible');
		cy.get('#table_body_file tr').first().find('td:nth-child(3)').should('contain.text', newFolderName);
	});
});

describe('File | Delete File', () => {
	beforeEach(() => {
		cy.visit('http://localhost:8080/login');
		cy.get('input[name="username"]').clear().type('admin'); 
		cy.get('input[name="password"]').clear().type('123456'); 
		cy.get('#login_button').click(); 
		cy.wait(500);
		cy.visit('http://localhost:8080/dashboard/manage-file');
	});

	it('should open the delete file modal', () => {
		cy.get('#table_body_file tr').should('have.length.greaterThan', 0);
		cy.get('#table_body_file tr')
			.first()
			.find('.deleteRecord')
			.click();

		cy.get('#deleteRecord').should('be.visible');
	});

	it('should delete the first file successfully', () => { 
		cy.get('#table_body_file tr').should('have.length.greaterThan', 0);
		let fileId;
		cy.get('#table_body_file tr')
		  .first()
		  .find('td:nth-child(2)') 
		  .invoke('text')
		  .then((id) => {
			fileId = id.trim();
		  });
		cy.get('#table_body_file tr')
		  .first()
		  .find('.deleteRecord')
		  .click();
		cy.get('#deleteRecord').should('be.visible');
		cy.wait(50); 
		cy.get('#deleteRecord #folder_delete_button').click();
		cy.get('#deleteRecord').should('not.be.visible');
		cy.get('#table_body_file tr')
		  .should('not.contain', fileId);
	});
});

describe('File | Search Sort Pagination', () => {
	beforeEach(() => {
		cy.visit('http://localhost:8080/login');
		cy.get('input[name="username"]').clear().type('admin'); 
		cy.get('input[name="password"]').clear().type('123456'); 
		cy.get('#login_button').click(); 
		cy.wait(1000);
		cy.visit('http://localhost:8080/dashboard/manage-file');
	});

	it('should update the number of records displayed per page', () => {
		cy.get('#file_per_page').select('10');
		cy.get('#table_body_file tr').should('have.length', 10);
		cy.get('#file_per_page').select('5');
		cy.get('#table_body_file tr').should('have.length', 5);
	});

	it('should sort the records by the selected field', () => {
		cy.get('#file_sort_by').select('name');
		cy.get('#table_body_file tr td:nth-child(3)').then(($cells) => {
			const textValues = $cells.map((i, el) => Cypress.$(el).text()).get();
			const sortedValues = [...textValues].sort().reverse(); 
			expect(textValues).to.deep.equal(sortedValues);
		});
	});
	
	it('should filter the table based on the search input', () => {
		cy.get('button[data-target="#addRecord"]').click();
		cy.get('#select_id_folder').click(); 
		cy.get('ul.multiselect-options > li').first().click({ force: true });
		const fileName = 'e2e_file_upload_benh_ho_van_tim.txt'; 
		cy.fixture(fileName).then(fileContent => {
			cy.get('input[type="file"]').attachFile({
				fileContent,
				fileName,
				mimeType: 'text/plain' 
			});
		});
		cy.get('#file_add_button').click();
		cy.visit('http://localhost:8080/dashboard/manage-file');
		const searchText = fileName;
		cy.get('#file_input_search').invoke('val', searchText).trigger('input');
		cy.wait(500);
		cy.get('#table_body_file tr').each(($row) => {
			cy.wrap($row).find('td:nth-child(3)').should('contain.text', searchText);
		});
		cy.get('#file_input_search').clear().trigger('input');
		cy.wait(500);
		cy.get('#table_body_file tr').should('have.length.greaterThan', 0);
	});

	it('should not find any files when searching with a non-existent name', () => {
		const nonExistentSearchText = 'NonExistentFileName12345';
		cy.get('#file_input_search').invoke('val', nonExistentSearchText).trigger('input');
		cy.wait(500);
		cy.get('#table_body_file tr').should('have.length', 0);
		cy.get('#file_input_search').clear().trigger('input');
		cy.wait(500);
		cy.get('#table_body_file tr').should('have.length.greaterThan', 0);
	});
});
