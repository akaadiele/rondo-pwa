const positionSelect = document.getElementById("positionSelectEdit");   // Getting HTML element
const nationalitySelect = document.getElementById("nationalitySelectEdit");     // Getting HTML element


// Get username from local storage
let storedUsername = localStorage.getItem(localStorageRondoUsername);

// Load profile data on page load
document.addEventListener("DOMContentLoaded", initialProfilerData);

// Load profile data on request
document.getElementById("loadProfileButton").addEventListener('click', loadProfilerData);
document.getElementById('passwordLoad').addEventListener('keydown', (clicked) => {
    // clicked.preventDefault();
    if (clicked.key === 'Enter') {
        loadProfilerData();
    }
})



// Load profile data for edit
document.getElementById("editProfile").addEventListener('click', loadProfileDataForEdit);

// Clear profile data
document.getElementById("clearProfile").addEventListener('click', clearProfileData);

// Create new or update existing profile
document.getElementById("createUpdateButton").addEventListener('click', createUpdateInfo);




// Fetch country info from API
function getNationalities() {
    const countriesJson = "../js/json/countries.json";   // Path to file
    // 20250303001747
    // https://restcountries.com/v2/all?fields=name,demonym,alpha2Code  replica

    fetch(countriesJson)
        .then((response) => response.json())
        .then(function (data) {
            let countries = data;

            return countries.map(function (country) {
                // let countryName = country.name
                let countryNationality = country.demonym;
                // let countryShortName = country.alpha2Code;

                nationalitySelect.innerHTML += `<option value="${countryNationality}" id="${countryNationality}">${countryNationality}</option>`;
            })
        })
        .catch(function (error) {
            // console.log('error: ', error);
            // nationalitySelect.innerHTML = `<option value="">Error loading options</option>`;
            nationalitySelect.innerHTML = ``
        });
}

// Fetch positions from json file
function getPositions() {
    const positionsJson = "../js/json/positions.json";   // Path to file

    fetch(positionsJson)
        .then((response) => response.json())
        .then((data) => {
            data.forEach(position => {
                // let positionName = position.name;
                let positionCode = position.code;

                positionSelect.innerHTML += `<option value="${positionCode}" id="${positionCode}">${positionCode}</option>`;
            })
        })
        .catch(function (error) {
            // console.log('error: ', error);
            // positionSelect.innerHTML += `<option value="">Error loading options</option>`;
            positionSelect.innerHTML = ``
        });
}



// Get user data from firebase
function initialProfilerData() {
    if (storedUsername) {
        document.getElementById("usernameView").value = storedUsername;

        rondoDb.collection(rondoUserInfoCollection).doc(storedUsername).get().then((doc) => {
            if (doc.exists) {
                // console.log("Document data:", doc.data());
                let rondoUserData = doc.data();

                document.getElementById("usernameView").value = storedUsername;
                document.getElementById("profileNameView").value = rondoUserData.name;
                document.getElementById("profilePositionView").value = rondoUserData.position;
                document.getElementById("profileNationalityView").value = rondoUserData.nationality;
                document.getElementById("profileAgeView").value = rondoUserData.age;
                document.getElementById("profileHeightView").value = rondoUserData.height;
                document.getElementById("profileWeightView").value = rondoUserData.weight;
                // document.getElementById("themeSelect").value = rondoUserData.theme;
                // document.getElementById("languageSelect").value = rondoUserData.language;

                document.getElementById("clearDiv").setAttribute('class', 'row mx-auto show');
            } else {
                // doc.data() will be undefined in this case
                // console.log("No such document!");
                rondoUserData = "";
                document.getElementById("editProfile").innerHTML = `New Profile`
            }
        }).catch((error) => {
            // console.log("Error getting document:", error);
            rondoUserData = "";
            document.getElementById("editProfile").innerHTML = `New Profile`
        });
    } else {
        // doc.data() will be undefined in this case
        // console.log("No such document!");
        rondoUserData = "";
        document.getElementById("editProfile").innerHTML = `New Profile`
    }
}


function loadProfilerData() {
    if (storedUsername) {
        showSnackbar("An existing profile already loaded");
    } else {
        let username = document.getElementById("usernameLoad").value;
        let passwordInput = document.getElementById("passwordLoad").value;

        if (username) {
            rondoDb.collection(rondoUserInfoCollection).doc(username).get().then((doc) => {
                if (doc.exists) {
                    // console.log("Document data:", doc.data());
                    let rondoUserData = doc.data();

                    if (rondoUserData.password == passwordInput) {
                        document.getElementById("usernameView").value = username;
                        document.getElementById("profileNameView").value = rondoUserData.name;
                        document.getElementById("profilePositionView").value = rondoUserData.position;
                        document.getElementById("profileNationalityView").value = rondoUserData.nationality;
                        document.getElementById("profileAgeView").value = rondoUserData.age;
                        document.getElementById("profileHeightView").value = rondoUserData.height;
                        document.getElementById("profileWeightView").value = rondoUserData.weight;
                        // document.getElementById("themeSelect").value = rondoUserData.theme;
                        // document.getElementById("languageSelect").value = rondoUserData.language;

                        localStorage.setItem(localStorageRondoUsername, username);  // Set username on local storage

                        document.getElementById("usernameLoad").value = "";
                        document.getElementById("passwordLoad").value = "";

                        document.getElementById("clearDiv").setAttribute('class', 'row mx-auto show');
                        location.reload();
                    } else {
                        // doc.data() will be undefined in this case
                        // console.log("No such document!");
                        rondoUserData = "";
                        document.getElementById("usernameLoad").value = "";
                        document.getElementById("passwordLoad").value = "";
                        showSnackbar("Incorrect profile password");
                    }

                } else {
                    // doc.data() will be undefined in this case
                    // console.log("No such document!");
                    rondoUserData = "";
                    document.getElementById("usernameLoad").value = "";
                    document.getElementById("passwordLoad").value = "";
                    showSnackbar("Rondo User not valid");
                }
            }).catch((error) => {
                // console.log("Error getting document:", error);
                rondoUserData = "";
                document.getElementById("usernameLoad").value = "";
                document.getElementById("passwordLoad").value = "";
                showSnackbar("Unable to load data while offline");
            });

        }
    }
}



function loadProfileDataForEdit() {

    if (document.getElementById("usernameView").value) {
        document.getElementById("usernameEdit").value = document.getElementById("usernameView").value;
        document.getElementById("profileNameEdit").value = document.getElementById("profileNameView").value;

        document.getElementById("positionSelectEdit").value = document.getElementById("profilePositionView").value;
        let currentPosition = document.getElementById("profilePositionView").value;
        positionSelect.innerHTML = `<option value="${currentPosition}" id="${currentPosition}">${currentPosition}</option>`;
        positionSelect.innerHTML += `<option value="" id="">----------</option>`;

        document.getElementById("nationalitySelectEdit").value = document.getElementById("profileNationalityView").value;
        let currentNationality = document.getElementById("profileNationalityView").value;
        nationalitySelect.innerHTML = `<option value="${currentNationality}" id="${currentNationality}">${currentNationality}</option>`;
        nationalitySelect.innerHTML += `<option value="" id="">----------</option>`;

        document.getElementById("profileAgeEdit").value = document.getElementById("profileAgeView").value;
        document.getElementById("profileHeightEdit").value = document.getElementById("profileHeightView").value;
        document.getElementById("profileWeightEdit").value = document.getElementById("profileWeightView").value;
    } else {
        // New profile
        document.getElementById("usernameEdit").disabled = false;
        // document.getElementById("passwordEdit").disabled = false;
    }

    // Get list of countries / nationality
    getNationalities();

    // Get list of positions
    getPositions();
}


function clearProfileData() {
    localStorage.setItem(localStorageRondoUsername, "");
    localStorage.removeItem(localStorageRondoUsername);

    location.reload();
}



function createUpdateInfo() {
    let createUpdateUsername = document.getElementById("usernameEdit").value;
    userDisabled = document.getElementById("usernameEdit").disabled;



    if (document.getElementById("positionSelectEdit").value != "") {
        newPosition = document.getElementById("positionSelectEdit").value;
    } else {
        newPosition = document.getElementById("profilePositionView").value;
    }


    if (document.getElementById("nationalitySelectEdit").value != "") {
        newNationality = document.getElementById("nationalitySelectEdit").value;
    } else {
        newNationality = document.getElementById("profileNationalityView").value;
    }


    if ((userDisabled == false) || (storedUsername == '')) {
        // New profile
        rondoDb.collection(rondoUserInfoCollection).doc(createUpdateUsername).get().then((doc) => {
            if (doc.exists) {
                // let rondoUserData = doc.data();
                showSnackbar("Invalid username");
            } else {
                // New profile
                const userInfo = {
                    name: document.getElementById("profileNameEdit").value,
                    position: newPosition,
                    nationality: newNationality,
                    age: document.getElementById("profileAgeEdit").value,
                    height: document.getElementById("profileHeightEdit").value,
                    weight: document.getElementById("profileWeightEdit").value,
                    password: document.getElementById("passwordEdit").value,
                    theme: "",
                    language: ""
                };

                rondoDb.collection(rondoUserInfoCollection).doc(createUpdateUsername).set(userInfo)
                    .catch(err => {
                        // console.log(err);
                        showSnackbar("Error updating profile..");
                        document.getElementById("clearDiv").setAttribute('class', 'row mx-auto hide');
                        clearProfileData();
                    });

                localStorage.setItem(localStorageRondoUsername, createUpdateUsername);  // Set username on local storage
                document.getElementById("clearDiv").setAttribute('class', 'row mx-auto show');
                showSnackbar("Done...");
                initialProfilerData();
                // location.reload();
                document.getElementById("passwordEdit").value = "";
            }
        }).catch((error) => {
            // console.log("Error getting document:", error);
            showSnackbar("Error updating profile.");
        });
    } else {
        // Existing profile
        rondoDb.collection(rondoUserInfoCollection).doc(createUpdateUsername).get().then((doc) => {
            if (doc.exists) {
                let rondoUserData = doc.data();
                let passwordInput = document.getElementById("passwordEdit").value;

                if (rondoUserData.password == passwordInput) {

                    if (rondoUserData.theme) {
                        newTheme = rondoUserData.theme;
                    } else {
                        newTheme = "";
                    }

                    if (rondoUserData.language) {
                        newLanguage = rondoUserData.language;
                    } else {
                        newLanguage = "";
                    }

                    const userInfo = {
                        name: document.getElementById("profileNameEdit").value,
                        position: newPosition,
                        nationality: newNationality,
                        age: document.getElementById("profileAgeEdit").value,
                        height: document.getElementById("profileHeightEdit").value,
                        weight: document.getElementById("profileWeightEdit").value,
                        password: rondoUserData.password,
                        theme: newTheme,
                        language: newLanguage
                    };

                    rondoDb.collection(rondoUserInfoCollection).doc(createUpdateUsername).set(userInfo)
                        .catch(err => {
                            // console.log(err);
                            showSnackbar("Error updating profile...");
                            document.getElementById("clearDiv").setAttribute('class', 'row mx-auto hide');
                            clearProfileData();
                        });

                    localStorage.setItem(localStorageRondoUsername, createUpdateUsername);  // Set username on local storage
                    document.getElementById("clearDiv").setAttribute('class', 'row mx-auto show');
                    showSnackbar("Done...");

                    initialProfilerData();
                    // location.reload();
                    document.getElementById("passwordEdit").value = "";
                } else {
                    // doc.data() will be undefined in this case
                    // console.log("No such document!");
                    rondoUserData = "";
                    document.getElementById("passwordEdit").value = "";
                    showSnackbar("Incorrect password");
                }
            } else {
                showSnackbar("Error updating profile..");
            }
        }).catch((error) => {
            // console.log("Error getting document:", error);
            showSnackbar("Error updating profile.");
        });
    }
}

