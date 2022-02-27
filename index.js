const express = require('express');
const firebase =  require("firebase/app");
const { getDocs, getFirestore , addDoc , collection  , query , where, setDoc , doc , deleteDoc } = require('firebase/firestore/lite');
require('dotenv').config();

const app = express();
const { PORT , API_KEY , AUTH_DOMAIN , PROJECT_ID , STORAGE_BUCKET , MESSAGING_SENDER_ID , APP_ID} = process.env;

app.use(express.urlencoded({extended:false}));
app.use(express.json());


// firebase app

const firebaseApp = firebase.initializeApp({
    apiKey: API_KEY,
    authDomain: AUTH_DOMAIN,
    projectId: PROJECT_ID,
    storageBucket: STORAGE_BUCKET,
    messagingSenderId: MESSAGING_SENDER_ID,
    appId: APP_ID
})

// firestore
var firestore = getFirestore(firebaseApp);


// To get a reference of a collection
const usersCollection = collection(firestore,'users');


// Home Route
app.get('/',(req,res)=>{
    res.send('I am okay');
})


// Get all documents in users collection

app.get('/user',async (req,res)=>{
    const usersQuery = query(
        usersCollection
    )

    const usersSnapshot = await getDocs(usersQuery);
    const users = [];
    usersSnapshot.forEach(doc => users.push(doc.data()));

    res.send(users);
})


// Create single document

app.post('/user',async (req,res)=>{

    const { email , name } = req.body;

    const newDoc = await addDoc(usersCollection,{ email, name });

    res.send(' user created successfully');
})


// Get single document in users collection

app.get('/user/:email',async (req,res)=>{

    const { email } = req.params;

    const usersQuery = query(
        usersCollection,
        where('email', '==', email)
    )

    const usersSnapshot = await getDocs(usersQuery);
    const users = []; 
    usersSnapshot.forEach(doc => users.push(doc.data()));

    res.send(users);
})


// Update single document in a collection

app.post('/user/:email',async (req,res)=>{
    try {
        const { email } = req.params;

        const usersQuery = query(
            usersCollection,
            where('email', '==', email)
        )
    
        const usersSnapshot = await getDocs(usersQuery);
        var id;
        usersSnapshot.forEach(doc => {id = doc.id});

        const docRef = await doc(firestore,`users/${id}`);
    
        await setDoc(docRef,req.body, {merge:true});
        res.send(' user updated successfully ');
    } catch (error) {
        res.send(error);
    }
})


// Delete single document in a collection

app.delete('/user/:email',async (req,res)=>{
    try {
        const { email } = req.params;

        const usersQuery = query(
            usersCollection,
            where('email', '==', email)
        )
    
        const usersSnapshot = await getDocs(usersQuery);
        var id;
        usersSnapshot.forEach(doc => {id = doc.id});

        const docRef = await doc(firestore,`users/${id}`);
    
        await deleteDoc(docRef);
        res.send(' user deleted successfully ');
    } catch (error) {
        res.send(error);
    }
})

app.listen(PORT , () => {
    console.log(`listening to port ${PORT}`);
})



