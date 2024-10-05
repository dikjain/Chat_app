import { Box } from "@chakra-ui/layout";
// import { useEffect, useState } from "react";
import { useEffect, useState } from "react";
import Chatbox from "../Chatbox";
import MyChats from "../components/MyChats";
import SideDrawer from "../SideDrawer";
import { ChatState } from "../Context/Chatprovider";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";




const Chatpage = () => {
  const [show, setShow] = useState(false)
  let tl = gsap.timeline();
  useEffect(()=>{
    tl.from("#lio", {opacity:0, y:"50px",duration:0.5, ease:"power2.inOut"});
    tl.to("#lio", { x:0,duration:0.5, ease:"power2.inOut"}); 
    tl.to("#lline", {opacity:1,duration:0.5, ease:"power2.inOut"});
    tl.to("#lline", {width:"30%",x:"90px",duration:0.5, ease:"power2.inOut"},"a");
    tl.to("#lline", {y:"-40%",duration:0.5, ease:"power2.inOut"});
    gsap.from("#basic", {opacity:0, duration:0.5, ease:"power2.inOut"});
    gsap.from("#not", {opacity:0,duration:0.5, ease:"power2.inOut"});
    tl.to("#not", {left:0,duration:0.5, ease:"power2.inOut"},"a");
    tl.to("#anim", {y:"-100%",duration:0.7, ease:"power2.inOut"});

  },[])
  const [fetchAgain, setFetchAgain] = useState(false);

  setTimeout(()=>{
    setShow(true)
  },2700)
  
  const { user } = ChatState();

  return (
    <div style={{ width: "100%" , overflow:"hidden"}}>
      <div id="anim"  style={{width:"100%", display:"flex",alignItems:"center",justifyContent:"center",height:"100%", backgroundColor:"black" , position:"absolute",top:0, zIndex:"10000"}}><span id="lio" style={{fontFamily:"Atomic Age, sans-serif",transform:"translateX(-50px)",overflow:"hidden",fontSize:"30px",color:"white"}}><span id="lline" style={{opacity:0,borderBottom:"2px solid white" , width:"100%",position:"absolute",top:0, zIndex:"10000",height:"100%"}}></span><span id="not" style={{color:"#48bb78", left:"-80px",position:"relative"}}>NOT </span>A <span id="basic" style={{color:"#48bb78"}}>Basic</span> Chat APP</span></div>
      {user&& show && <SideDrawer />}
      <Box display="flex" justifyContent="space-between" w="100%" h="91.5vh" p="10px">
        {user&&show && <MyChats fetchAgain={fetchAgain} />}
        {user && show && (
          <Chatbox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </Box>
    </div>
  );
};

export default Chatpage;