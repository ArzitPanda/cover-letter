"use client";

import { Store } from "@/app/layout";
import { app, db } from "@/firebase/init";
import { ArrowBack } from "@mui/icons-material";
import { getAuth } from "firebase/auth";
import { collection, doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import { useContext, useEffect } from "react";
import ReactMarkdown from "react-markdown";

export default function Page({ params }) {
  const data = useContext(Store);



  const auth = getAuth();


  
  useEffect(() => {
    const checkData = async () => {
      // console.log(data);

      if (data.chatUser.length === 0) {
        const chatRef = doc(
          db,
          "user",
          localStorage.getItem("uid"),
          "chat",
          params.id
        );


        const docSnap = await getDoc(chatRef);
        if (docSnap.exists()) {
          console.log("exists");
          data.setChatUser([{ id: docSnap.id, ...docSnap.data() }]);
        }
      }
    };
    checkData();
  }, []);

  const { chatUser } = data;

  // const router = useRouter()

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">

      <div>
        <div className="absolute top-10 left-10 flex items-center justify-center gap-4">
          <ArrowBack height={10} onClick={()=>{
            window.history.back()
            // router.back()

          }}/>
          <img src={auth.currentUser?.photoURL} alt="img.png" className="w-30 h-30 rounded-full "/>
        </div>
      </div>
      <div className="w-4/5 bg-white rounded-lg shadow-lg p-6">
        {chatUser
          .filter((ele) => ele.id === params.id)
          .map((elem) => {
            return (
              <div className="flex flex-col space-y-4">
                <div className="text-sm  lg:text-2xl font-semibold text-gray-800">
                  {elem.question}
                </div>
                <div className="bg-blue-500 text-white p-4 rounded-lg">
                  <ReactMarkdown className="text-xs lg:text-lg">
                    {JSON.parse(elem.ans).message.content}
                  </ReactMarkdown>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
