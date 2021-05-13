const baseURL = 'http://localhost:8081';


const initResetButton = () => {
    // if you want to reset your DB data, click this button:
    document.querySelector('#reset').onclick = ev => {
        fetch(`${baseURL}/reset/`)
            .then(response => response.json())
            .then(data => {
                console.log('reset:', data);
            });
    };
};

const allDoctors = () => {
    document.querySelector('#doctorList').innerHTML = "";
    fetch(`${baseURL}/doctors`)
        .then(request => request.json())
        .then(doctors => {
            doctors.forEach(doctor => {
                document.querySelector('#doctorList').innerHTML += `
                    <li id="${doctor._id}" class="classDoctors" onclick="getDoctor('${doctor._id}')">${doctor.name}</li>
                `
            })
        })
};

const getDoctor = id => {
    // display panel showing doctor's name, picture, and seasons
    console.log("A DOCTOR IS CLICKED: " + id)
    fetch(`${baseURL}/doctors/${id}`)
        .then(response => response.json())
        .then(doctor => {
            document.querySelector('#doctor').innerHTML = "";
            document.querySelector('#doctor').innerHTML += `
            <div class="docHeader"> 
                <h1>${doctor.name}</h1>
                <div style="display: flex">
                    <p class="editButton" onclick="editDoctor('${doctor._id}', '${doctor.name}')" style="padding-right: 5px">edit</p>
                    <p class="deleteButton" onclick="deleteDoctor('${doctor._id}', '${doctor.name}')">delete</p>
                </div>
            </div>
            <img src="${doctor.image_url}">
            <p>Seasons: ${doctor.seasons}</p>
        `
        })
    fetch(`${baseURL}/doctors/${id}/companions`)
        .then(response => response.json())
        .then(companions => {
            console.log('doctor:', doctor);
            document.querySelector('#companions').innerHTML = "";
            document.querySelector('#companions').innerHTML += `
            <h1>Companions</h1>
        `
            companions.forEach(companion => {
                console.log(companion._id)
                document.querySelector('#companions').innerHTML += `
                    <div>
                    <img src="${companion.image_url}">
                    <p>${companion.name}</p>
                    </div>
                `
            })
        })
};

const cancelEdit = (id) => {
    console.log("Cancel Edit")
    fetch(`${baseURL}/doctors/${id}`)
        .then(response => response.json())
        .then(doctor => {
            document.querySelector('#doctor').innerHTML = "";
            document.querySelector('#doctor').innerHTML += `
            <div class="docHeader"> 
                <h1>${doctor.name}</h1>
                <div style="display: flex">
                    <p class="editButton" onclick="editDoctor('${doctor._id}', '${doctor.name}')" style="padding-right: 5px">edit</p>
                    <p class="deleteButton" onclick="deleteDoctor('${doctor._id}', '${doctor.name}')">delete</p>
                </div>
            </div>
            <img src="${doctor.image_url}">
            <p>Seasons: ${doctor.seasons}</p>
        `
        })
}

const deleteDoctor = (id, name) => {
    console.log("DELETE THIS DOCTOR: " + name);
    if (window.confirm("Are you sure you want to delete " + name + " ?")) {
        return fetch(`${baseURL}/doctors/${id}`, {
            method: 'DELETE'
        })
        .then(doctor => {
            console.log('deleting');
            document.querySelector('#doctor').innerHTML = "";
            document.querySelector('#companions').innerHTML = "";
            allDoctors();
        })
    }
};

const editDoctor = (id, name) => {
    console.log("Edit this doctor: " + name + " with id: " + id);
    fetch(`${baseURL}/doctors/${id}`)
        .then(response => response.json())
        .then(doctor => {
            document.querySelector('#doctor').innerHTML = `
            <form>
            <!-- Name -->
            <div>
            <label for="name"><b>Name</b></label>
            </div>
            <div>
            <input type="text" id="name" value="${doctor.name}">
            </div>

            <!-- Seasons -->
            <div>
            <label for="seasons"><b>Seasons</b></label>
            </div>
            <div>
            <input type="text" id="seasons" value="${doctor.seasons}">
            </div>

            <!-- Ordering -->
            <div>
            <label for="ordering"><b>Ordering</b></label>
            </div>
            <div>
            <input type="text" id="ordering" value="${doctor.ordering}">
            </div>

            <!-- Image -->
            <div>
            <label for="image_url"><b>Image</b></label>
            </div>
            <div>
            <input type="text" id="image_url" value="${doctor.image_url}">
            </div>

            <!-- Buttons -->
            <div style="display: flex">
                <button class="btn btn-main" id="create"><b>Save</b></button>
                <input class="btn" id="cancelButton" type="button" value="Cancel"></button>
            </div>
            </form>`

            document.getElementById("create").addEventListener("click", function() { onEdit(id) })
            document.getElementById("cancelButton").addEventListener("click", function() { cancelEdit(id) })
        }
    );
}

const addNewDoctor = () => {
    document.querySelector('#doctor').innerHTML = `
    <form>
    <!-- Name -->
    <div>
    <label for="name"><b>Name</b></label>
    </div>
    <div>
    <input type="text" id="name">
    </div>

    <!-- Seasons -->
    <div>
    <label for="seasons"><b>Seasons</b></label>
    </div>
    <div>
    <input type="text" id="seasons">
    </div>

    <!-- Ordering -->
    <div>
    <label for="ordering"><b>Ordering</b></label>
    </div>
    <div>
    <input type="text" id="ordering">
    </div>

    <!-- Image -->
    <div>
    <label for="image_url"><b>Image</b></label>
    </div>
    <div>
    <input type="text" id="image_url">
    </div>

    <!-- Buttons -->
    <div>
    <button class="btn btn-main" id="create"><b>Save</b></button>
    <button class="btn" id="cancel">Cancel</button>
    </div>
    </form>`

    document.getElementById("create").addEventListener("click", onSave)
    //document.getElementById("cancel").addEventListener("click", onCancel)
    document.querySelector('#companions').innerHTML = ""; 

}


const onEdit = (id) => {
    console.log("onEdit");
    const name = document.getElementById('name').value;
    const seasons = document.getElementById('seasons').value; 
    const ordering = document.getElementById('ordering').value; 
    const image = document.getElementById('image_url').value; 
    
    if (name == "") {
        document.querySelector('#doctor').innerHTML = `
        <p id="error">Name is a required field</p>
        <form>
        <!-- Name -->
        <div>
        <label for="name"><b>Name</b></label>
        </div>
        <div>
        <input type="text" id="name" value=${name}>
        </div>
    
        <!-- Seasons -->
        <div>
        <label for="seasons"><b>Seasons</b></label>
        </div>
        <div>
        <input type="text" id="seasons" value=${seasons}>
        </div>
    
        <!-- Ordering -->
        <div>
        <label for="ordering"><b>Ordering</b></label>
        </div>
        <div>
        <input type="text" id="ordering" value=${ordering}>
        </div>
    
        <!-- Image -->
        <div>
        <label for="image_url"><b>Image</b></label>
        </div>
        <div>
        <input type="text" id="image_url" value=${image}>
        </div>
    
        <!-- Buttons -->
        <div style="display: flex">
            <button class="btn btn-main" id="create"><b>Save</b></button>
            <input class="btn" id="cancelButton" type="button" value="Cancel"></button>
        </div>
        </form>`

        document.getElementById("create").addEventListener("click", function() { onEdit(id) })
        document.getElementById("cancelButton").addEventListener("click", function() { cancelEdit(id) })
    }

    else if (seasons == "") {
        document.querySelector('#doctor').innerHTML = `
        <p id="error">Seasons is a required field</p>
        <form>
        <!-- Name -->
        <div>
        <label for="name"><b>Name</b></label>
        </div>
        <div>
        <input type="text" id="name" value=${name}>
        </div>
    
        <!-- Seasons -->
        <div>
        <label for="seasons"><b>Seasons</b></label>
        </div>
        <div>
        <input type="text" id="seasons" value=${seasons}>
        </div>
    
        <!-- Ordering -->
        <div>
        <label for="ordering"><b>Ordering</b></label>
        </div>
        <div>
        <input type="text" id="ordering" value=${ordering}>
        </div>
    
        <!-- Image -->
        <div>
        <label for="image_url"><b>Image</b></label>
        </div>
        <div>
        <input type="text" id="image_url" value=${image}>
        </div>
    
        <!-- Buttons -->
        <div style="display: flex">
            <button class="btn btn-main" id="create"><b>Save</b></button>
            <input class="btn" id="cancelButton" type="button" value="Cancel"></button>
        </div>
        </form>`

        document.getElementById("create").addEventListener("click", function() { onEdit(id) })
        document.getElementById("cancelButton").addEventListener("click", function() { cancelEdit(id) })
    }

    else {
        var seasonsList = seasons.split(",")
        var seasonsIncorrect = false; 
        for (var i = 0; i < seasonsList.length; i++)
        {
            if (!Number.isInteger(parseInt(seasonsList[i])))
            {
                seasonsIncorrect = true; 
                document.querySelector('#doctor').innerHTML = `
                <p id="error">Please verify that your "seasons" entry is correct.</p>
                <form>
                <!-- Name -->
                <div>
                <label for="name"><b>Name</b></label>
                </div>
                <div>
                <input type="text" id="name" value=${name}>
                </div>
            
                <!-- Seasons -->
                <div>
                <label for="seasons"><b>Seasons</b></label>
                </div>
                <div>
                <input type="text" id="seasons" value=${seasons}>
                </div>
            
                <!-- Ordering -->
                <div>
                <label for="ordering"><b>Ordering</b></label>
                </div>
                <div>
                <input type="text" id="ordering" value=${ordering}>
                </div>
            
                <!-- Image -->
                <div>
                <label for="image_url"><b>Image</b></label>
                </div>
                <div>
                <input type="text" id="image_url" value=${image}>
                </div>
            
                <!-- Buttons -->
                <div style="display: flex">
                    <button class="btn btn-main" id="create"><b>Save</b></button>
                    <input class="btn" id="cancelButton" type="button" value="Cancel"></button>
                </div>
                </form>`

                document.getElementById("create").addEventListener("click", function() { onEdit(id) })
                document.getElementById("cancelButton").addEventListener("click", function() { cancelEdit(id) })
            }
        }

        if (!seasonsIncorrect)
        {
            fetch(`${baseURL}/doctors/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                }, 
                body: JSON.stringify({
                    "name": name, 
                    "seasons": seasonsList, 
                    "ordering": ordering, 
                    "image_url": image
                })
            })
            .then(response => response.json())
            .then(newDoctor => {
                document.querySelector('#doctor').innerHTML = "";
                document.querySelector('#doctor').innerHTML += `
                <div class="docHeader"> 
                    <h1>${newDoctor.name}</h1>
                    <div style="display: flex">
                        <p class="editButton" onclick="editDoctor('${newDoctor._id}', '${newDoctor.name}')" style="padding-right: 5px">edit</p>
                        <p class="deleteButton" onclick="deleteDoctor('${newDoctor._id}', '${newDoctor.name}')">delete</p>
                    </div>
                </div>
                <img src="${newDoctor.image_url}">
                <p>Seasons: ${newDoctor.seasons}</p>
            `
            allDoctors(); 
                })
            fetch(`${baseURL}/doctors/${id}/companions`)
            .then(response => response.json())
            .then(companions => {
                console.log('doctor:', doctor);
                document.querySelector('#companions').innerHTML = "";
                document.querySelector('#companions').innerHTML += `
                <h1>Companions</h1>
            `
                companions.forEach(companion => {
                    console.log(companion._id)
                    document.querySelector('#companions').innerHTML += `
                        <div>
                        <img src="${companion.image_url}">
                        <p>${companion.name}</p>
                        </div>
                    `
                })
            })
        }
    } 
    event.preventDefault(); 
}

async function onCancel() {
    console.log("Cancel button was clicked")
    document.querySelector('#doctor').innerHTML = ""
}

async function onSave() {
    console.log("Save button was clicked")
    const name = document.getElementById('name').value;
    const seasons = document.getElementById('seasons').value; 
    const ordering = document.getElementById('ordering').value; 
    const image = document.getElementById('image_url').value; 
    
    if (name == "") {
        document.querySelector('#doctor').innerHTML = `
        <p id="error">Name is a required field</p>
        <form>
        <!-- Name -->
        <div>
        <label for="name"><b>Name</b></label>
        </div>
        <div>
        <input type="text" id="name" value=${name}>
        </div>
    
        <!-- Seasons -->
        <div>
        <label for="seasons"><b>Seasons</b></label>
        </div>
        <div>
        <input type="text" id="seasons" value=${seasons}>
        </div>
    
        <!-- Ordering -->
        <div>
        <label for="ordering"><b>Ordering</b></label>
        </div>
        <div>
        <input type="text" id="ordering" value=${ordering}>
        </div>
    
        <!-- Image -->
        <div>
        <label for="image_url"><b>Image</b></label>
        </div>
        <div>
        <input type="text" id="image_url" value=${image}>
        </div>
    
        <!-- Buttons -->
        <div>
        <button class="btn btn-main" id="create"><b>Save</b></button>
        <button class="btn" id="cancel">Cancel</button>
        </div>
        </form>`

        document.getElementById("create").addEventListener("click", onSave)
        //document.getElementById("cancel").addEventListener("click", onCancel)
    }

    else if (seasons == "") {
        document.querySelector('#doctor').innerHTML = `
        <p id="error">Seasons is a required field</p>
        <form>
        <!-- Name -->
        <div>
        <label for="name"><b>Name</b></label>
        </div>
        <div>
        <input type="text" id="name" value=${name}>
        </div>
    
        <!-- Seasons -->
        <div>
        <label for="seasons"><b>Seasons</b></label>
        </div>
        <div>
        <input type="text" id="seasons" value=${seasons}>
        </div>
    
        <!-- Ordering -->
        <div>
        <label for="ordering"><b>Ordering</b></label>
        </div>
        <div>
        <input type="text" id="ordering" value=${ordering}>
        </div>
    
        <!-- Image -->
        <div>
        <label for="image_url"><b>Image</b></label>
        </div>
        <div>
        <input type="text" id="image_url" value=${image}>
        </div>
    
        <!-- Buttons -->
        <div>
        <button class="btn btn-main" id="create"><b>Save</b></button>
        <button class="btn" id="cancel">Cancel</button>
        </div>
        </form>`

        document.getElementById("create").addEventListener("click", onSave)
        //document.getElementById("cancel").addEventListener("click", onCancel)
    }

    else {
        var seasonsList = seasons.split(",")
        var seasonsIncorrect = false; 
        for (var i = 0; i < seasonsList.length; i++)
        {
            if (!Number.isInteger(parseInt(seasonsList[i])))
            {
                seasonsIncorrect = true; 
                document.querySelector('#doctor').innerHTML = `
                <p id="error">Please verify that your "seasons" entry is correct.</p>
                <form>
                <!-- Name -->
                <div>
                <label for="name"><b>Name</b></label>
                </div>
                <div>
                <input type="text" id="name" value=${name}>
                </div>
            
                <!-- Seasons -->
                <div>
                <label for="seasons"><b>Seasons</b></label>
                </div>
                <div>
                <input type="text" id="seasons" value=${seasons}>
                </div>
            
                <!-- Ordering -->
                <div>
                <label for="ordering"><b>Ordering</b></label>
                </div>
                <div>
                <input type="text" id="ordering" value=${ordering}>
                </div>
            
                <!-- Image -->
                <div>
                <label for="image_url"><b>Image</b></label>
                </div>
                <div>
                <input type="text" id="image_url" value=${image}>
                </div>
            
                <!-- Buttons -->
                <div>
                <button class="btn btn-main" id="create"><b>Save</b></button>
                <button class="btn" id="cancel">Cancel</button>
                </div>
                </form>`

                document.getElementById("create").addEventListener("click", onSave)
                //document.getElementById("cancel").addEventListener("click", onCancel)
            }
        }

        if (!seasonsIncorrect)
        {
            fetch(`${baseURL}/doctors`, {
                method: 'POST', 
                headers: {
                    'Content-Type': 'application/json'
                }, 
                body: JSON.stringify({
                    "name": name, 
                    "seasons": seasonsList, 
                    "ordering": ordering, 
                    "image_url": image
                })
            })
            .then(response => response.json())
            .then(newDoctor => {
                document.querySelector('#doctor').innerHTML = "";
                document.querySelector('#doctor').innerHTML += `
                <div class="docHeader"> 
                    <h1>${newDoctor.name}</h1>
                    <div style="display: flex">
                        <p class="editButton" onclick="editDoctor('${doctor._id}', '${doctor.name}')" style="padding-right: 5px">edit</p>
                        <p class="deleteButton" onclick="deleteDoctor('${doctor._id}', '${doctor.name}')">delete</p>
                    </div>
                </div>
                <img src="${newDoctor.image_url}">
                <p>Seasons: ${newDoctor.seasons}</p>
            `
            allDoctors(); 
                })
        }
    } 
    event.preventDefault(); 
}


// invoke this function when the page loads:
document.getElementById("add").addEventListener("click", addNewDoctor)

// document.getElementById("create").onclick = onSave; 
// //document.getElementById("cancel").onclick = onCancel;
initResetButton();
allDoctors();
