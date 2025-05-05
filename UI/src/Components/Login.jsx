import React from 'react'
import { WordRotate } from './magicui/word-rotate'
import GlobeBG from '../assets/Images/GlobeBG.png';
import AuthForm from './AuthForm';
import { Particles } from './magicui/particles';
const Login = () => {
  return (
    <div className='flex relative flex-row w-[100%] h-[100%] loginFluidContainer '>
      <div className='w-[50%] p-20 h-[100%] loginHeadlineContainer'>
        <h1 className='text-white orbitron-header text-[100px] loginHeading'>TowerLink</h1>
        <div className='flex flex-row  text-center  items-center'>
        <p className='italic opacity-[0.8] text-4xl px-3 font-bold headLineText text-black dark:text-[#F4F6FF] '>Send signals </p> <WordRotate className=" headLineText text-4xl  italic font-bold text-black dark:text-[#F4F6FF]  "
      words={["Securely📡", "wirelessly 🚀","to AI 🤖","Beyond 🛰"]}/>
        </div>
        <img className="absolute bottom-1 w-[60%]" src={GlobeBG} alt="Globe" />

      </div>
      <div className='w-[50%]'>
        
        <AuthForm />
      </div>
    </div>
  )
}

export default Login