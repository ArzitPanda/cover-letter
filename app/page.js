"use client";
import Image from "next/image";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { getAuth, signInWithPopup, signOut } from "firebase/auth";
import { db, provider } from "@/firebase/init";
import ReactMarkdown from "react-markdown";
import { useRouter } from "next/navigation";
// import {useContext} from 'react'
import { Store } from "./layout";
import { createChat, createUser } from "@/firebase/store";
import {
  collection,
  doc,
  getDoc,
  getDocFromCache,
  getDocs,
  increment,
  updateDoc,
} from "firebase/firestore";
import Link from "next/link";
import TemporaryDrawer from "@/components/Drawer";
import Animations from "@/components/Skeleton";
import { ChatBubbleTwoTone, Google } from "@mui/icons-material";
import PaymentButton from "@/components/PaymentButton";
import { Alert, Backdrop, Chip } from "@mui/material";

export default function Home() {
  const token = process.env.API_KEY;

  // console.log(token)
  //
  const router = useRouter();
  const [val, setVal] = useState("");
  const [data, setData] = useState("");
  const [chat, setChat] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [state, setState] = useState(false);
  const [premium, setPremium] = useState({});

  const userData = useContext(Store);

  const getChat = async (uid) => {
    const docRef = doc(db, "user", uid);
    const chatData = [];
    const chatRef = collection(docRef, "chat");

    const querySnapshot = await getDocs(chatRef);

    querySnapshot.forEach((doc) => {
      const data = doc.data();

      chatData.push({ ...data, id: doc.id });
    });

    setChat(chatData);

    userData.setChatUser(chatData);
  };

  const auth = getAuth();

  auth.onAuthStateChanged(async (user) => {
    if (user) {
      // const data  = await getChat(userData.user.uid);

      userData.setUser(user);
    } else {
      userData.setUser({});
    }
  });

  useEffect(() => {
    (async () => {
      const uid = localStorage.getItem("uid");
      const uservalue = await getDoc(doc(db, "user", uid));

      const data = uservalue.data();
      console.log(data);
      userData.setUser({ ...userData.user });
      setPremium(data);
      await getChat(uid || userData.user?.uid);
    })();
  }, []);

  const onHandleInputChange = (e) => {
    setVal(e.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if(userData.user?.premium === false && userData.user?.count>2)
    {
      setIsPremiumPopUp(true);
      return;
    
    }
if(userData.user?.premium === true && userData.user?.count>200)
{
  setIsPremiumPopUp(true);
  return;

}

      



    // if (val.trim() === '') return;

    try {
      const uservalue = await getDoc(doc(db, "user", userData.user?.uid));
      const details = uservalue.data();
      console.log(details);

      setIsLoading(true);
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          messages: [
            {
              role: "user",
              content: `hello my name is ${
                userData.user && userData.user?.displayName
              } i want to apply for this job description ${val} make a suitable cover letter for the job which is impressive `,
            },
          ],
          model: "gpt-3.5-turbo",
          max_tokens: 250,
          temperature: 0.7,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const chatResponse = response.data.choices[0];
      setData(chatResponse.message?.content);
      setIsLoading(false);

      const user = userData.user?.uid;
      await createChat(user, val, JSON.stringify(chatResponse));
      const data = await getChat(user);
      await updateDoc(doc(db, "user", user), { count: increment(1) });

      console.log(data);
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  };

  const login = () => {
    signInWithPopup(auth, provider)
      .then(async (result) => {
 
        const user = result.user;

        localStorage.setItem("uid", user.uid);
        userData.setUser(user);

        const data = await createUser(user.uid, user.displayName);

        // IdP data available using getAdditionalUserInfo(result)
        // ...
      })
      .catch((error) => {
        // Handle Errors here.
        console.log(error);

        // ...
      });
  };

  return (
    <div className="w-screen flex items-center justify-center flex-col">
      <div className="w-full flex flex-col lg:flex-row items-center justify-between  h-20 py-2 lg:h-24 bg-blue-500">
        <div className="flex items-center w-full justify-between lg:justify-start px-2 py-4  lg:w-2/5 ">
          {Object.keys(userData.user).length > 0 ? (
            <button
              className="bg-white text-black font-mono h-24 w-56 px-2 rounded-lg mx-6 my-auto flex flex-col items-start justify-center "
              onClick={async () => {
                await signOut(auth);
                userData.setUser(false);
                router.push("/404");
              }}
            >
              <div className="flex flex-row items-center justify-between w-full px-6">
                {userData.user.displayName}

                <img
                  src={userData.user?.photoURL}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              </div>
              <div className="bg-black text-white font-mono ml-6 p-2 px-6 rounded-xl">
                logout
              </div>
            </button>
          ) : (
            <button
              onClick={login}
              className="bg-white text-black font-mono h-16 w-40 px-2 rounded-lg mx-6 my-auto"
            >
              Sign in With Google <Google size={10} />
            </button>
          )}

          <button
            className="text-white font-bold text-lg flex flex-col items-center justify-center gap-2"
            onClick={() => {
              setState(!state);
            }}
          >
            <ChatBubbleTwoTone />
            <h1> Your Chats</h1>
          </button>
        </div>

        <div className="flex items-center justify-between px-6 lg:justify-around w-full lg:w-1/6">
          <div className="text-white font-mono text-lg">first draft 1.0()</div>
          <div className="flex">
            {premium?.premium === false && <PaymentButton />}
            {premium?.premium === true ? (
              <Chip label="pro" color="warning" size="medium" />
            ) : (
              <Chip label="basic" color="primary" size="medium" />
            )}
            <div className="text-white font-medium text-lg  px-4">
              {premium?.premium === true ? (
                `remaining ${200 - premium.count}`
              ) : (
                <div className="py-4">
                  <p className="py-4">{`remaining ${10 - premium.count}`}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center mt-9 gap-4S w-3/5">
        <input
          type="text"
          placeholder="paste company's requirement"
          onChange={(e) => {
            onHandleInputChange(e);
          }}
          value={val}
          className="my-2 border-2 w-full py-2 px-6 focus:outline-none hover:border-blue-700  hover:border-4 transition-colors rounded-2xl h-24 placeholder:text-blue-500  border-blue-600 caret-black text-lg font-mono"
        />
        <button
          onClick={handleSubmit}
          className="mb-2 h-12 block w-full rounded border-2 border-primary px-6 pb-[6px] pt-2 text-xs font-medium uppercase leading-normal text-blue-500     transition duration-150 ease-in-out hover:border-primary-600 hover:bg-neutral-500 hover:bg-opacity-10 hover:text-primary-600 focus:border-primary-600 focus:text-primary-600 focus:outline-none focus:ring-0 active:border-primary-700 active:text-primary-700 dark:hover:bg-neutral-100 dark:hover:bg-opacity-10"
        >
          Generate
        </button>
        <div className="mt-20">
          {isLoading ? (
            <Animations />
          ) : (
            <div className="bg-gray-200 text-black mt-6   w-full">
              <ReactMarkdown className="p-2">{data && data}</ReactMarkdown>

              {/* text to be shown */}
            </div>
          )}
        </div>
      </div>

      <TemporaryDrawer data={chat} state={state} setState={setState} />
    </div>
  );
}
