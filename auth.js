// auth.js
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { auth, db } from './firebase.js';

// --- AUTH FUNCTIONS ---

const signUpUser = (name, email, password) => {
    return createUserWithEmailAndPassword(auth, email, password)
        .then(userCredential => {
            const user = userCredential.user;
            return setDoc(doc(db, "users", user.uid), {
                displayName: name,
                email: user.email,
                createdAt: new Date()
            });
        });
};

const loginUser = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
};

const logoutUser = () => {
    return signOut(auth).then(() => window.location.href = 'index.html');
};

const monitorAuthState = (onUserLoggedIn, onUserLoggedOut) => {
    onAuthStateChanged(auth, user => {
        if (user) {
            onUserLoggedIn(user);
        } else {
            onUserLoggedOut();
        }
    });
};

const protectPage = () => {
    onAuthStateChanged(auth, user => {
        if (!user) {
            window.location.href = 'index.html';
        }
    });
};

// --- GLOBAL FUNCTIONS ---

window.closeModal = () => {
    const modal = document.querySelector('.fixed.inset-0');
    if (modal) modal.remove();
};

window.openAuthModal = (initialState = 'signup') => {
    const existingModal = document.querySelector('.fixed.inset-0');
    if(existingModal) return;

    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
    
    modal.innerHTML = `
        <div class="bg-white rounded-2xl p-8 max-w-md w-full text-center relative">
            <button onclick="closeModal()" class="absolute top-2 right-4 text-2xl text-gray-400 hover:text-gray-600">&times;</button>
            <h3 id="modalTitle" class="text-2xl font-bold text-gray-900 mb-6">Create Your Account</h3>
            <div class="space-y-4">
                <input id="name-input" type="text" placeholder="Enter your full name" class="w-full px-4 py-3 border border-gray-300 rounded-xl">
                <input id="email-input" type="email" placeholder="Enter your email" class="w-full px-4 py-3 border border-gray-300 rounded-xl">
                <input id="password-input" type="password" placeholder="Enter your password" class="w-full px-4 py-3 border border-gray-300 rounded-xl">
                <button id="modalActionBtn" class="w-full bg-forest text-white py-3 rounded-xl font-semibold hover:bg-green-700">Sign Up</button>
                <p id="modal-message" class="text-sm h-4 text-red-500"></p>
                <a href="#" id="modalToggleLink" class="text-sm text-forest hover:underline">Already have an account? Login</a>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    const nameInput = document.getElementById('name-input');
    const emailInput = document.getElementById('email-input');
    const passwordInput = document.getElementById('password-input');
    const modalActionBtn = document.getElementById('modalActionBtn');
    const modalToggleLink = document.getElementById('modalToggleLink');
    const modalTitle = document.getElementById('modalTitle');
    const modalMessage = document.getElementById('modal-message');

    let isLogin = initialState === 'login';

    const updateModalState = () => {
        nameInput.style.display = isLogin ? 'none' : 'block';
        modalTitle.textContent = isLogin ? 'Login to Your Account' : 'Create Your Account';
        modalActionBtn.textContent = isLogin ? 'Login' : 'Sign Up';
        modalToggleLink.textContent = isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Login';
        modalMessage.textContent = '';
    };
    
    updateModalState();

    modalToggleLink.onclick = (e) => {
        e.preventDefault();
        isLogin = !isLogin;
        updateModalState();
    };

    modalActionBtn.onclick = () => {
        const name = nameInput.value;
        const email = emailInput.value;
        const password = passwordInput.value;
        modalMessage.textContent = 'Processing...';

        const promise = isLogin ? loginUser(email, password) : signUpUser(name, email, password);

        promise.then(() => {
            window.location.href = 'dashboard.html';
        }).catch(error => {
            modalMessage.textContent = error.message.replace('Firebase: ', '');
        });
    };
};


// --- UI LOGIC FOR INDEX PAGE ---
if (document.getElementById('loginBtnNav')) {
    const loginBtnNav = document.getElementById('loginBtnNav');
    const signupBtnNav = document.getElementById('signupBtnNav');
    const logoutBtnNav = document.getElementById('logoutBtnNav');
    const dashboardBtnNav = document.getElementById('dashboardBtnNav');
    const userInfoNav = document.getElementById('userInfoNav');

    const showLoggedInState = (user) => {
        loginBtnNav.style.display = 'none';
        signupBtnNav.style.display = 'none';
        logoutBtnNav.style.display = 'block';
        dashboardBtnNav.style.display = 'block';
        userInfoNav.style.display = 'block';
        
        getDoc(doc(db, "users", user.uid)).then(docSnap => {
            if (docSnap.exists()) {
                userInfoNav.textContent = `Hi, ${docSnap.data().displayName}`;
            } else {
                userInfoNav.textContent = user.email;
            }
        });
    };

    const showLoggedOutState = () => {
        loginBtnNav.style.display = 'block';
        signupBtnNav.style.display = 'block';
        logoutBtnNav.style.display = 'none';
        dashboardBtnNav.style.display = 'none';
        userInfoNav.style.display = 'none';
    };
    
    logoutBtnNav.addEventListener('click', logoutUser);
    monitorAuthState(showLoggedInState, showLoggedOutState);
}


// --- EXPORTS FOR OTHER FILES ---
export { protectPage, logoutUser };