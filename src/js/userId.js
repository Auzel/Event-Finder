/**
 * Functions that act as an api to get/set userid in system storage
 * 
 */

export function setUserId(id) {
    sessionStorage.setItem("userId", JSON.stringify(id));
}

export function getUserId() {
    let temp = sessionStorage.getItem("userId");
    let userId = null;
    if (temp) {
      let number = JSON.parse(temp);
      if (number && number != "") {
        userId = number;
        return userId;
      }
    }
}