class User{
    constructor(userID, userName, userPassword, userPhoneNumber, userEmail, isActive){
        this.userID = userID;
        this.userPassword = userPassword;
        this.userName = userName;
        this.userPhoneNumber = userPhoneNumber;
        this.userEmail = userEmail;
        this.isActive = isActive;
    }
}

export default User;