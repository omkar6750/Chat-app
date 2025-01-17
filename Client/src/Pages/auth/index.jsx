import Background from '@/assets/rb_5172.png'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import {Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { apiClient } from '@/lib/api-client'
import { LOGIN_ROUTE, SIGNUP_ROUTE } from '@/Utils/constants'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '@/store'


const auth = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const { setUserInfo } = useAppStore();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState(""); 

    
    const validateLogin = () => {
        if(!email.length){
            toast.error("Email is Required.");
            return false;
        }
        if(!password.length){
            toast.error("Password is Required.");
            return false;
        }
        
        return true;
    }

    const validateSignUp = () => {
        if(!email.length){
            toast.error("Email is Required.");
            return false;
        }
        if(!password.length){
            toast.error("Password is Required.");
            return false;
        }
        if(password !== confirmPassword){
            toast.error("Password and confirm password should be same.")
            return false;
        }
        return true;
    };

    const handleError = (data) => {
        
        switch (data) {
            case "email-password-required":
                toast.error("Email and Password are required.");
                break;
            case "password-too-short":
                toast.error("Password is too short.");
                break;
            case "password-missing-letter":
                toast.error("Password must contain at least one letter.");
                break;
            case "password-missing-digit":
                toast.error("Password must contain at least one digit.");
                break;
            case "password-missing-special-character":
                toast.error("Password must contain at least one special character (@, $, !, %, *, ?, &).");
                break;
            case "password-invalid-characters":
                toast.error("Password contains invalid characters. Only letters, digits, and specific special characters are allowed.");
                break;
            case "email-invalid":
                toast.error("Email is invalid.");
                break;
            case "email-listed":
                toast.error("Email is already registered.");
                break;
            case "internal-server-error":
                toast.error("An unexpected error occurred. Please try again later.");
                break;
            case "user-not-found":
                toast.error("User not found.");
                break;
            case "password-incorrect":
                toast.error("Password is incorrect.");
                break;
            default:
                toast.error("An unknown error occurred.");
        }
    }

    const handeleLogin = async() => {
        try {
            if(validateLogin()) {
                const response = await apiClient.post(
                    LOGIN_ROUTE,
                    {email, password},
                    {withCredentials:true}
                );
                if(response.data.user.id){
                    setUserInfo(response.data.user);
                    if(response.data.profileSetup){
                        navigate("/chat");
                        console.log("navigate to chat ");
                    }else { 
                        navigate("/profile");
                        console.log("navigate to profile ");}
                };
            }
        } catch (error) {
            handleError(error.response.data.error);
        }
        
    };
    const handleSignUp = async() => {
        if(validateSignUp()){
            try {
                const response = await apiClient.post(SIGNUP_ROUTE, { email, password }, {withCredentials:true});
                if(response.status === 201){
                    setUserInfo(response.data.user);
                    navigate("/profile");
                }
            } catch (error) {
                console.log("error", error.response.data.error);
                handleError(error.response.data.error);
            }
            
            
        }
    };
    
    return(
        <div className=' relative flex justify-center items-center'>
            <img src={Background} alt="" className='h-[100vh] w-[100vw]  z-10' />
            <div className="h-[80vh] w-[80vw] flex items-center justify-center absolute z-20">
                <div className="flex justify-center h-[80vh] bg-white/70 border-2 text-opacity-90 shadow-2xl w-[80vw] md:w-[90vw] lg:w-[70vw] xl:w-[60vw] rounded-3xl xl:grid-cols-2">
                    <div className="flex lg:gap-24 md:gap-12 sm:gap-5 items-center">
                        <div className="flex items-center justify-center flex-col ">
                            <div className="flex items-center justify-center">
                                <div>
                                    <Logo></Logo>
                                    <h1 className="xl:text-8xl font-bold lg:text-7xl sm:text-6xl  ">Welcome</h1>
                                </div>
                            </div>
                            <p className='font-medium pt-7 text-lg text-center '> Fill in the details to get started</p>
                        </div>
                        <div className='flex items-center justify-center w-full'>
                            <Tabs className='w-56' defaultValue='login'>
                                <TabsList className='bg-transparent w-full rounded-none'>
                                    <TabsTrigger className='date-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 duration-300 transition-all' value='login'>Login</TabsTrigger>
                                    <TabsTrigger className='date-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 duration-300 transition-all'  value='signup'>SignUp</TabsTrigger>
                                </TabsList>
                                <TabsContent className='flex flex-col gap-5 mt-10' value="login">
                                    <Input placeholder="Email" type="email" className='rounded-full p-6' value={email} onChange={(e) => setEmail(e.target.value)}
                                    />
                                    <Input placeholder="Password" type="password" className='rounded-full p-6' value={password} onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <Button className='rounded-full p-6'
                                     onClick={() => {handeleLogin()}}>Login</Button>
                                </TabsContent>
                                <TabsContent className='flex flex-col gap-5 ' value="signup">
                                <Input placeholder="Email" type="email" className='rounded-full p-6' value={email} onChange={(e) => setEmail(e.target.value)}
                                />
                                <Input placeholder="Password" type="password" className='rounded-full p-6' value={password} onChange={(e) => setPassword(e.target.value)} />
                                <Input placeholder="Confirm Password" type="password" className='rounded-full p-6' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                                <Button className='rounded-full p-6'
                                     onClick={() => {handleSignUp()}}>SignUp</Button>
                                </TabsContent>
                            </Tabs>
                        </div>
                    </div>
            
                </div>
            </div>
        </div>
    )
}

const Logo = () => {
    return (
      <div className="flex pl-10 p-5  justify-start items-center gap-2 ">
        {/* <svg
          id="logo-38"
          width="78"
          height="32"
          viewBox="0 0 78 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {" "}
          <path
            d="M55.5 0H77.5L58.5 32H36.5L55.5 0Z"
            className="ccustom"
            fill="#8338ec"
          ></path>{" "}
          <path
            d="M35.5 0H51.5L32.5 32H16.5L35.5 0Z"
            className="ccompli1"
            fill="#975aed"
          ></path>{" "}
          <path
            d="M19.5 0H31.5L12.5 32H0.5L19.5 0Z"
            className="ccompli2"
            fill="#a16ee8"
          ></path>{" "}
        </svg> */}
        
        
  
        
        {/* <?xml version="1.0" encoding="UTF-8"?> */} 
        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 210 200" width="50" height="50">
        <path d="M0 0 C1.90120605 0.01244751 1.90120605 0.01244751 3.84082031 0.02514648 C13.62723993 0.2009317 22.4529923 1.20054247 31.6875 4.4375 C32.38198242 4.67355957 33.07646484 4.90961914 33.79199219 5.15283203 C59.25543518 14.0438271 80.31292184 32.29835276 92.05395508 56.6159668 C99.75269566 73.13330119 99.75269566 73.13330119 98.6875 80.4375 C97.13208209 82.49057168 96.23897237 83.32861254 93.68997192 83.83190918 C92.93005951 83.84032837 92.17014709 83.84874756 91.38720703 83.85742188 C90.522659 83.87333374 89.65811096 83.88924561 88.7673645 83.90563965 C87.83608734 83.90584106 86.90481018 83.90604248 85.9453125 83.90625 C84.50452835 83.91767029 84.50452835 83.91767029 83.03463745 83.92932129 C81.00212198 83.94012914 78.96955095 83.94297262 76.93701172 83.93847656 C73.83075923 83.93750571 70.72698848 83.97908869 67.62109375 84.0234375 C65.64583848 84.02864561 63.67057463 84.03133268 61.6953125 84.03125 C60.7680838 84.04764526 59.8408551 84.06404053 58.88552856 84.08093262 C54.33507107 84.03230908 52.34326226 83.95320734 48.66625977 81.06152344 C46.74091541 78.50833391 45.08029319 75.96621605 43.5 73.1875 C35.65884171 60.65850945 23.93375532 53.81201493 9.6875 50.4375 C-7.18466436 48.61419482 -21.70147379 52.7404379 -35.3359375 62.953125 C-44.79821941 71.43064454 -50.79903748 84.94673607 -51.62109375 97.44140625 C-52.2896539 113.60740986 -47.36938338 127.54577142 -36.3515625 139.55859375 C-24.7375836 150.26036358 -11.12612103 153.979932 4.25390625 153.71484375 C17.0593527 153.16215001 28.44853846 146.97274442 37.8125 138.49609375 C40.69534498 135.3309702 42.81412809 131.78393572 44.94921875 128.0859375 C49.69199183 120.85986975 49.69199183 120.85986975 53.81504822 119.98718262 C56.45496275 119.82536147 59.05097914 119.82320267 61.6953125 119.87890625 C63.13896683 119.88240334 63.13896683 119.88240334 64.61178589 119.88597107 C66.64085792 119.89569368 68.66990339 119.91744647 70.69873047 119.95043945 C73.80867557 119.99993913 76.91703986 120.0119266 80.02734375 120.01757812 C82.00001688 120.03166107 83.97267625 120.04786438 85.9453125 120.06640625 C86.87658966 120.07176895 87.80786682 120.07713165 88.7673645 120.08265686 C89.63191254 120.09864426 90.49646057 120.11463165 91.38720703 120.13110352 C92.52707565 120.14706322 92.52707565 120.14706322 93.68997192 120.16334534 C95.6875 120.4375 95.6875 120.4375 98.6875 122.4375 C99.21738489 128.13223991 98.35114561 132.67687366 96.25 138 C95.98340576 138.68618408 95.71681152 139.37236816 95.44213867 140.0793457 C85.24847881 165.22793125 65.33271888 185.52068414 40.4609375 196.36328125 C27.44031108 201.60276153 14.40971668 203.99382639 0.375 203.875 C-1.52403076 203.86364014 -1.52403076 203.86364014 -3.46142578 203.85205078 C-13.2819168 203.67989374 -22.02299865 202.57968117 -31.3125 199.4375 C-32.26503662 199.12401611 -32.26503662 199.12401611 -33.23681641 198.80419922 C-59.33185068 190.03137858 -79.73224178 170.61163331 -92.3125 146.4375 C-98.9749347 132.36774228 -101.88151523 117.65840947 -101.75 102.125 C-101.74242676 100.85897949 -101.73485352 99.59295898 -101.72705078 98.28857422 C-101.55489374 88.4680832 -100.45468117 79.72700135 -97.3125 70.4375 C-96.99901611 69.48496338 -96.99901611 69.48496338 -96.67919922 68.51318359 C-87.90637858 42.41814932 -68.48663331 22.01775822 -44.3125 9.4375 C-30.24319253 2.77527851 -15.53306468 -0.13253824 0 0 Z " fill="#D149FF" transform="translate(101.3125,-0.4375)"/>
        <path d="M0 0 C5.25123646 4.03548327 8.71276692 8.43740993 10 15 C11.00276079 23.46079419 9.68433834 30.20569644 4.45703125 37.0078125 C-0.20797471 42.11049636 -4.79517045 44.50164983 -11.63671875 45.3125 C-19.40329883 45.65912561 -25.44025985 44.23445355 -31.265625 38.94140625 C-37.51129996 32.28010184 -39.53527429 26.91289077 -39.30078125 17.8046875 C-38.42592527 9.64693949 -34.4592408 4.69338169 -28.21875 -0.40234375 C-19.85405407 -6.42551388 -8.44492219 -5.40156344 0 0 Z " fill="#D044FF" transform="translate(116,81)"/>
        </svg>
  
        <span className="text-4xl font-bold text-slate-700 ">Circl.</span>
      </div>
    );
  };
  

export default auth;