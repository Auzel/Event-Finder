/**
 * Functions that act as an api to get/set token in system storage
 * 
 */

export function setToken(token) {
    sessionStorage.setItem("token", JSON.stringify(token));
}

export function getToken() {
    let temp = sessionStorage.getItem("token");
    if (temp) {
        let token = JSON.parse(temp);
        return token;
    }
}