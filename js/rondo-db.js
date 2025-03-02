const rondoUserInfoCollection = 'rondo-user-info';  // Firestore DB Collection name


// enable offline data
rondoDb.enablePersistence()
    .catch(function (err) {
        if (err.code == 'failed-precondition') {
            // probably multible tabs open at once
            console.log('Persistence failed');
        } else if (err.code == 'unimplemented') {
            // lack of browser support for the feature
            console.log('Persistence not available');
        }
    });


// real-time listener
rondoDb.collection(rondoUserInfoCollection).onSnapshot(snapshot => {
    snapshot.docChanges().forEach(change => {
        if (change.type === 'added') {
            // console.log('New Rondo user added')
            // console.log('id:', change.doc.id);
            // console.log('data:', change.doc.data());
        }
        if (change.type === 'removed') {
            // removeRondoUser(change.doc.id);
        }
    });
});


// Add new item to collection
function setRondoUser() {

    // const userInfo = {
    //     name: "",
    //     position: "",
    //     nationality: "",
    //     age: "",
    //     height: "",
    //     weight: "",
    //     theme: "",
    //     language: ""
    // };


    // // Add a new document in collection "cities"
    // db.collection(rondoUserInfoCollection).doc(username).set(userInfo)
    //     .then(() => {
    //         console.log("Document successfully written!");
    //     })
    //     .catch((error) => {
    //         console.error("Error writing document: ", error);
    //     });
}

// Remove existing item from collection
function removeRondoUser(id) {
    // const rondoUserToRemove = document.querySelector(`.rondoUser[data-id=${id}]`);
    // rondoUserToRemove.remove();
}
