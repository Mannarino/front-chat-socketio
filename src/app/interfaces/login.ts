export interface Login {
        data:{
            token:string,
            user:{
               name:string,
               email:string,
               rol:string
            }
        }
        msg:string,
        ok:boolean
    
}
