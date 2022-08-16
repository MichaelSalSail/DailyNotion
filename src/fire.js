// Import the functions you need from the SDKs you need
import {initializeApp} from 'firebase/app'
import {getDatabase, ref, set} from 'firebase/database';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const get_fire_cred=require('./fire_cred.js');

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: get_fire_cred.api,
  authDomain: get_fire_cred.dom,
  projectId: get_fire_cred.projId,
  storageBucket: get_fire_cred.bucket,
  messagingSenderId: get_fire_cred.senderId,
  appId: get_fire_cred.appId,
  measurementId: get_fire_cred.msrmentId
};

// Initialize Firebase
const fire_app = initializeApp(firebaseConfig);

export default fire_app;

// POST to Firebase Realtime
function writeUserQueAns (useremail, allQueAns) {
  const db = getDatabase();
  // users -> userId -> questionnaire
  const reference = ref(db, 'users/' + useremail + '/questionnaire');
  // questionnaire -> question_1 : answer_1...
  set(reference, allQueAns);
}

// GET to Firebase Realtime


// example questionnaire + responses
const example_ques={
    que_ans_1: {
        que : "How is your organizational ability?",
        ans : "Terrible"
    },
    que_ans_2: {
        que : "What times of day do you usually get work done?",
        ans : "10AM-5PM EST"
    },
    que_ans_3: {
        que : "What days of the week are you most productive?",
        ans : "Mon, Tue, and Wed"
    }
}

writeUserQueAns("michaelsalamon78", example_ques);