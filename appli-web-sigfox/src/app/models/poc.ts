export class Poc {
    public uid: string;
    public lastseen: number;
    public status: string;
    public favorite: boolean;

    
    constructor(uid: string, lastseen: number, status: string, favorite: boolean){
        this.uid = uid;
        this.lastseen = lastseen;
        this.status = status;
        this.favorite = favorite;

    }

    static deserialize(body: any){
        let poc:Poc = new Poc(body["mac"],body["lastseen"] ,body["status"], body["favorite"]);
        return poc;
    }
}