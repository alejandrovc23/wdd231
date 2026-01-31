const courses = [
    {
        code: "CSE 110",
        subject: "CSE",
        number: "110",
        name: "Introduction to Programming",
        title: "Intro to Programming",
        credits: 2,
        completed: true,
        description: "Learn the fundamental concepts of programming using Python. This course covers variables, data types, control structures, and functions.",
        certificate: "Web and Computer Programming",
        technology: ["Python", "Problem Solving", "Algorithms"]
    },
    {
        code: "WDD 130",
        subject: "WDD",
        number: "130",
        name: "Web Fundamentals",
        title: "Web Fundamentals",
        credits: 2,
        completed: true,
        description: "Master the basics of web development including HTML5, CSS3, and responsive design. Create semantic, accessible web pages.",
        certificate: "Web and Computer Programming",
        technology: ["HTML5", "CSS3", "Responsive Design"]
    },
    {
        code: "CSE 111",
        subject: "CSE",
        number: "111",
        name: "Programming with Functions",
        title: "Programming with Functions",
        credits: 2,
        completed: true,
        description: "Extend your programming skills by learning functions, modularization, and code reusability. Build more complex applications.",
        certificate: "Web and Computer Programming",
        technology: ["Python", "Functions", "Modules"]
    },
    {
        code: "CSE 210",
        subject: "CSE",
        number: "210",
        name: "Programming with Classes",
        title: "Programming with Classes",
        credits: 2,
        completed: true,
        description: "Understand object-oriented programming with classes, inheritance, and polymorphism. Design robust applications using OOP principles.",
        certificate: "Web and Computer Programming",
        technology: ["OOP", "Classes", "Design Patterns"]
    },
    {
        code: "WDD 131",
        subject: "WDD",
        number: "131",
        name: "Dynamic Web Fundamentals",
        title: "Dynamic Web Fundamentals",
        credits: 2,
        completed: true,
        description: "Learn JavaScript to create interactive web pages. Handle events, manipulate the DOM, and build dynamic user experiences.",
        certificate: "Web and Computer Programming",
        technology: ["JavaScript", "DOM", "Events"]
    },
    {
        code: "WDD 231",
        subject: "WDD",
        number: "231",
        name: "Frontend Web Development I",
        title: "Frontend Web Development I",
        credits: 2,
        completed: false,
        description: "Advanced frontend development techniques including modules, APIs, local storage, and modern web standards. Build professional web applications.",
        certificate: "Web and Computer Programming",
        technology: ["JavaScript", "APIs", "Web Storage", "ES6 Modules"]
    }
];

let filteredCourses = courses;
const courseDetailsDialog = document.getElementById('course-details');

function displayCourseDetails(course) {
    courseDetailsDialog.innerHTML = `
        <button id="closeModal" aria-label="Close dialog">❌</button>
        <h2>${course.subject} ${course.number}</h2>
        <h3>${course.title}</h3>
        <p><strong>Credits:</strong> ${course.credits}</p>
        <p><strong>Certificate:</strong> ${course.certificate}</p>
        <p>${course.description}</p>
        <p><strong>Technologies:</strong> ${course.technology.join(', ')}</p>
    `;
    courseDetailsDialog.showModal();

    document.getElementById('closeModal').addEventListener('click', () => {
        courseDetailsDialog.close();
    });

    courseDetailsDialog.addEventListener('click', (event) => {
        if (event.target === courseDetailsDialog) {
            courseDetailsDialog.close();
        }
    });
}

function displayCourses(courses) {
    const container = document.getElementById('courses-container');
    container.innerHTML = '';
    courses.forEach(course => {
        const card = document.createElement('div');
        card.className = 'course-card';
        if (course.completed) {
            card.classList.add('completed');
        }
        card.innerHTML = `
            <h3>${course.code}</h3>
            <p>${course.name}</p>
            <p>Credits: ${course.credits}</p>
        `;
        card.addEventListener('click', () => {
            displayCourseDetails(course);
        });
        container.appendChild(card);
    });
    updateTotalCredits(courses);
}

function updateTotalCredits(courses) {
    const total = courses.reduce((sum, course) => sum + course.credits, 0);
    document.getElementById('total-credits').textContent = total;
}

document.getElementById('all').addEventListener('click', () => {
    filteredCourses = courses;
    displayCourses(filteredCourses);
});

document.getElementById('wdd').addEventListener('click', () => {
    filteredCourses = courses.filter(course => course.code.startsWith('WDD'));
    displayCourses(filteredCourses);
});

document.getElementById('cse').addEventListener('click', () => {
    filteredCourses = courses.filter(course => course.code.startsWith('CSE'));
    displayCourses(filteredCourses);
});

// Initial display
displayCourses(filteredCourses);