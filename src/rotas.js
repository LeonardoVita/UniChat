import {createStackNavigator, createAppContainer} from 'react-navigation';

import Login from './pages/login';
import Chat from './pages/chat';
import Main from './pages/main';
import Groups from './pages/groups';
import NewGroup from './pages/newGroup';

const appNavigator = createStackNavigator({ 
    Main : Main,
    Login : Login,
    Chat : Chat,
    Groups : Groups,
    NewGroup: NewGroup

},{
    initialRouteName : "Main",
    // headerLayoutPreset: 'center',
    
    // defaultNavigationOptions : {
    //     title : "UniChat",
    //     headerStyle: {            
    //        borderRadius: 15        
    //     },
    //     // headerTintColor: "white",
    //     headerTitletStyle:{
    //         fontWeight: 'bold'                                     
    //     }
    // }
    
});

const appContainer = createAppContainer(appNavigator);

export default appContainer;