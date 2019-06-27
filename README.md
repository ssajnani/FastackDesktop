# FastackDesktop

## Features

Context switching task manager, that organizes tasks based on priority and time. Tasks are added to a stack and items are completed from the top of the stack downwards. Once a task is complete it is popped off the stack. Users can clock in and clock out and the time taken on each task can be recorded. There is also a notes editor that allows users to enter information in markdown format and provides users with the capability to create tables, charts, and uml diagrams. Currently the github functionality is implemented but the utility functions for dropbox and google drive are upcoming features. 

![image info](https://raw.githubusercontent.com/ssajnani/FastackDesktop/master/demo/fastack_main.PNG)

Once a user logs in through a github portal a stack creation page is displayed where the user can name their stack and provide a password to encrypt their stack.

![image info](https://raw.githubusercontent.com/ssajnani/FastackDesktop/master/demo/stack_creation.PNG)

Once a stack is created the user is prompted to create a new task.

![image info](https://raw.githubusercontent.com/ssajnani/FastackDesktop/master/demo/new_task.PNG)

In the creation process, only the name is a required field. There is also a notes section that allows users to enter markdown. Once the user focuses on the notes input box a display of the markdown being compiled is shown, as demonstrated below.

Unfocused:

![image info](https://raw.githubusercontent.com/ssajnani/FastackDesktop/master/demo/notes_closed.PNG)

Focused:

![image info](https://raw.githubusercontent.com/ssajnani/FastackDesktop/master/demo/notes_open.PNG)
