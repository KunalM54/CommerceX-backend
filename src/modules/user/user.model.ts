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
            required : true,
            trim : true
        },
        email : {
            type : String,
            required : true,
            unique : true,
            lowercase : true,
            trim : true
        },
        password : {
            type : String,
            required : true,
            select: false
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