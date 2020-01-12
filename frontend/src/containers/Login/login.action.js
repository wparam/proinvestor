export const loggedInUser = user => ({
    type: 'LOGGED_IN',
    payload: { user: user }
});