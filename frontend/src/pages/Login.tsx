import React, { useState, FormEvent } from 'react';
import logo from "../assets/auramicimage.png";
import { Link } from 'react-router-dom';
import useLogin from '../hooks/useLogin';
const Login: React.FC = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const {loading, login}= useLogin();
    const handleSubmit = async(event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        await login({username, password});
    }
    return (
        <div className='flex w-100vw h-screen bg-black m-0 p-0'>
            {/* section 1--- */}
            <div className='flex flex-col md:w-5/12 w-full h-full bg-white dark:bg-black'>
                <div className='mt-12 ml-14 bg-red-0 h-14 flex'>
                    <img src={logo} className='w-14 h-14' alt="" />
                    <h1 className='text-3xl font-extrabold font-sans pt-2 pl-1'>
                        Auramic
                    </h1>
                </div>
                <div className='flex flex-col w-4/5 mt-8 h-4/5 bg-red-0 m-auto'>
                    <div className=''>
                        <h1 className='text-2xl font-semibold'>Sign in to your account</h1>
                        <small className='text-sm font-semibold'>If you haven’t signed up yet. <Link to={"/signup"} className='text-blue-700'>Register here!</Link></small>
                    </div>
                    <div className='mt-10'>
                        <form onSubmit={handleSubmit} className="mx-10 space-y-7 text-sm text-black font-medium dark:text-white" uk-scrollspy="target: > *; cls: uk-animation-scale-up; delay: 100 ;repeat: true">

                            <div>
                                <label htmlFor="email" className="">Username / Email</label>
                                <div className="mt-2.5">
                                    <input id="username" name="username"  placeholder="Username / Email" className="!w-full !rounded-lg !bg-transparent shadow-md py-2 pl-3 border !border-slate-200 dark:!border-slate-800 dark:!bg-white/5" 
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    />
                                </div>
                            </div>
                            {/* <!-- password --> */}
                            <div>
                                <label htmlFor="email" className="">Password</label>
                                <div className="mt-2.5">
                                    <input id="password" name="password" type="password" placeholder="***" className="!w-full !rounded-lg !bg-transparent shadow-md py-2 pl-3 border !border-slate-200 dark:!border-slate-800 dark:!bg-white/5" 
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-between">

                                <div className="flex items-center gap-2.5">
                                    <input id="rememberme" name="rememberme" type="checkbox" />
                                    <label htmlFor="rememberme" className="font-normal">Remember me</label>
                                </div>
                                <a href="#" className="text-blue-700">Forgot password </a>
                            </div>

                            {/* <!-- submit button --> */}
                            <div>
                                <button type="submit" className="button bg-blue-700 py-2 rounded-md text-white w-full" disabled={loading}>
                                    {loading ? <div className="loader"></div> : "Login"}
                                </button>
                            </div>

                            <div className="text-center flex items-center gap-6">
                                <hr className="flex-1 border-slate-200 dark:border-slate-800" />
                                Or continue with
                                <hr className="flex-1 border-slate-200 dark:border-slate-800" />
                            </div>

                            {/* <!-- social login --> */}
                            <div className="flex border border-slate-200 shadow-md py-2 rounded-md bg-gray-200">
                                <a href="#" className=" button flex-1 text-center items-center gap-2 text-black text-sm"> Google  </a>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
            {/* section 2--- */}
            <div className='md:flex hidden w-7/12 ' style={{background: "url('//picsum.photos/1920/1080') center/cover fixed no-repeat #00000099"}}>
            </div>
        </div>
    );
};

export default Login;
