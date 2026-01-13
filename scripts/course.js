const courses = [
    {
        code: "CSE 110",
        name: "Introduction to Programming",
        credits: 3,
        completed: true
    },
    {
        code: "WDD 130",
        name: "Web Fundamentals",
        credits: 3,
        completed: true
    },
    {
        code: "CSE 111",
        name: "Programming with Functions",
        credits: 3,
        completed: true
    },
    {
        code: "CSE 210",
        name: "Programming with Classes",
        credits: 3,
        completed: true
    },
    {
        code: "WDD 131",
        name: "Dynamic Web Fundamentals",
        credits: 3,
        completed: true
    },
    {
        code: "WDD 231",
        name: "Frontend Web Development I",
        credits: 3,
        completed: false
    }
];

let filteredCourses = courses;

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