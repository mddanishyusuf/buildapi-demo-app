import firebase from 'firebase/compat/app';
import 'firebase/compat/database';
import 'firebase/compat/auth';

const firebaseConfig = {
    apiKey: 'AIzaSyAssrnRHEQf5SMnDWZi8KzCgsizFnSpGrI',
    authDomain: 'buildapi-demo.firebaseapp.com',
    projectId: 'buildapi-demo',
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

export default firebase;
