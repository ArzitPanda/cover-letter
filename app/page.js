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
import { Alert, Backdrop, Chip, Pagination } from "@mui/material";
import Logo from "@/components/Logo";
import JobDescription from "@/components/JobModal";

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

  const [jobs,setJobs] = useState([]);
  const [selectedJob,setSelectedJob] = useState();
  const [jobModal,setJobModal]=useState(false);
  const [pageSerach,setPageSearch]=useState(0);

  const userData = useContext(Store);



  const handlePageChange =(event,count)=>{
      setPageSearch(count-1);

  }

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

  useEffect(()=>{

    (async ()=>{

      const url = `https://jobtrigger.azurewebsites.net/api/get_generic?page=${pageSerach}`
      const data  = (await axios.get(url)).data;
      setJobs(data)


    })();

  },[pageSerach,setPageSearch])



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
          max_tokens: 350,
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
        setVal("")
      console.log(data);
    } catch (err) {
      console.log(err);
      setVal("")
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
     
     <div className="w-screen flex justify-between items-center h-20 py-2 lg:h-24 bg-blue-500">
  <div className="flex items-center justify-start w-full lg:w-3/12 px-2 ">
  

    {Object.keys(userData.user).length > 0 ? (
     <div className="flex w-7/12 items-center justify-start">
       <div className="flex  items-center justify-start flex-col-reverse w-full px-2">
      <span className="text-white font-mono  text-xs lg:text-md">{userData.user.displayName}</span>

      <img src={userData.user?.photoURL}  className="rounded-full h-[30px] w-[30px] lg:h-11 lg:w-11" />
    </div>
      <button
        className="bg-black text-white font-mono ml-6 p-2 px-6 rounded-xl"
        onClick={async () => {
          await signOut(auth);
          userData.setUser(false);
          router.push("/404");
        }}
      >
        Logout
      </button>
      <div className="flex items-center justify-center gap-2 lg:gap-4 px-4 text-white" onClick={() => setState(!state)}>
    <ChatBubbleTwoTone />
    {/* <h1 className="text-white font-bold text-lg">Your Chats</h1> */}
  </div>
     </div>
    ) : (
      <button className="bg-white text-black flex items-center font-mono h-16 w-5/12 px-2 rounded-lg mx-6 my-auto lg:mx-0" onClick={login}>
       <h1 className="hidden md:block text-xs">
       Sign in With Google
        </h1> <Google size={10} />
      </button>
    )}
    
  </div>

 

  <div className="flex items-center justify-between px-6 w-full lg:w-1/6">
    {/* <div className="text-white font-mono text-lg">first draft 1.0()</div> */}

    <div className="flex items-center justify-center">
      {premium?.premium === false && <PaymentButton />}

      {premium?.premium === true ? (
        <Chip label="pro" color="warning" size="medium" />
      ) : (
        <Chip label="basic" color="primary" size="medium" />
      )}

      <div className="text-white font-medium text-sm px-4">
        {premium?.premium === true ? (
          `remaining ${200 - premium.count}`
        ) : (
          <div className="">
            <p className=" text-[10px] text-xs flex-col items-center flex justify-center"><h1>remaining</h1> <h2> {10 - premium.count}</h2></p>
          </div>
        )}
      </div>
      <div className="w-24 h-24 lg:w-36 lg:h-36 object-contain"><Logo/></div>
    </div>
  </div>
</div>

        <div className="grid grid-cols-12 w-screen gap-x-0 lg:gap-x-0">

          <div className="py-20 col-span-12  h-80 lg:col-span-3 pt-6 flex  lg:h-screen items-center flex-col justify-start gap-y-4 bg-slate-200  ">
          <Pagination
          count={7}
          page={pageSerach-1}
          onChange={handlePageChange}
          variant="outlined"
          shape="rounded"
        />
 <div className="w-full pt-36 flex flex-row justify-around lg:flex-col gap-10 items-center overflow-x-scroll">
            {jobs.map((job)=>{return(
             <div
             key={job.Job_Title}
             className="bg-white px-4 py-2 h-40 lg:h-auto lg:w-10/12   flex flex-col items-start justify-start  rounded-lg shadow-md cursor-pointer transition duration-300 transform hover:scale-105"
             onClick={() => {}}
           >
             <img
               src={job.Logo_URL}
               alt={job.Job_Title}
               className="w-16 h-16 mx-auto mb-4"
             />
             <h3 className="text-xs lg:text-lg font-semibold mb-2">{job.Job_Title}</h3>
             <p className="text-gray-600 text-xs lg:text-md">{job.Company_Name}</p>
             <p className="text-gray-500 text-[5px] lg:text-lg">{job.Location}</p>
           </div>


            )})}
            {/* <div className="h-24"></div> */}


          </div>

          </div>

         

                <div className="col-span-8 flex flex-col items-center justify-start mt-9 gap-4 mx-6">
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
      </div>

      <JobDescription job={selectedJob} jobModal={jobModal} setJobModal={setJobModal}/>
      <TemporaryDrawer data={chat} state={state} setState={setState} />
    </div>
  );
}
