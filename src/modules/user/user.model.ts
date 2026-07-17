import { Schema, model } from "mongoose";

export enum UserRole {
    CUSTOMER = "CUSTOMER",
    ADMIN = "ADMIN",
    SELLER = "SELLER"
}

const userSchema = new Schema (
    {
        name : {
            type : String,
            require : true,
            trim : true
        },
        email : {
            type : String,
            require : true,
            unique : true,
            lowercase : true,
            trim : true
        },
        password : {
            type : String,
            require : true
        },
        role : {
            type : String,
            enum : Object.values(UserRole),
            default : UserRole.CUSTOMER
        },
        isActive : {
            type : Boolean,
            default : true
        }
    },
    {
        timestamps : true
    }
)

export const User = model('User',userSchema);