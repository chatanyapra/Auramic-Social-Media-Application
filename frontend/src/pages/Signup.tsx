import logo from "../assets/auramicimage.png";
import { Link } from 'react-router-dom';
import { FormEvent, useState, ChangeEvent } from "react";
import "./Signup.css"
import useSignup from "../hooks/useSignup";

const Signup: React.FC = () => {
  const [inputs, setInputs] = useState({
    fullname: "",
    username: "",
    password: "",
    confirmPassword: "",
    gender: ""
  })
  const { signup} = useSignup();
  const handleSubmit = async(event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await signup(inputs);
  }
  // const handleGenderChange = (event: ChangeEvent<HTMLInputElement>) => {
  //   const { value } = event.target;
  //   setInputs({
  //     ...inputs,
  //     gender: value
  //   });
  // };
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
            <small className='text-sm font-semibold'>If you haven’t Logged in yet. <Link to={"/login"} className='text-blue-700'>Login here!</Link></small>
          </div>
          <div className='mt-10'>
            <form onSubmit={handleSubmit} className="space-y-7 text-sm text-black font-medium dark:text-white" uk-scrollspy="target: > *; cls: uk-animation-scale-up; delay: 100 ;repeat: true">

              <div className="flex flex-col">

                {/* <!-- full name --> */}
                <div className="mb-5">
                  <label htmlFor="fullname" className="">Full name</label>
                  <div className="mt-2.5">
                    <input id="fullname" name="fullname" type="text" placeholder="Full name" className="w-full !rounded-lg !bg-transparent shadow-md py-2 pl-3 border !border-slate-200 dark:!border-slate-800 dark:!bg-white/5"
                      value={inputs.fullname}
                      onChange={(e :ChangeEvent<HTMLInputElement>) => setInputs({ ...inputs, fullname: e.target.value })}
                    />
                  </div>
                </div>

                {/* <!-- username --> */}
                <div className="mb-5">
                  <label htmlFor="username" className="">Username</label>
                  <div className="mt-2.5">
                    <input id="username" name="text" type="username" placeholder="Username" className="w-full !rounded-lg !bg-transparent shadow-md py-2 pl-3 border !border-slate-200 dark:!border-slate-800 dark:!bg-white/5"
                      value={inputs.username}
                      onChange={(e:ChangeEvent<HTMLInputElement>) => setInputs({ ...inputs, username: e.target.value })}
                    />
                  </div>
                </div>


                {/* <!-- password --> */}
                <div className="mb-5">
                  <label htmlFor="password" className="">Password</label>
                  <div className="mt-2.5">
                    <input id="password" name="password" type="password" placeholder="***" className="!w-full !rounded-lg !bg-transparent shadow-md py-2 pl-3 border !border-slate-200 dark:!border-slate-800 dark:!bg-white/5"
                      value={inputs.password}
                      onChange={(e:ChangeEvent<HTMLInputElement>) => setInputs({ ...inputs, password: e.target.value })}
                    />
                  </div>
                </div>

                {/* <!-- Confirm Password --> */}
                <div className="mb-5">
                  <label htmlFor="confirmpassword" className="">Confirm Password</label>
                  <div className="mt-2.5">
                    <input id="confirmpassword" name="confirmpassword" type="password" placeholder="***" className="!w-full !rounded-lg !bg-transparent shadow-md py-2 pl-3 border !border-slate-200 dark:!border-slate-800 dark:!bg-white/5"
                      value={inputs.confirmPassword}
                      onChange={(e:ChangeEvent<HTMLInputElement>) => setInputs({ ...inputs, confirmPassword: e.target.value })}
                    />
                  </div>
                </div>

                {/* <div className="mb-5">
                  <div className="radio-input-wrapper">
                    <label className="checkboxlabel">
                      <input value="male" name="value-radio" id="value-2" className="radio-input" type="radio"
                        checked={inputs.gender === "male"} 
                        onChange={handleGenderChange} 
                      />
                      <div className="radio-design"></div>
                      <div className="label-text">Male</div>
                    </label>

                    <label className="checkboxlabel">
                      <input value="female" name="value-radio" id="value-3" className="radio-input" type="radio" 
                        checked={inputs.gender === "female"} 
                        onChange={handleGenderChange} 
                      />
                      <div className="radio-design"></div>
                      <div className="label-text">Female</div>
                    </label>

                    <label className="checkboxlabel">
                      <input value="others" name="value-radio" id="value-4" className="radio-input" type="radio" 
                        checked={inputs.gender === "others"} 
                        onChange={handleGenderChange} 
                      />
                      <div className="radio-design"></div>
                      <div className="label-text">Others</div>
                    </label>
                  </div>
                </div> */}


                {/* <!-- submit button --> */}
                <div className="col-span-2">
                  <button type="submit" className="button bg-blue-700 py-2 rounded text-white w-full">Get Started</button>
                </div>

              </div>


              {/* <!-- social login --> */}


            </form>
          </div>
        </div>
      </div>
      {/* section 2--- */}
      <div className='md:flex hidden w-7/12 ' style={{ background: "url('//picsum.photos/1920/1080') center/cover fixed no-repeat #00000099" }}>
      </div>
    </div>
  );
};

export default Signup;
