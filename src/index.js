document.addEventListener("DOMContentLoaded", function () {
    const dogTable = document.querySelector("#dog-table tbody");
    const dogForm = document.querySelector("#dog-form");
    let currentDogId = null;

    // Fetch all dogs and display them in the table
    function fetchDogs() {
        fetch("http://localhost:3000/dogs")
            .then(response => response.json())
            .then(dogs => {
                dogTable.innerHTML = "";
                dogs.forEach(dog => renderDogRow(dog));
            });
    }

    // Render a dog row in the table
    function renderDogRow(dog) {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${dog.name}</td>
            <td>${dog.breed}</td>
            <td>${dog.sex}</td>
            <td><button class="edit-btn" data-id="${dog.id}">Edit</button></td>
        `;
        
        row.querySelector(".edit-btn").addEventListener("click", () => populateForm(dog));
        dogTable.appendChild(row);
    }

    // Populate the form with dog's current data
    function populateForm(dog) {
        dogForm.name.value = dog.name;
        dogForm.breed.value = dog.breed;
        dogForm.sex.value = dog.sex;
        currentDogId = dog.id;
    }

    // Handle form submission to update dog information
    dogForm.addEventListener("submit", function (event) {
        event.preventDefault();
        if (!currentDogId) return;

        const updatedDog = {
            name: dogForm.name.value,
            breed: dogForm.breed.value,
            sex: dogForm.sex.value,
        };

        fetch(`http://localhost:3000/dogs/${currentDogId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updatedDog)
        })
        .then(response => response.json())
        .then(() => {
            fetchDogs(); // Refresh the table
            dogForm.reset();
            currentDogId = null;
        });
    });

    // Initial fetch of dogs
    fetchDogs();
});