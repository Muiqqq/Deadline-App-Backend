DROP PROCEDURE IF EXISTS CreateExampleTodoDB;
DELIMITER $$

CREATE PROCEDURE CreateExampleTodoDB()
BEGIN
  
  DECLARE EXIT HANDLER FOR SQLEXCEPTION
  BEGIN
    ROLLBACK;
  END;

  START TRANSACTION;

  DROP TABLE IF EXISTS todos;
  DROP TABLE IF EXISTS lists;

  CREATE TABLE IF NOT EXISTS lists (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(80) NOT NULL,
    PRIMARY KEY (id)
  );

  -- describe lists output
  -- +-------+-------------+------+-----+---------+----------------+
  -- | Field | Type        | Null | Key | Default | Extra          |
  -- +-------+-------------+------+-----+---------+----------------+
  -- | id    | int         | NO   | PRI | NULL    | auto_increment |
  -- | name  | varchar(80) | NO   |     | NULL    |                |
  -- +-------+-------------+------+-----+---------+----------------+

  CREATE TABLE IF NOT EXISTS todos (
    id INT NOT NULL AUTO_INCREMENT,
    date_created DATE NOT NULL,
    date_deadline DATE,
    name VARCHAR(80) NOT NULL,
    description VARCHAR(400) DEFAULT '',
    priority INT DEFAULT 0,
    is_done BOOLEAN DEFAULT false,
    listid INT DEFAULT 1,
    CONSTRAINT FK_TodosLists FOREIGN KEY (listid)
    REFERENCES lists(id)
    ON DELETE CASCADE,
    PRIMARY KEY (id)
  );

  -- describe todos output
  -- +---------------+--------------+------+-----+---------+----------------+
  -- | Field         | Type         | Null | Key | Default | Extra          |
  -- +---------------+--------------+------+-----+---------+----------------+
  -- | id            | int          | NO   | PRI | NULL    | auto_increment |
  -- | date_deadline | date         | YES  |     | NULL    |                |
  -- | date_created  | date         | NO   |     | NULL    |                |
  -- | name          | varchar(80)  | NO   |     | NULL    |                |
  -- | description   | varchar(400) | YES  |     |         |                |
  -- | priority      | int          | YES  |     | 0       |                |
  -- | is_done       | tinyint(1)   | YES  |     | 0       |                |
  -- | listid        | int          | YES  | MUL | 1       |                |
  -- +---------------+--------------+------+-----+---------+----------------+

  -- Dummy data examples

  -- lists
  INSERT INTO lists (name)
  VALUES ('deadlines'),
        ('miscellaneous'),
        ('tutorial')
  ;

  -- todos
  INSERT INTO todos
  SET
    date_deadline = '2020-12-02',
    date_created = NOW(),
    name = 'First release of rest api for todo app',
    description = 'Everything will work exactly as planned yep.',
    priority = 1,
    listid = 1
  ;

  INSERT INTO todos
  SET
    date_deadline = '2020-12-20',
    date_created = NOW(),
    name = 'Second release of rest api for todo app',
    description = 'The api is definitely finished at this point yep.',
    priority = 1,
    listid = 1
  ;

  INSERT INTO todos
  SET
    date_deadline = '2020-12-20',
    date_created = NOW(),
    name = 'Document code',
    priority = 1,
    listid = 1
  ;

  INSERT INTO todos
  SET
    date_deadline = '2020-11-25',
    date_created = NOW(),
    name = 'Pest control',
    description = 'Nothing to see here',
    priority = 2,
    listid = 2
  ;

  INSERT INTO todos
  SET
    date_deadline = '2020-12-02',
    date_created = NOW(),
    name = 'Add more dummy data to db',
    priority = 3,
    listid = 1
  ;

  INSERT INTO todos
  SET
    date_deadline = '2020-12-01',
    date_created = NOW(),
    name = 'Fill dropbox paper',
    priority = 2,
    listid = 1
  ;

  INSERT INTO todos
  SET
    date_deadline = '2020-12-03',
    date_created = NOW(),
    name = 'Drink a beer to a successful release',
    priority = 3,
    listid= 1
  ;

  INSERT INTO todos
  SET
    date_deadline = '2020-11-24',
    date_created = NOW(),
    name = 'Milk for the crocodiles',
    priority = 3,
    listid = 2
  ;

  INSERT INTO todos
  SET
    date_created = NOW(),
    name = 'Go to sleep',
    priority = 3,
    listid = 2
  ;

  INSERT INTO todos
  SET 
    date_created = NOW(),
    name = 'Check email',
    description = 'Dont forget to empty spam folder!',
    listid = 2
  ;

  INSERT INTO todos
  SET
    date_created = NOW(),
    date_deadline = '2020-12-18',
    name = 'Buy gifts',
    priority = 2,
    listid = 2
  ;

  INSERT INTO todos
  SET
    date_created = NOW(),
    date_deadline = '2020-12-24',
    name = 'Give gifts',
    priority = 1,
    listid = 2
  ;

  INSERT INTO todos
  SET
    date_created = NOW(),
    name = 'Press this task to access additional information.',
    description = 'Pressing the task shows you the description and additional features, such as edit and delete.',
    listid = 3
  ;

  INSERT INTO todos
  SET
    date_created = NOW(),
    name = 'Mark a task as completed. (Click here to see how)',
    description = 'Press the checkbox located next to the tasks name.',
    listid = 3
  ;

  INSERT INTO todos
  SET
    date_created = NOW(),
    name = 'Add a deadline to this task.',
    description = 'Press the edit button, add a date (or change the task as you see fit) and then press the big green button of the form.',
    listid = 3
  ;

  INSERT INTO todos
  SET
    date_created = NOW(),
    name = 'Delete this task.',
    description = 'Press the delete button.',
    listid = 3
  ;

  COMMIT;

END $$

DELIMITER ;

CALL CreateExampleTodoDB();
-- End of file
