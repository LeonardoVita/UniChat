import React, { Component } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, FlatList,Button } from 'react-native';
import firebase from 'react-native-firebase';
import { StackActions, NavigationActions } from 'react-navigation';
import Icon from 'react-native-vector-icons/Octicons';
import Icon2 from 'react-native-vector-icons/Feather';
import { MenuProvider } from 'react-native-popup-menu';
import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger
} from 'react-native-popup-menu';

export default class Groups extends Component {

    static navigationOptions = ({ navigation }) => {
        return {
            title: "", header: null
        };
    };

    constructor(props) {
        super(props)
        this.unsubscriber = null
        this.state = {
            user: firebase.auth().currentUser,  
            groups: []  
        }
    }

    componentWillMount() {
        // Carrega todos os grupos de chat do banco de dados para a lista
        firebase.database().ref('groups').on('child_added', (data) => {
            
            this.setState((estadoAnterior) => {
                return {
                    groups: [data.val(), ...estadoAnterior.groups]
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
        this.props.navigation.setParams({ deslogar: this.deslogar });

        const resetMain = StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({ routeName: 'Main' })],
        });
        //detecta se o usuario deslogar 
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
    
    
    renderGroup = ({ item }) => {
        return (
            <View>
                <TouchableOpacity onPress={() => { this.props.navigation.navigate('Chat',
                {groupKey: item.info.groupKey})}} 
                style={{alignItems:'center',backgroundColor: '#069',margin: 5,
                borderRadius:20,elevation:4,borderWidth:1,borderColor: '#eee'}}>
                    <Text style={{fontSize: 36,fontWeight: 'bold',padding: 5,color:"#eeeeee" }}>{item.info.groupName}</Text>
                </TouchableOpacity>
            </View>
        )
    }
    
    


    render() {
        return (
            <MenuProvider skipInstanceCheck={true} customStyles={{ backdrop: styles.backdrop }}>
                <View style={styles.container}>
                    <View style={styles.headerStyle}>
                        {/* <Icon
                        name="arrow-left"
                        size={39}
                        color='#069'
                        style={{ paddingHorizontal: 6 }}
                        onPress={() => alert('apertou')}

                        /> */}
                        <View style={{ width: 39 }}></View>
                        <Text style={styles.headerTitle}> UniChat</Text>
                        {/* HEADER */}
                        <Menu>
                            <MenuTrigger>
                                <Icon
                                    name="three-bars"
                                    size={39}
                                    color='#069'
                                    style={{ paddingHorizontal: 6 }}
                                />
                            </MenuTrigger>
                            <MenuOptions customStyles={optionsStyles}>
                                <MenuOption onSelect={() => { this.props.navigation.navigate('Main') }} >
                                    <Text style={styles.text}>Recarregar</Text>
                                    <Icon
                                        name="sync"
                                        size={39}
                                        color='#069'

                                    />
                                </MenuOption>
                                <MenuOption onSelect={this.logOut} >
                                    <Text style={styles.text}>Deslogar</Text>
                                    <Icon
                                        name="sign-out"
                                        size={39}
                                        color='#069'
                                    />
                                </MenuOption>
                            </MenuOptions>
                        </Menu>
                    </View>
                        {/* GRUPOS */}
                    <View style={styles.groups}>
                        <FlatList
                            data={this.state.groups}
                            renderItem={this.renderGroup}
                            keyExtractor={(item, index) => index.toString()}
                            
                        />                         
                        <TouchableOpacity                        
                        onPress= {()=>this.props.navigation.navigate('NewGroup')}
                        style={{alignItems: 'center'}}> 
                            <View style={styles.newGroupIcon}>                                                
                                <Icon2 
                                name="plus"
                                size={69}
                                color='#eee'                                
                                />
                            </View>   
                        </TouchableOpacity> 
                    </View>
                </View>
            </MenuProvider>
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
    text: {
        marginRight: 6,
        fontSize: 16,
        fontWeight: 'bold'
    },
    groups: {
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
    backdrop: {
        backgroundColor: '#333', // background quando trigger for acionado
        opacity: 0.6,

    },
    newGroupIcon:{
        alignItems: 'center',
        justifyContent: 'center',        
        backgroundColor: '#069',        
        margin:3,
        marginBottom: 30,      
        borderRadius: 100,
        elevation: 5
        
    }

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



