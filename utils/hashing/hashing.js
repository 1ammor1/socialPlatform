import bcrypt from "bcrypt";

export const hash = ({plainText, rounds = Number(process.env.ROUNDS)})=>{
    console.log("👉 plainText:", plainText);
    console.log("👉 rounds:", rounds);
    return bcrypt.hashSync(plainText,rounds);

}

export const compare = ({plainText, hashText})=>{
    return bcrypt.compareSync(plainText,hashText);
}