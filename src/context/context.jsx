import { createContext, useEffect, useState } from "react";
import runChat from "../config/geminiai";

export const Context = createContext();

const ContextProvider = (props) => {

    const [input,setInput] = useState("");
    const [recentPrompt,setRecentPrompt] = useState("");
    const [prevPrompts,setPrevPrompts] = useState([]);
    const [showResult,setShowResult] = useState(false);
    const [loading,setLoading] = useState(false);
    const [resultData,setresultData] = useState("");

    const delayPara = async (index,nextWord) => {
        setTimeout(function(){
            setresultData(prev=>prev+nextWord)
        },75*index)
    }

    const newChat = ()=>{
        setLoading(false)
        setShowResult(false)
    }

    const onSent = async (prompt) =>{
        setresultData("")
        setLoading(true)
        setShowResult(true)
        let response = ""
        if(prompt !== undefined){
            response = await runChat(prompt);
            setRecentPrompt(prompt)
        }else if(input){
            setPrevPrompts(prev=>[...prev,input])
            setRecentPrompt(input)
            response = await runChat(input)
        }
        if(input || prompt){
           let responseArray = response.split("**");
           let newResponse = "";
           for(let i = 0; i<responseArray.length; i++){
               if(i===0 || i%2 !== 1){
                   newResponse += responseArray[i];
                }else{
                    newResponse += "<b>" + responseArray[i] + "</b>";
                }
            }
           let newResponse2 = newResponse.split("*").join("</br>")
           let newResponseArray = newResponse2.split(" ");
           for(let i= 0;i<newResponseArray.length;i++){
            const nextWord = newResponseArray[i];
            delayPara(i,nextWord + " ")
           }

           setresultData(newResponse2)
           setLoading(false)
           setInput("")
        } 
    }


    const contextValue = {
        prevPrompts,
        setPrevPrompts,
        onSent,
        setRecentPrompt,
        recentPrompt,
        showResult,
        loading,
        resultData,
        input,
        setInput,
        setLoading,
        setShowResult,
        setresultData,
        newChat
    }

    return (
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    )
}

export default ContextProvider;