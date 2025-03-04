// ------------------------------------------------------------------------------------------------------------
// Getting HTML elements
const positionSelect = document.getElementById("positionSelectEdit");
const nationalitySelect = document.getElementById("nationalitySelectEdit");

// Declaring global variables
let imageDownloadUrl = '', imageUploadErrMsg = "";
let imageUploadStatus = 0;    // 0: No image || 1: Image uploaded success || 2: Image upload error

let checkLoading; let intervalSeconds = 1; let checkCount = 0; let checkCountMax = 3;  // Interval variables


// Get items from local storage
let storedUsername = localStorage.getItem(localStorageRondoUsername);
let storedProfilePic = localStorage.getItem(localStorageRondoProfilePic);
let storedShortName = localStorage.getItem(localStorageRondoShortName);


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
document.getElementById("editProfile").addEventListener('click', populateDataForEdit);

// Clear/Unload profile data
document.getElementById("clearProfile").addEventListener('click', clearProfileData);

// Create new or update existing profile
document.getElementById("createUpdateButton").addEventListener('click', createUpdateInfo);


// ------------------------------------------------------------------------------------------------------------
// Functions

// Fetch country info
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
            nationalitySelect.innerHTML = ``
        });
}


// Fetch positions info
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
            positionSelect.innerHTML = ``
        });
}


// Get user data from firebase
function initialProfilerData() {
    storedUsername = localStorage.getItem(localStorageRondoUsername);
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


                if ((rondoUserData.imageUrl != '') && (rondoUserData.imageUrl != undefined)) {
                    localStorage.setItem(localStorageRondoProfilePic, rondoUserData.imageUrl);
                    document.getElementById("profilerPic").setAttribute('src', rondoUserData.imageUrl);
                }

                document.getElementById("clearDiv").setAttribute('class', 'row mx-auto show');
                document.getElementById("editProfile").innerHTML = `Edit Profile`
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


// Load user data from firebase
function loadProfilerData() {
    storedUsername = localStorage.getItem(localStorageRondoUsername);
    if (storedUsername) {
        showSnackbar("Existing profile already loaded");
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


                        // Extracting short name 
                        let fullName = rondoUserData.name;
                        let fullNameSplit = fullName.split(' '); let shortName = fullNameSplit[0];


                        // Set local storage items
                        localStorage.setItem(localStorageRondoUsername, username);
                        localStorage.setItem(localStorageRondoShortName, shortName);

                        if ((rondoUserData.imageUrl != '') && (rondoUserData.imageUrl != undefined)) {
                            localStorage.setItem(localStorageRondoProfilePic, rondoUserData.imageUrl);
                            document.getElementById("profilerPic").setAttribute('src', rondoUserData.imageUrl);
                        }

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



// Pre-fill data on Profile modal
function populateDataForEdit() {

    document.getElementById("uploadImage").value = ""
    document.getElementById("passwordEdit").value = ""


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


// Clear/Unload profile
function clearProfileData() {
    localStorage.setItem(localStorageRondoUsername, "");
    localStorage.removeItem(localStorageRondoUsername);

    localStorage.setItem(localStorageRondoProfilePic, "");
    localStorage.removeItem(localStorageRondoProfilePic);

    localStorage.setItem(localStorageRondoShortName, "");
    localStorage.removeItem(localStorageRondoShortName);

    location.reload();
}



// Create/Update Profile
function createUpdateInfo() {
    let createUpdateUsername = document.getElementById("usernameEdit").value;
    let userDisabled = document.getElementById("usernameEdit").disabled;
    storedUsername = localStorage.getItem(localStorageRondoUsername);
    

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

                if (imageUploadStatus != 2) {
                    // Confirm no image upload error

                    if ((imageUploadStatus == 0) || (imageDownloadUrl == undefined)) {
                        // no new image uploaded for new profile
                        imageDownloadUrl = '';
                    }

                    if ((document.getElementById("profileNameEdit").value != '') && (newPosition != '') && (newNationality != '') && (document.getElementById("profileAgeEdit").value != '') && (document.getElementById("profileHeightEdit").value != '') && (document.getElementById("profileWeightEdit").value != '') && (document.getElementById("passwordEdit").value != '')) {
                        // Confirm input on all mandatory fields

                        const userInfo = {
                            name: document.getElementById("profileNameEdit").value,
                            position: newPosition,
                            nationality: newNationality,
                            age: document.getElementById("profileAgeEdit").value,
                            height: document.getElementById("profileHeightEdit").value,
                            weight: document.getElementById("profileWeightEdit").value,
                            password: document.getElementById("passwordEdit").value,
                            imageUrl: imageDownloadUrl,
                            theme: "",
                            language: ""
                        };

                        // Proceed when no error encountered with image upload
                        rondoDb.collection(rondoUserInfoCollection).doc(createUpdateUsername).set(userInfo)
                            .catch(err => {
                                // console.log(err);
                                showSnackbar("Error updating profile..");
                                document.getElementById("clearDiv").setAttribute('class', 'row mx-auto hide');
                                clearProfileData();
                            });

                        localStorage.setItem(localStorageRondoUsername, createUpdateUsername);  // Set username on local storage
                        localStorage.setItem(localStorageRondoProfilePic, imageDownloadUrl);  // Set image URL on local storage

                        document.getElementById("clearDiv").setAttribute('class', 'row mx-auto show');

                        showSnackbar("New Profile created");

                        checkLoading = setInterval(checkLoadingScreenStatus, intervalSeconds * 1000); // Start timed event
                                                
                        document.getElementById("passwordEdit").value = "";
                    } else {
                        showSnackbar("! Fill all mandatory fields - [*]");
                    }

                } else {
                    showSnackbar(imageUploadErrMsg);
                }
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
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




                    if (imageUploadStatus != 2) {
                        // Confirm no image upload error

                        if ((imageUploadStatus == 0) || (imageDownloadUrl == undefined)) {
                            // no new image uploaded for new profile

                            storedProfilePic = localStorage.getItem(localStorageRondoProfilePic);
                            if (storedProfilePic) {
                                imageDownloadUrl = storedProfilePic;
                            } else {
                                imageDownloadUrl = ''
                            }
                        }

                        if ((document.getElementById("profileNameEdit").value != '') && (newPosition != '') && (newNationality != '') && (document.getElementById("profileAgeEdit").value != '') && (document.getElementById("profileHeightEdit").value != '') && (document.getElementById("profileWeightEdit").value != '') && (document.getElementById("passwordEdit").value != '')) {
                            // Confirm input on all mandatory fields

                            const userInfo = {
                                name: document.getElementById("profileNameEdit").value,
                                position: newPosition,
                                nationality: newNationality,
                                age: document.getElementById("profileAgeEdit").value,
                                height: document.getElementById("profileHeightEdit").value,
                                weight: document.getElementById("profileWeightEdit").value,
                                password: rondoUserData.password,
                                imageUrl: imageDownloadUrl,
                                theme: newTheme,
                                language: newLanguage
                            };

                            // Proceed when no error encountered with image upload
                            rondoDb.collection(rondoUserInfoCollection).doc(createUpdateUsername).set(userInfo)
                                .catch(err => {
                                    // console.log(err);
                                    showSnackbar("Error updating profile...");
                                    document.getElementById("clearDiv").setAttribute('class', 'row mx-auto hide');
                                    clearProfileData();
                                });


                            localStorage.setItem(localStorageRondoUsername, createUpdateUsername);  // Set username on local storage
                            localStorage.setItem(localStorageRondoProfilePic, imageDownloadUrl);  // Set image URL on local storage

                            document.getElementById("clearDiv").setAttribute('class', 'row mx-auto show');

                            showSnackbar("Profile updated");

                            checkLoading = setInterval(checkLoadingScreenStatus, intervalSeconds * 1000); // Start timed event
                                                        
                            document.getElementById("passwordEdit").value = "";

                        } else {
                            showSnackbar("! Fill all mandatory fields - [*]");
                        }
                    } else {
                        showSnackbar(imageUploadErrMsg);
                    }

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
            showSnackbar("Error updating profile");
        });
    }
}


// ------------------------------------------------------------------------------------------------------------
// Uploading image and retrieving URL with firebase storage

document.getElementById("uploadImage").addEventListener("change", function () {
    const imageUpload = document.getElementById("uploadImage").files[0];
    uploadFile(imageUpload);
});

// Uploading image
function uploadFile(imageFile) {

    // Getting the file extension
    let imageFileSplit = imageFile.name.split('.'); let imageFileSplitLen = imageFileSplit.length;
    let imageFileExtension = imageFileSplit[imageFileSplitLen - 1];

    const rondoStorageRef = rondoStorage.ref();     // Create a storage reference from firebase storage service
    const rondoImageRef = rondoStorageRef.child('rondoUserImages/' + document.getElementById("usernameEdit").value + '.' + imageFileExtension);    // Reference pointing to the image file

    rondoImageRef.put(imageFile)
        .then((snapshot) => {
            rondoImageRef.getDownloadURL()
                .then((downloadUrl) => {
                    imageDownloadUrl = downloadUrl;
                    imageUploadStatus = 1;    // 1: Image uploaded success

                    showSnackbar("Image upload successful");
                })
                .catch((error) => {
                    imageUploadStatus = 2;    // 2: Image upload error
                    // console.log('error', error);
                    imageUploadErrMsg = "Error retrieving image";
                });
        })
        .catch((error) => {
            imageUploadStatus = 2;    // 2: Image upload error

            // console.log('error', error);
            imageUploadErrMsg = "Image upload failed";

            // switch (error.code) {
            //     case 'storage/unauthorized':
            //         console.log('error.code', error.code, "User doesn't have permission to access the object");
            //         break;
            //     case 'storage/canceled':
            //         console.log('error.code', error.code, "User canceled the upload");
            //         break;
            //     case 'storage/unknown':
            //         console.log('error.code', error.code, "Unknown error occurred, inspect error.serverResponse");
            //         break;
            // }
        });
}


// ------------------------------------------------------------------------------------------------------------
// Timed event to trigger 'initialProfilerData()' function automatically

checkLoading = setInterval(checkLoadingScreenStatus, intervalSeconds * 1000); // Start timed event

function checkLoadingScreenStatus() {
    checkCount += 1;
    // console.log('checkCount', checkCount);

    if (checkCount < checkCountMax) {
        initialProfilerData();
    } else {
        checkCount = 0;
        // Stop timed event
        clearInterval(checkLoading);
    }
}

// ------------------------------------------------------------------------------------------------------------
