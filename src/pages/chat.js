import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, FlatList, Button, Image } from 'react-native';
import firebase from 'react-native-firebase'
import { StackActions, NavigationActions } from 'react-navigation';
import Icon from 'react-native-vector-icons/Octicons';
import { MenuProvider } from 'react-native-popup-menu';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
  renderers
} from 'react-native-popup-menu';

const {Popover} = renderers;

export default class App extends Component {

  static navigationOptions = ({ navigation }) => {
    return {
      title: "", header: null
    };
  };

  constructor(props) {
    super(props);
    this.unsubscriber = null
    this.state = {
      user: firebase.auth().currentUser,
      mensage: '',
      msgList: [],
      groupKey:  this.props.navigation.getParam("groupKey",'null')
    }
  }

  componentWillMount() {
    // pega o id do grupo passado por parametro pelo navigation e carrega as ultimas 15 menssagens dos usuarios
    firebase.database().ref('groups/'+this.state.groupKey+'/mensages').limitToLast(15).on('child_added',
     (data) => {
      this.setState((previwState) => {
        return {
          msgList: [data.val(), ...previwState.msgList]
        }
      })
    })

  }

  // Botao de deslogar
  logOut = () => {
    firebase.auth().signOut();
  }

  componentDidMount() {   
    // Botao de deslogar reseta a tela para a tela inicial de login
    const resetMain = StackActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: 'Main' })],
    });

    this.unsubscriber = firebase.auth().onAuthStateChanged((user) => {
      // this.setState({user})
      if (!user)
      //  envia para pagina inicial
        this.props.navigation.dispatch(resetMain)
    });

  }  

  componentWillUnmount() {
    if (this.unsubscriber) {
      this.unsubscriber();
    }

  }

  sendMensage = async () => {
    if (this.state.mensage.length > 0) {

      let msgId = firebase.database().ref('groups/'+this.state.groupKey+'/mensages').push().key

      let updates = {};

      let mensageObj = {
        mensage: this.state.mensage,
        time: firebase.database.ServerValue.TIMESTAMP,
        from: this.state.user.displayName,
        fromUID: this.state.user.uid,
        photo: this.state.user.photoURL
      }

      updates['groups/'+this.state.groupKey+'/mensages/' + msgId] = mensageObj;


      firebase.database().ref().update(updates);
      this.setState({ mensage: '' });
    }
  }

  converteTempo = (time) => {
    let d = new Date(time);
    let c = new Date();

    let result = (d.getHours() < 10 ? '0' : '') + d.getHours() + ':';
    result += (d.getMinutes() < 10 ? '0' : '') + d.getMinutes();

    if (c.getDate() !== d.getDate()) {
      result = d.getDate() + '/' + d.getMonth() + ' ' + result;
    }
    return result;
  }  

  renderFlat = ({ item }) => {
    return (

      <View>
        {/* caixa da menssagem, muda de cor e de alinhamento lateral caso seja do proprio usuario */}
        <View style={{
          flexDirection: "row", alignItems: 'flex-end', justifyContent: 'flex-end',
          alignSelf: item.fromUID === this.state.user.uid ? 'flex-end' : 'flex-start',
          backgroundColor: item.fromUID === this.state.user.uid ? '#0089' : '#7cb342',
          borderRadius: 20,
          marginBottom: 5,
          paddingLeft: item.fromUID === this.state.user.uid ? 7 : null
        }}>
          {/* cada menssagem mostra um popover com o nome do usuario que a envio quando clicado */}
          <Menu
            renderer={Popover}
            // rendererProps={{ anchorStyle: styles.anchorStyle }}
            style={{ height: 50 }}
          >
            <MenuTrigger style={{ flexDirection: 'row' }}>
              
                <Image
                  style={{
                    width: item.fromUID === this.state.user.uid ? null : 50,
                    height: item.fromUID === this.state.user.uid ? null : 50,
                    borderRadius: 20
                  }}
                  source={{ uri: item.fromUID === this.state.user.uid ? null : item.photo }}
                />
                <View style={{ flexDirection: 'column' }}>
                  <Text style={{ color: '#fff', padding: 5, fontSize: 14, marginHorizontal: 7 }}>
                    {item.mensage}
                  </Text>
                  <Text style={{ color: '#eee', paddingRight: 15, fontSize: 10, alignSelf: 'flex-end' }}>
                    {this.converteTempo(item.time)}
                  </Text>
                </View>
              
            </MenuTrigger>
            {/* popover com nome do usuario */}
            <MenuOptions>
                  <MenuOption text={item.from}/>
            </MenuOptions>
          </Menu>

        </View>
      </View>
    )
  }

  render() {
    return (
      <MenuProvider
        skipInstanceCheck={true}
        // customStyles={{ backdrop: styles.backdrop }}
      >
        <View style={styles.container}>

          {/* Header */}

          <View style={styles.headerStyle}>
            <Icon
              name="arrow-left"
              size={39}
              color='#069'
              style={{ paddingHorizontal: 6 }}
              onPress={() => this.props.navigation.goBack()}

            />
            <Text style={styles.headerTitle}> UniChat</Text>
            <Menu>
              <MenuTrigger>
                <Icon
                  name="gear"
                  size={39}
                  color='#069'
                  style={{ paddingHorizontal: 6 }}
                />
              </MenuTrigger>
              <MenuOptions customStyles={optionsStyles}>
                <MenuOption onSelect={() => alert("Lista de Usuarios")} >
                  <Text style={styles.text}>Grupo</Text>
                  <Icon
                    name="organization"
                    size={39}
                    color='#069'
                  />
                </MenuOption>
              </MenuOptions>
            </Menu>
          </View>

          {/* CHAT */}

          <View style={{ paddin: 10, margin: 5, width: '100%', flex: 1 }}>
            <FlatList
              data={this.state.msgList}
              renderItem={this.renderFlat}
              keyExtractor={(item, index) => index.toString()}
              inverted
            />
          </View>


          {/* Input de menssagens */}

          <View style={{ flexDirection: 'row' }}>

            <TextInput style={styles.txtInput}

              onChangeText={mensage => { this.setState({ mensage })}}
              value={this.state.mensage}

            />

            <TouchableOpacity style={styles.buttonSend} onPress={this.sendMensage}>              
              <Icon
                name="pencil"
                size={39}
                color='#069'
                style={{ paddingHorizontal: 6 }}
              />
            </TouchableOpacity>

          </View>
        </View>
      </MenuProvider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  text: {
    marginRight: 6,
    fontSize: 16,
    fontWeight: 'bold'
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
  },
  txtInput: {
    flex: 1,
    height: 55,
    backgroundColor: "#FFF",
    alignSelf: "stretch",
    borderColor: "#bbb",
    borderWidth: 1,
    paddingHorizontal: 20,
    marginBottom: 10,
    borderRadius: 40,
    elevation: 2
  },
  buttonSend: {
    height: 55,
    // backgroundColor: "#069",
    alignSelf: "stretch",
    paddingHorizontal: 3,
    marginBottom: 10,
    justifyContent: "center",
    borderRadius: 90,
    // elevation: 5

  },
  headerStyle: {
    width: '100%',
    height: '9%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 5,
    elevation: 4,

  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "bold"
  },
  backdrop: {
    backgroundColor: '#333', // background quando trigger for acionado
    opacity: 0.6,

  },

});

const optionsStyles = {
  optionsContainer: {            //caixa externa que envolve o wrapper das opções        
    padding: 5,
    width: 150,
  },
  optionWrapper: {                //caixa de cada opção      
    marginVertical: 5,
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexDirection: 'row'
  },

};
