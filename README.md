# FastackDesktop

## Features

Context switching task manager, that organizes tasks based on priority and time. Tasks are added to a stack and items are completed from the top of the stack downwards. Once a task is complete it is popped off the stack. Users can clock in and clock out and the time taken on each task can be recorded. There is also a notes editor that allows users to enter information in markdown format and provides users with the capability to create tables, charts, and uml diagrams. Currently the github functionality is implemented but the utility functions for dropbox and google drive are upcoming features. 

![image info](https://raw.githubusercontent.com/ssajnani/FastackDesktop/master/demo/fastack_main.PNG)

Once a user logs in through a github portal a stack creation page is displayed where the user can name their stack and provide a password to encrypt their stack.

![image info](https://raw.githubusercontent.com/ssajnani/FastackDesktop/master/demo/stack_creation.PNG)

If a stack already exists and is encrypted the user will be prompted for the password.

![image info](https://raw.githubusercontent.com/ssajnani/FastackDesktop/master/demo/enter_password.PNG)

Once a stack is created the user is prompted to create a new task.

![image info](https://raw.githubusercontent.com/ssajnani/FastackDesktop/master/demo/new_task.PNG)

In the creation process, only the name is a required field. There is also a notes section that allows users to enter markdown. Once the user focuses on the notes input box a display of the markdown being compiled is shown, as demonstrated below.

Unfocused:

![image info](https://raw.githubusercontent.com/ssajnani/FastackDesktop/master/demo/notes_closed.PNG)

Focused:

![image info](https://raw.githubusercontent.com/ssajnani/FastackDesktop/master/demo/notes_open.PNG)

Once tasks are created they are automatically organized based on time, with overdue items having the highest priority, no date items being the next highest, then items that are due today, and finally items that are upcoming. In addition to time, items are also sorted based on priority, with values from 1 to 100. These characteristics are shown in the gif below. The gif also shows that big task names have a rollover effect to go over name information.

![image info](https://raw.githubusercontent.com/ssajnani/FastackDesktop/master/demo/fastack_rollover.PNG)

So far users can also clock in and clock out based on the duration provided during task creation. If no duration was provided the task will count down from 0 seconds. These features are shown in the gif below.

![image info](https://raw.githubusercontent.com/ssajnani/FastackDesktop/master/demo/clockin_clockout.PNG)
