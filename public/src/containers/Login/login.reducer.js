const loginReducer = (state, action) =>{
    if(state === undefined)
        state = {};
    switch(action.type){
        case 'logged in':
            return Object.assign({}, state, action.user);
            break;
    }
    return state;
};

export default loginReducer;