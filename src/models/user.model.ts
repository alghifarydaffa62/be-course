import mongoose from "mongoose";
import { encrypt } from "../utils/encryption";
import { sendMail, renderMailHtml } from "../utils/mail/mail";
import { CLIENT_HOST, EMAIL_SMTP_USER } from "../utils/env";

export interface User {
    fullname: string;
    username: string;
    email: string;
    password: string;
    role: string;
    profilePicture: string;
    isActive: boolean;
    activationCode: string;
    createdAt?: string;
}

const Schema = mongoose.Schema;

const userSchema = new Schema<User>({
    fullname: {
        type: Schema.Types.String,
        required: true
    },

    username: {
        type: Schema.Types.String,
        required: true,
        unique: true
    },

    email: {
        type: Schema.Types.String,
        required: true,
        unique: true
    },

    password: {
        type: Schema.Types.String,
        required: true
    },

    role: {
        type: Schema.Types.String,
        enum: ["admin", "user"],
        default: "user"
    },

    profilePicture: {
        type: Schema.Types.String,
        default: "user.jpg"
    },

    isActive: {
        type: Schema.Types.Boolean,
        default: false
    },

    activationCode: {
        type: Schema.Types.String,
    }
}, {
    timestamps: true
});

userSchema.pre("save", function (next) {
    const user = this;
    user.password = encrypt(user.password);
    user.activationCode = encrypt(user.id);
    next();
})

userSchema.post("save", async function(doc, next) {
    try {
        const user = doc;
    
        console.log("Send email to: ", user.email);

        const contentMail = await renderMailHtml("registrationSuccess.ejs", {
            username: user.username,
            fullname: user.fullname,
            email: user.email,
            createdAt: user.createdAt,
            activationLink: `${CLIENT_HOST}/auth/activation?code=${user.activationCode}`
        })

        await sendMail({
            from: EMAIL_SMTP_USER,
            to: user.email,
            subject: "Aktivasi akun anda",
            html: contentMail
        })
    } catch(error) {
        console.log("error > ", error)
    } finally {
        next();
    }
})

userSchema.methods.toJSON = function () {
    const user = this.toObject();
    delete user.password; 
    return user;
}

const userModel = mongoose.model("User", userSchema);

export default userModel;