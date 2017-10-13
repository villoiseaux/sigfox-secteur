

export class User  {
    public uid: string;
    public lastName: string;
    public firstName: string;
    public email: string;
    public password: string;
    public status: number;
    
    constructor (uid: string, lastName: string, firstName: string, email: string, password: string, status: number){
            this.uid = uid;
            this.lastName = lastName;
            this.firstName = firstName;
            this.email = email;
            this.password = password;
            this.status = status;
         }

    static deserialize(res: any) {
        let body = res.json();
        let user:User = new User(body["uid"], body["last_name"], body["first_name"], body["email"], body["password"], body["status"]);
        return user;
    }
}