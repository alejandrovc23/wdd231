const membersContainer = document.querySelector("#members");
const gridBtn = document.querySelector("#grid");
const listBtn = document.querySelector("#list");

async function getMembers() {
    const response = await fetch("data/members.json");
    const data = await response.json();
    displayMembers(data);
}

function displayMembers(members) {
    membersContainer.innerHTML = "";
    members.forEach(member => {
        const section = document.createElement("section");
        section.classList.add("member");

        const membershipText = member.membership === 1 ? 'Member' : member.membership === 2 ? 'Silver' : 'Gold';
        const membershipClass = member.membership === 1 ? 'member-level' : member.membership === 2 ? 'silver-level' : 'gold-level';
        section.classList.add(membershipClass);

        section.innerHTML = `
      <img src="images/${member.image}" alt="${member.name}">
      <h2>${member.name}</h2>
      <p><strong>Membership:</strong> ${membershipText}</p>
      <p>${member.address}</p>
      <p>${member.phone}</p>
      <a href="${member.website}" target="_blank">Visit Website</a>
      <p>${member.description}</p>
    `;

        membersContainer.appendChild(section);
    });
}

gridBtn.addEventListener("click", () => {
    membersContainer.classList.add("grid");
    membersContainer.classList.remove("list");
    gridBtn.classList.add("active");
    listBtn.classList.remove("active");
});

listBtn.addEventListener("click", () => {
    membersContainer.classList.add("list");
    membersContainer.classList.remove("grid");
    listBtn.classList.add("active");
    gridBtn.classList.remove("active");
});

getMembers();
