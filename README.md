# Chat Application

This project is a practice application to understand and apply socket functionality. It is a working online chat where users can create accounts, log in, delete accounts, and send messages. The chat application uses client-side and server-side code to communicate with each other through sockets.
All logic is coded in TypeScript.

## Features

- User authentication: Users can create accounts with a unique username and password. Duplicate usernames are not allowed.
- Login: Users can log in to their accounts with the correct username and password.
- Account deletion: Users can delete their accounts after confirming their password.
- Real-time messaging: Users can send and receive messages in real time within the chat.
- User connectivity: Users can view the list of currently connected users in the chat.
- System notifications: Users receive notifications when other users connect or disconnect from the chat.

## Project Structure

The project structure is organized as follows:

- client/                  # Client-side code
  - build/                 # Compiled and bundled files (auto-generated)
  - node_modules/          # Client-side dependencies (ignored)
  - public/                # Public assets and index.html. Contains videos and images applied to the client
  - src/                   # Source code for the client
    - components/          # React components
    - fonts/               # Fonts applied to the client
    - index.tsx            # Entry point for the client-side application
    - reportWebVitals.tsx  # Performance measurement (default from Create React App)
  - .gitignore             # Git ignore file for the client-side code
  - package.json           # Package file for the client-side code
  - package-lock.json      # Package lock file for the client-side code
  - README.md              # README file for the client-side code (default from Create React App)
- server/                  # Server-side code
  - backend/               # Backend code
    - controllers/         # Controllers for handling requests
    - db/                  # Database related code
    - models/              # Data models for backend
  - messages/              # Message related code
    - controllers/         # Controllers for handling message requests
    - models/              # Data models for messages
  - users/                 # User related code
    - controllers/         # Controllers for handling user requests
    - models/              # Data models for users
  - index.ts               # Entry point for the server-side application
- .eslintrc.json           # ESLint configuration file
- .gitignore               # Git ignore file for the entire project
- .prettierrc              # Prettier configuration file
- package.json             # Package file for the entire project
- package-lock.json        # Package lock file for the entire project
- tsconfig.json            # TypeScript configuration file
- tsconfig.eslint.json     # TypeScript ESLint configuration file
- README.md                # Project README file (you're currently reading it)


## Getting Started

To run the chat application locally, follow these steps:

1. Clone the repository:

gh repo clone PaudelaGC/Sprint5Xat

2. Install dependencies for the client-side and server-side code:

npm install (at root folder)
cd client/
npm install

3. Build the client-side code: (optional)

cd client/
npm run build

4. Start the server-side code and the client-side code:

npm start (at root folder)
cd client/
npm start

5. Access the chat application in your browser at http://localhost:3000.

## Dependencies
The project dependencies are managed using npm and listed in the package.json files for the client-side and server-side code.

## Known Issues

1. At server/src/messages/controllers/connectionMessageController.ts: In this part of the code, connections are searched twice due to
an issue with the asynchronous functions of the project in which sometimes the connection would not be found properly in only one search.
To ensure that the connection is always found and surpass this problem, it is necessary to search it twice, which is bad practice.

2. At client/src folder, all files that include imports from any other .tsx file get a typescript error stating that the extension must be
removed from the import. If this is performed, the client is unable to find the modules withouth extension. If the typescript configuration is
modified to admit this condition, compatibility issues appear with the server-side configuration. By leaving it unchanged, the client allows
the code to be executed even with the typescript error.

## License
This project is licensed under the MIT License.
