import { createContext, useEffect, useReducer } from 'react'


// create AuthContext 
export const AuthContext = createContext() 

// reducer for manage AuthContext state
export const authReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN': 
            localStorage.setItem("user", JSON.stringify(action.payload))
            return { user: action.payload }
        case 'LOGOUT': 
            localStorage.removeItem("user")
            return { user: null}
        default: 
            return state
    }
}

// manage user data when a user logs in 
export const AuthContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, {
        user: null
    })

    // set intial state values 
    useEffect(() => {
        // check if user is already logged in 
        const user = JSON.parse(localStorage.getItem('user'))
        if (user) {
            dispatch({type: 'LOGIN', payload: user})
        }
    }, [])

    console.log('AuthContext state: ', state)

    return (
        <AuthContext.Provider value={{...state, dispatch}}>
            {children}
        </AuthContext.Provider>
    )
}