import {
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    onAuthStateChanged,
    sendEmailVerification,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
    updateProfile
} from 'firebase/auth';
import { createContext, useEffect, useState } from 'react';
import { auth } from '../firebase.init';
import toast from 'react-hot-toast';

export const AuthContext = createContext(null);

const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [userDb, setUserDb] = useState(null);
    const [loading, setLoading] = useState(true);
    const [theme, setTheme] = useState('light');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isHealthData, setIsHealthData] = useState(false);
    const [healthId, setHealthId] = useState(null);
    const [isVerifyProfessional, setIsVerifyProfessional] = useState(false);

    const fetchUserHealthId = async () => {
        try {
            const response = await fetch(`https://SlideBanai.onrender.com/api/v1/health`, {
                method: "GET",
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            const userHealthInfo = result.data.find((userHealth) => userHealth.user === userDb._id);

            if (userHealthInfo) {
                setHealthId(userHealthInfo._id);
            } else {
                console.warn("No health information found for the user.");

                // Create new health information for the user
                await fetch(`https://SlideBanai.onrender.com/api/v1/health`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        user: userDb._id,
                    }),
                });

                fetchUserHealthId();
            }
        } catch (error) {
            console.error("Error fetching user health ID:", error);
        }
    };

    const createUser = async (email, password, displayName = '', photoURL = '') => {
        setLoading(true);
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const createdUser = userCredential.user;

            // send verification email
            sendEmailVerification(auth.currentUser)
                .then(() => {
                    toast.success('Verification email sent.')
                })

            // Update the profile with display name and photo URL
            if (displayName || photoURL) {
                await updateProfile(createdUser, { displayName, photoURL });
            }

            // Manually set the user to ensure immediate state update
            setUser({
                ...createdUser,
                displayName,
                photoURL,
            });

            // Show toast alert for successful registration
            toast.success('Registration successful! Welcome to SlideBanai.');

            setLoading(false);
            return createdUser;
        } catch (error) {
            setLoading(false);
            throw error;
        }
    };

    const signInUser = async (email, password) => {
        setLoading(true);
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const loggedInUser = userCredential.user;

            if (loggedInUser.emailVerified) {
                setUser(loggedInUser);

                // Fetch user data from the server
                // try {
                //     const response = await fetch("https://SlideBanai.onrender.com/api/v1/user", {
                //         method: "GET",
                //     });
                //     const data = await response.json();
                //     const foundUser = data.find(userData => userData.email === email);
                //     setUserDb(foundUser);
                // } catch (error) {
                //     console.error("Error fetching user data:", error);
                // }


                // Check if the user is a professional
                // try {
                //     const response = await fetch(`https://SlideBanai-server.vercel.app/professionals/${email}`, {
                //         method: "GET",
                //     });

                //     if (!response.ok) {
                //         throw new Error(`Server returned status: ${response.status}`);
                //     }

                //     const data = await response.json();
                //     console.log(data.status, "Status received from API");

                //     console.log(data.status === 1, "data");

                //     if (data.status === 2) {
                //         // Verified professional
                //         console.log("User is a verified professional");
                //         setUserType('professional');
                //         setIsVerifyProfessional(true);
                //     } else if (data.status === 1) {
                //         // Unverified professional
                //         console.log("User is an unverified professional");
                //         setUserType('professional');
                //         setIsVerifyProfessional(false);
                //     } else if (data.status === 0) {
                //         // Not a professional
                //         console.log("User is not a professional");
                //         setUserType('user');
                //         setIsVerifyProfessional(false);
                //     }
                // } catch (error) {
                //     console.error("Error fetching user data:", error.message);
                // }



                console.log(loggedInUser, "logged in user");

                toast.success('Login successful! Welcome back to SlideBanai.');
            } else {
                await signOutUser();
                throw new Error('Please verify your email before logging in.');
            }
            setLoading(false);
            return loggedInUser;
        } catch (error) {
            setLoading(false);
            if (error.message === 'Please verify your email before logging in.') {
                toast.error(error.message);
                await sendEmailVerification(auth.currentUser);
            } else {
                toast.error('Email and Password does not match.');
            }
            throw error;
        }
    };

    const signInWithGoogle = async () => {
        setLoading(true);
        try {
            const result = await signInWithPopup(auth, googleProvider);
            setUser(result.user);

            // Send user data to the server
            try {
                await fetch("https://SlideBanai.onrender.com/api/v1/user/create-user", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        name: result.user.displayName,
                        email: result.user.email,
                        password: "GOOGLE-LOGIN",
                    }),
                });
            } catch (error) {
                console.error("Error submitting user data:", error);
            }

            toast.success('Google login successful! Welcome to SlideBanai.');
            setLoading(false);
            return result.user;
        } catch (error) {
            setLoading(false);
            throw error;
        }
    };

    const signOutUser = () => {
        setLoading(true);
        return signOut(auth).then(() => {
            setUser(null);
            setUserDb(null);
            setLoading(false);
            setIsHealthData(false);
        });
    };


    useEffect(() => {
        const unSubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                // Fetch userDb based on the logged-in user
                try {
                    const response = await fetch("https://SlideBanai.onrender.com/api/v1/user");
                    const data = await response.json();
                    const foundUser = data.find(userData => userData.email === currentUser.email);
                    setUserDb(foundUser); // Update userDb
                } catch (error) {
                    console.error("Error fetching userDb:", error);
                }
            } else {
                setUserDb(null); // Reset if no user
            }
            setLoading(false);
        });

        return () => {
            unSubscribe();
        };
    }, []);


    const authInfo = {
        user,
        loading,
        createUser,
        signInUser,
        signInWithGoogle,
        signOutUser,
        theme,
        setTheme,
        isSidebarOpen,
        setIsSidebarOpen,
        userDb,
        setUserDb,
        setIsHealthData,
        isHealthData,
        healthId,
        fetchUserHealthId,
        isVerifyProfessional,
        setIsVerifyProfessional
    };

    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
