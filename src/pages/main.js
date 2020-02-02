import React from 'react';
import { View, Text } from 'react-native'
import firebase from 'react-native-firebase';
import { StackActions, NavigationActions } from 'react-navigation';

class App extends React.Component {

  constructor() {
    super();
    this.unsubscriber = null;

    this.state = {
      user: null
    }
  }

  static navigationOptions = { header: null }

  componentDidMount() {

    const resetChat = StackActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: 'Groups' })],
    });

    const resetLogin = StackActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: 'Login' })],
    });

    this.unsubscriber = firebase.auth().onAuthStateChanged((user) => {
      // this.setState({user})
      if (!user)
        this.props.navigation.dispatch(resetLogin)
      else
        this.props.navigation.dispatch(resetChat)
    });

  }

  componentWillUnmount() {
    if (this.unsubscriber) {
      this.unsubscriber();
    }
  }


  render() {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    )
  }

}

export default App;