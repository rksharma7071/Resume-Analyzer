import dotenv from "dotenv";
dotenv.config();
import app from "./src/app.js";
import connectToDB from "./src/config/database.js";
import dns from "dns";
import { generateInterviewReport } from "./src/services/ai.service.js";

dns.setServers(["8.8.8.8", "8.8.4.4"]);


connectToDB();

const resume = `Retesh Kumar Sharma

MERN Stack Developer | React.js Developer | Full Stack JavaScript Developer

Professional Summary:
MERN Stack Developer with 2.5+ years of experience building scalable and responsive web applications using JavaScript, React.js, Node.js, Express.js, and MongoDB. Experienced in developing RESTful APIs, authentication systems, role-based access control, database integration, and modern frontend applications. Comfortable working with Git, Agile methodologies, and third-party APIs.

Technical Skills:
- Languages: JavaScript (ES6+), HTML5, CSS3
- Frontend: React.js, Redux Toolkit, React Router, Vite, Tailwind CSS
- Backend: Node.js, Express.js, REST APIs
- Database: MongoDB, Mongoose, SQL basics
- Authentication: JWT, bcrypt, Role-Based Access Control
- Tools: Git, GitHub, Postman, VS Code
- E-commerce: Shopify, Shopify Liquid, Shopify App Development
- Other: Socket.io, Razorpay, Cloudinary

Professional Experience:

Software Engineer — FirstWire Apps, Lucknow
October 2023 – Present

- Developed and maintained web applications using React.js, Node.js, Express.js, and MongoDB.
- Built reusable React components and responsive user interfaces using Tailwind CSS.
- Developed RESTful APIs using Node.js and Express.js.
- Implemented JWT-based authentication and role-based authorization.
- Designed MongoDB schemas and implemented CRUD operations using Mongoose.
- Integrated third-party services including Razorpay and Cloudinary.
- Worked on Shopify applications and custom Shopify themes.
- Optimized API responses and frontend rendering for large datasets.
- Collaborated with developers and other stakeholders in an Agile development environment.
- Used Git and GitHub for version control and collaborative development.

Projects:

SchoolBooks — E-commerce Platform
- Built a full-stack e-commerce platform using React, Node.js, Express, MongoDB, and Tailwind CSS.
- Implemented product variants, categories, cart, orders, reviews, discounts, and user management.
- Developed authentication and role-based access control.
- Integrated payment processing using Razorpay.
- Created RESTful APIs for frontend-backend communication.

Chatters — Real-Time Chat Application
- Developed a real-time chat application using React.js, Node.js, Express.js, MongoDB, and Socket.io.
- Implemented JWT authentication and protected routes.
- Added real-time messaging functionality using WebSockets.
- Designed responsive chat interfaces using React and Tailwind CSS.

Education:

Bachelor of Technology in Information Technology
RR Institute of Modern Technology, Lucknow
CGPA: 8.2/10
Graduated: 2023`;

const selfDescription = `I am a MERN Stack Developer with around 2.5 years of professional experience. My strongest skills are React.js, JavaScript, Node.js, Express.js, MongoDB, and REST API development.
In my current role, I work on both frontend and backend development. I have experience building responsive React applications, creating APIs with Node.js and Express, designing MongoDB schemas, implementing JWT authentication and role-based access control, and integrating third-party services.
I have worked on e-commerce applications, real-time chat applications, and Shopify-related projects. I enjoy solving technical problems, improving application performance, and writing clean and maintainable code.
I am currently looking for a MERN Stack Developer role where I can work on scalable applications, improve my backend and system design skills, and contribute to a strong engineering team.`

const jobDescription = `Job Title: MERN Stack Developer

Company: TechNova Solutions

Experience: 2–4 Years

Job Description:

We are looking for a skilled MERN Stack Developer to join our engineering team. The ideal candidate should have hands-on experience developing modern web applications using React.js, Node.js, Express.js, and MongoDB.

Responsibilities:

- Develop and maintain scalable web applications using the MERN stack.
- Build reusable and responsive frontend components using React.js.
- Develop secure and scalable RESTful APIs using Node.js and Express.js.
- Design and optimize MongoDB databases using Mongoose.
- Implement authentication and authorization using JWT and role-based access control.
- Integrate third-party APIs and external services.
- Write clean, reusable, and maintainable JavaScript code.
- Identify and resolve application bugs and performance issues.
- Collaborate with designers, backend developers, QA engineers, and product managers.
- Participate in code reviews and Agile development processes.
- Use Git and GitHub for source control and collaboration.
- Write unit and integration tests for critical application functionality.

Required Skills:

- 2+ years of professional experience in MERN stack development.
- Strong knowledge of JavaScript and ES6+.
- Strong experience with React.js.
- Good knowledge of Node.js and Express.js.
- Experience with MongoDB and Mongoose.
- Experience building RESTful APIs.
- Understanding of JWT authentication and authorization.
- Knowledge of Git and GitHub.
- Good understanding of HTML5 and CSS3.
- Strong problem-solving and debugging skills.

Good to Have:

- Experience with TypeScript.
- Experience with Redux Toolkit.
- Experience with Tailwind CSS.
- Experience with Docker.
- Basic knowledge of AWS.
- Experience with Socket.io or real-time applications.
- Experience with payment gateway integration.
- Understanding of basic system design concepts.

Education:

Bachelor's degree in Computer Science, Information Technology, or a related field.`


generateInterviewReport({ resume, selfDescription, jobDescription })

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});