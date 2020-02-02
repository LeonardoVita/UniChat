import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import firebase from 'react-native-firebase';
import { GoogleSignin, GoogleSigninButton } from 'react-native-google-signin';
import { StackActions, NavigationActions } from 'react-navigation';


export default class App extends Component {

  constructor(props) {
    super(props);
    this.unsubscriber = null;    
    
    this.state = {
      isSigninInProgress: false
    }

  }

  static navigationOptions = {
    header: null
  }  
  

  componentDidMount() {
    GoogleSignin.configure({
      webClientId: '224403948241-qnpf0dledk37rdf63ufvtlp2esofdbsq.apps.googleusercontent.com'
    });

    resetChat = StackActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: 'Groups' })],
    });
  }
  
  signIn = async () => {
    this.setState({ isSigninInProgress: true })
    try {
      await GoogleSignin.hasPlayServices();
      const data = await GoogleSignin.signIn();
      // create a new firebase credential with the token
      const credential = firebase.auth.GoogleAuthProvider.credential(data.idToken, data.accessToken)
      // login with credential
      const firebaseUserCredential = await firebase.auth().signInWithCredential(credential);      

      this.props.navigation.dispatch(resetChat);

    } catch (error) {
      alert(error)
      
    } finally {
      
    }
  };


  render() {


    return (
      <View style={styles.container}>

        <GoogleSigninButton
          style={{ width: 250, height: 55, borderRadius: 50 }}
          size={GoogleSigninButton.Size.Wide}
          color={GoogleSigninButton.Color.white}
          onPress={this.signIn}
          disabled={this.state.isSigninInProgress} />          
     </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#333',
    padding: 20
  },
  txtInput: {
    height: 55,
    backgroundColor: "#FFF",
    alignSelf: "stretch",
    borderColor: "#EEE",
    borderWidth: 1,
    paddingHorizontal: 20,
    marginBottom: 10
  },
  button: {
    height: 35,
    backgroundColor: "#069",
    alignSelf: "stretch",
    paddingHorizontal: 20,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textButon: {
    color: "#FFF",
    fontWeight: "bold"
  }
});