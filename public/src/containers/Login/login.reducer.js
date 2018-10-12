const loginReducer = (state, action) =>{
    if(state === undefined)
        state = { user: {}};
    switch(action.type){
        case 'LOGGED_IN':
            return Object.assign({}, state, action.payload);
            break;
    }
    return state;
};

export default loginReducer;