// ------------------------------------------------------------------------------------------------------------
// // Variable declaration

// Getting HTML elements
const positionSelect = document.getElementById("positionSelectEdit");
const nationalitySelect = document.getElementById("nationalitySelectEdit");

// For images
let imageDownloadUrl = '', imageUploadErrMsg = "", imageFileName = "";
let imageUploadStatus = 0;    // 0: No image || 1: Image uploaded success || 2: Image upload error

// Timer Interval variables
let checkReloading; let intervalSeconds = 0.5; let checkCount = 0; let checkCountMax = 3;

// Get items from local storage
let storedUsername = localStorage.getItem(localStorageRondoUsername);
let storedProfilePic = localStorage.getItem(localStorageRondoProfilePic);
let storedProfilePicName = localStorage.getItem(localStorageRondoProfilePicName);
let storedShortName = localStorage.getItem(localStorageRondoShortName);

// Create a storage reference from firebase storage service
const rondoStorageRef = rondoStorage.ref();


// Load profile data on page load
document.addEventListener("DOMContentLoaded", initialProfilerData);

// Load profile data on request
document.getElementById("loadProfileButton").addEventListener('click', loadProfilerData);
document.getElementById('passwordLoad').addEventListener('keydown', (clicked) => {
    if (clicked.key === 'Enter') {
        loadProfilerData();
    }
})

// Load profile data for edit
document.getElementById("editProfile").addEventListener('click', populateDataForEdit);

// Unload profile data
document.getElementById("unloadProfile").addEventListener('click', unloadProfileData);

// Create new or update existing profile
document.getElementById("createUpdateButton").addEventListener('click', createUpdateInfo);

// ------------------------------------------------------------------------------------------------------------
// // Functions

function getNationalities() {
    // Fetch country info
    const countriesJson = "../js/json/countries.json";   // Path to file
    // 20250303001747
    // replica of https://restcountries.com/v2/all?fields=name,demonym,alpha2Code
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
            nationalitySelect.innerHTML = ``;
        });
}



function getPositions() {
    // Fetch positions info
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
            positionSelect.innerHTML = ``;
        });
}



function initialProfilerData() {
    // Get user data from firebase
    readUserSettings(); // Read user settings from firebase

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


                if ((rondoUserData.imageUrl != '') && (rondoUserData.imageUrl != undefined)) {
                    localStorage.setItem(localStorageRondoProfilePicName, rondoUserData.imageFile);
                    localStorage.setItem(localStorageRondoProfilePic, rondoUserData.imageUrl);
                    document.getElementById("profilerPic").setAttribute('src', rondoUserData.imageUrl);
                } else {
                    localStorage.setItem(localStorageRondoProfilePicName, "");
                    localStorage.setItem(localStorageRondoProfilePic, "");
                    document.getElementById("profilerPic").setAttribute('src', "../img/kick-ball.jpg");
                }

                // Extracting short name 
                let fullName = rondoUserData.name;
                let fullNameSplit = fullName.split(' '); let shortName = fullNameSplit[0];

                // Set local storage items
                localStorage.setItem(localStorageRondoShortName, shortName);

                document.getElementById("editProfile").innerHTML = `Edit Profile`;

                // Switching 'load profile' button to 'unload profile' button
                document.getElementById("loadProfile").hidden = true;   // Hide 'load' button
                document.getElementById("unloadProfile").hidden = "";     // Show 'unload' button

            } else {
                // doc.data() will be undefined in this case
                // console.log("No such document!");
                rondoUserData = "";
                document.getElementById("editProfile").innerHTML = `Create Profile`;
            }
        }).catch((error) => {
            // console.log("Error getting document:", error);
            rondoUserData = "";
            document.getElementById("editProfile").innerHTML = `Create Profile`;
        });
    } else {
        // doc.data() will be undefined in this case
        // console.log("No such document!");
        rondoUserData = "";
        document.getElementById("editProfile").innerHTML = `Create Profile`;
    }
}



function loadProfilerData() {
    // Load user data from firebase
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

                        // Extracting short name 
                        let fullName = rondoUserData.name;
                        let fullNameSplit = fullName.split(' '); let shortName = fullNameSplit[0];

                        // Set local storage items
                        localStorage.setItem(localStorageRondoUsername, username);
                        localStorage.setItem(localStorageRondoShortName, shortName);


                        if ((rondoUserData.imageUrl != '') && (rondoUserData.imageUrl != undefined)) {
                            localStorage.setItem(localStorageRondoProfilePicName, rondoUserData.imageFile);
                            localStorage.setItem(localStorageRondoProfilePic, rondoUserData.imageUrl);
                            document.getElementById("profilerPic").setAttribute('src', rondoUserData.imageUrl);
                        } else {
                            localStorage.setItem(localStorageRondoProfilePicName, "");
                            localStorage.setItem(localStorageRondoProfilePic, "");
                            document.getElementById("profilerPic").setAttribute('src', "../img/kick-ball.jpg");
                        }

                        document.getElementById("usernameLoad").value = "";
                        document.getElementById("passwordLoad").value = "";

                        document.getElementById("loadProfile").hidden = true;   // Hide 'load' button
                        document.getElementById("unloadProfile").hidden = "";     // Show 'unload' button

                        readUserSettings(); // Read user settings from firebase
                        setFontSize();  // Update font size

                        checkReloading = setInterval(refreshPage, intervalSeconds * 1000); // Start timed event
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



function populateDataForEdit() {
    // Pre-fill data on Profile modal
    document.getElementById("uploadImage").value = "";
    document.getElementById("passwordEdit").value = "";
    document.getElementById("removeImage").checked = false;

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
    }

    getNationalities(); // Get list of nationalities
    getPositions(); // Get list of positions
}



function unloadProfileData() {
    // Unload profile
    localStorage.setItem(localStorageRondoUsername, "");
    localStorage.removeItem(localStorageRondoUsername);

    localStorage.setItem(localStorageRondoProfilePic, "");
    localStorage.removeItem(localStorageRondoProfilePic);

    localStorage.setItem(localStorageRondoProfilePicName, "");
    localStorage.removeItem(localStorageRondoProfilePicName);

    localStorage.setItem(localStorageRondoShortName, "");
    localStorage.removeItem(localStorageRondoShortName);

    localStorage.setItem(localStorageRondoFontSize, "");
    localStorage.removeItem(localStorageRondoFontSize);

    location.reload();
}



function createUpdateInfo() {
    // Create/Update Profile
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
                if (document.getElementById("removeImage").checked == true) {
                    removeProfileImage();
                    showSnackbar("Profile image removed");
                }

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
                            imageFile: imageFileName
                        };

                        let theme_value = "Default", language_value = "English", fontSize_value = "Normal";
                        const userSettings = {
                            theme: theme_value,
                            language: language_value,
                            fontSize: fontSize_value
                        };

                        rondoDb.collection(rondoUserSettingsCollection).doc(createUpdateUsername).set(userSettings)
                            .catch(err => {
                                // console.log(err);
                                showSnackbar("Error in updating settings");
                            });

                        // Proceed when no error encountered with image upload
                        rondoDb.collection(rondoUserInfoCollection).doc(createUpdateUsername).set(userInfo)
                            .catch(err => {
                                // console.log(err);
                                showSnackbar("Error updating profile");

                                // document.getElementById("unloadDiv").setAttribute('class', 'row mx-auto show');
                                document.getElementById("loadProfile").hidden = true;   // Hide 'load' button
                                document.getElementById("unloadProfile").hidden = "";     // Show 'unload' button

                                unloadProfileData();
                            });

                        localStorage.setItem(localStorageRondoUsername, createUpdateUsername);  // Set username on local storage
                        localStorage.setItem(localStorageRondoProfilePic, imageDownloadUrl);  // Set image URL on local storage
                        localStorage.setItem(localStorageRondoProfilePicName, imageFileName);  // Set image file name on local storage

                        document.getElementById("loadProfile").hidden = true;   // Hide 'load' button
                        document.getElementById("unloadProfile").hidden = "";     // Show 'unload' button

                        showSnackbar("New Profile created");

                        checkReloading = setInterval(refreshPage, intervalSeconds * 1000); // Start timed event

                        document.getElementById("passwordEdit").value = "";
                    } else {
                        showSnackbar("! Fill all mandatory fields - [*]");
                    }

                } else {
                    showSnackbar(imageUploadErrMsg);
                }
            }
        }).catch((error) => {
            // console.log("Error getting document:", error);
            showSnackbar("Error updating profile");
        });
    } else {
        // Existing profile
        rondoDb.collection(rondoUserInfoCollection).doc(createUpdateUsername).get().then((doc) => {
            if (doc.exists) {
                let rondoUserData = doc.data();
                let passwordInput = document.getElementById("passwordEdit").value;

                if (rondoUserData.password == passwordInput) {

                    if (document.getElementById("removeImage").checked == true) {
                        removeProfileImage();
                    }

                    if (imageUploadStatus != 2) {
                        // Confirm no image upload error
                        if ((imageUploadStatus == 0) || (imageDownloadUrl == undefined)) {
                            // no new image uploaded for new profile
                            storedProfilePic = localStorage.getItem(localStorageRondoProfilePic);
                            storedProfilePicName = localStorage.getItem(localStorageRondoProfilePicName);
                            if (storedProfilePic) {
                                imageDownloadUrl = storedProfilePic;
                            } else {
                                imageDownloadUrl = '';
                            }
                            if (storedProfilePicName) {
                                imageFileName = storedProfilePicName;
                            } else {
                                imageFileName = '';
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
                                imageFile: imageFileName
                            };

                            // Proceed when no error encountered with image upload
                            rondoDb.collection(rondoUserInfoCollection).doc(createUpdateUsername).set(userInfo)
                                .catch(err => {
                                    // console.log(err);
                                    showSnackbar("Error updating profile");

                                    document.getElementById("loadProfile").hidden = true;   // Hide 'load' button
                                    document.getElementById("unloadProfile").hidden = "";     // Show 'unload' button

                                    unloadProfileData();
                                });

                            localStorage.setItem(localStorageRondoUsername, createUpdateUsername);  // Set username on local storage
                            localStorage.setItem(localStorageRondoProfilePic, imageDownloadUrl);  // Set image URL on local storage
                            localStorage.setItem(localStorageRondoProfilePicName, imageFileName);  // Set image file name on local storage

                            document.getElementById("loadProfile").hidden = true;   // Hide 'load' button
                            document.getElementById("unloadProfile").hidden = "";     // Show 'unload' button

                            showSnackbar("Profile updated");

                            checkReloading = setInterval(refreshPage, intervalSeconds * 1000); // Start timed event

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
                showSnackbar("Error updating profile");
            }
        }).catch((error) => {
            // console.log("Error getting document:", error);
            showSnackbar("Error updating profile");
        });
    }
}



document.getElementById("uploadImage").addEventListener("change", function () {
    const imageUpload = document.getElementById("uploadImage").files[0];
    uploadFile(imageUpload);
});
function uploadFile(imageFile) {
    // Uploading image and retrieving URL with firebase storage

    let imageFileSplit = imageFile.name.split('.'); let imageFileSplitLen = imageFileSplit.length;
    let imageFileExtension = imageFileSplit[imageFileSplitLen - 1];     // Getting the file extension

    imageFileName = document.getElementById("usernameEdit").value + '.' + imageFileExtension;
    localStorage.setItem(localStorageRondoProfilePicName, imageFileName);  // Set image anme on local storage

    const rondoImageRef = rondoStorageRef.child('rondoUserImages/' + imageFileName);    // Reference pointing to the image file

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
            // console.log('error', error);
            imageUploadErrMsg = "Image upload failed";
            imageUploadStatus = 2;    // 2: Image upload error
        });
}


// ------------------------------------------------------------------------------------------------------------

function refreshPage() {
    // Timed event to trigger 'initialProfilerData()' function automatically
    checkCount += 1;

    if (checkCount < checkCountMax) {
        // initialProfilerData();
        location.reload();  // Reload to take effect
    } else {
        checkCount = 0;
        // Stop timed event
        clearInterval(checkReloading);
    }
}



function removeProfileImage() {
    // Removing Profile image
    storedProfilePic = localStorage.getItem(localStorageRondoProfilePic);
    storedProfilePicName = localStorage.getItem(localStorageRondoProfilePicName);


    // Deleting existing image from firebase storage
    if (imageDownloadUrl != "") {
        // Create a reference to the file to delete
        const rondoImageRef = rondoStorageRef.child('rondoUserImages/' + storedProfilePicName);    // Reference pointing to the image file

        // Delete the file
        rondoImageRef.delete().then(() => {
            // console.log("File deleted successfully");
        }).catch((error) => {
            // console.log("Uh-oh, an error occurred!");
        });
    }

    // Resetting variables
    imageDownloadUrl = ""; imageFileName = "";
    document.getElementById("uploadImage").value = "";

    // Resetting local storage
    localStorage.setItem(localStorageRondoProfilePic, "");
    localStorage.removeItem(localStorageRondoProfilePic);

    localStorage.setItem(localStorageRondoProfilePicName, "");
    localStorage.removeItem(localStorageRondoProfilePicName);

    // Resetting default image
    document.getElementById("profilerPic").setAttribute('src', "../img/kick-ball.jpg");
}

// ------------------------------------------------------------------------------------------------------------
