import firebase from 'firebase/app'
import 'firebase/auth'

export const logoutUser = () => {
  firebase.auth().signOut()
}

export const signInUser = async ({ name, email, password }) => {
  try {
    const user = await firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
    firebase.auth().currentUser.updateProfile({
      displayName: name,
    })
    return { user }
  } catch (error) {
    return {
      error: error.message,
    }
  }
}

export const loginUser = async ({ email, password }) => {
  try {
    const user = await firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
    return { user }
  } catch (error) {
    return {
      error: error.message,
    }
  }
}

export const sendEmailWithPassword = async (email) => {
  try {
    await firebase.auth().sendPasswordResetEmail(email)
    return {}
  } catch (error) {
    return {
      error: error.message,
    }
  }
}

export const getGroceryList = groceryListId => {
  return db.collection('scores').doc(groceryListId).get();
};

export const getGroceryListItems = groceryListId => {
  return db.collection('scores').doc(groceryListId).collection('score').get();
}