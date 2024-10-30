import { signout } from "./api-auth";

function authenticate(jwt, cb) {
    if (typeof window !== "undefined") sessionStorage.setItem('jwt', JSON.stringify(jwt));
    cb();
}

function isAuthenticated() {
    if (typeof window === "undefined") return false;

    if (sessionStorage.getItem('jwt')) return JSON.parse(sessionStorage.getItem('jwt'));
    else return false;
}

function clearJWT(cb) {
    if (typeof window !== "undefined") sessionStorage.removeItem('jwt');

    cb();

    signout().then((data) => {
        document.cookie = "t=;expiresIn=2h;path=/;"
    });
}

function updateUser(user, cb) {
    if (typeof window !== "undefined") {
        if (sessionStorage.getItem('jwt')) {
            let auth = JSON.parse(sessionStorage.getItem('jwt'));
            auth.user = user;
            sessionStorage.setItem('jwt', JSON.stringify(auth));
            cb();
        }
    }
}

export { authenticate, isAuthenticated, clearJWT, updateUser };