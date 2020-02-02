import React, { Component } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, } from 'react-native';
import firebase from 'react-native-firebase';
import Icon from 'react-native-vector-icons/Octicons';
import { TextInput } from 'react-native-gesture-handler';


export default class Groups extends Component {

    static navigationOptions = ({ navigation }) => {
        return {
            title: "", header: null
        };
    };

    constructor(props) {
        super(props)
        this.state = {
            user: firebase.auth().currentUser,
            groupNameInput: ''
        }
    }   
    

    newGroup = async () => {
        if(this.state.groupNameInput !== '' && this.state.groupNameInput.length > 6
        && this.state.groupNameInput.length < 19){

        let groupId = firebase.database().ref('groups').push().key

        let updates = {};

        let groupObj = {
            time: firebase.database.ServerValue.TIMESTAMP,
            admin: this.state.user.uid,
            groupName: this.state.groupNameInput,
            groupKey: groupId
        }

        updates['groups/' + groupId + '/info'] = groupObj;


        firebase.database().ref().update(updates);

        let users = firebase.database().ref('groups/' + groupId + '/users').push().key

        let userObj = {
            userUID: this.state.user.uid,
        }

        updates['groups/' + groupId + '/users/' + users] = userObj;

        firebase.database().ref().update(updates);

        alert('Grupo "'+ this.state.groupNameInput +'" criado com sucesso!')
        this.props.navigation.goBack();
     }else{alert('Nome do Grupo incorreto!')}

    }


    render() {
        return (

            <View style={styles.container}>
                <View style={styles.headerStyle}>
                    <Icon
                        name="arrow-left"
                        size={39}
                        color='#069'
                        style={{ paddingHorizontal: 6 }}
                        onPress={() => this.props.navigation.goBack()}
                    />
                    <Text style={styles.headerTitle}> UniChat</Text>
                    <View style={{ width: 39 }}></View>
                </View>
                <View style={styles.body}>

                    <TextInput
                    onChangeText={groupNameInput => { this.setState({ groupNameInput })}}
                    value={this.state.groupNameInput}
                    placeholder='Nome do grupo'
                    style={styles.txtInput}
                    /> 
                    <Text style={{marginHorizontal: 20}}>
                        *O nome do grupo precisa ter mais de 6 caracters e menos de 18,inclui espaços
                    </Text>              

                </View>
                <TouchableOpacity onPress={this.newGroup} style={styles.btnNewGroup}>
                
                    <Text style={styles.btnNewGroupText}>
                        Criar Grupo
                    </Text>
                
                </TouchableOpacity> 
            </View>

        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'stretch',
        backgroundColor: '#F5FCFF',
    },
    txtInput: {  
        fontSize: 22,      
        height: 55,
        width: 336,
        backgroundColor: "#FFF",
        alignSelf: "center",
        borderColor: "#bbb",
        borderWidth: 1,
        paddingHorizontal: 20,        
        borderRadius: 5,
        elevation: 2
    },
    body: {
        flex: 1,
        // flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'stretch',

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
        fontWeight: "bold",        
    },
    btnNewGroup:{
        
        flexDirection : 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: "#069",
        height: 55,
        borderRadius: 5,
        margin: 6
    },
    btnNewGroupText:{
        fontSize: 22,
        fontWeight: 'bold',
        color: "#eee"
    }
    

});





