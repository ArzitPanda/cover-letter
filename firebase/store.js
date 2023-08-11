import { collection, addDoc, doc, setDoc, getDocs, getDoc } from "firebase/firestore"; 
import { db } from "./init";



export const createUser =async (uid,name) =>{


    try {
        const userRef = doc(db, "user", uid); 
            const data = await getDoc(userRef);
            if(!data.exists())
            {
                await setDoc(userRef, { name: name,premium:false,count:0 });
            }
        
        // 'users' is the collection name
       
        // console.log("Document written with ID: ", docRef.id);
      } catch (e) {
        console.error("Error adding document: ", e);
      }

}


export const createChat =async (uid,question,ans)=>{
        try {
            

                const docRef = doc(db,"user",uid)
            const chatRef = collection(docRef,"chat")

            const addData =await  addDoc(chatRef,{
                question,
                ans:ans
            })


        } catch (error) {
            console.log(error)
            
        }





}


