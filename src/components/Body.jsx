import React from 'react'
import { useRef, useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';
import 'react-toastify/dist/ReactToastify.css';


const body = () => {
    const ref = useRef()
    const passwordRef = useRef()
    const [form, setform] = useState({ site: "", username: "", password: "" })
    const [passwordArray, setPasswordArray] = useState([])

    const getPasswords = async () => {
        let req = await fetch("http://localhost:3000/")
        let passwords = await req.json()
        setPasswordArray(passwords)
    }


    useEffect(() => {
        getPasswords()
    }, [])
    
    const showPassword = () => {
        if (ref.current.src.includes("/eye.svg")) {
            ref.current.src = "/eye_cross.svg";
            passwordRef.current.type = "text";
        } else {
            ref.current.src = "/eye.svg";
            passwordRef.current.type = "password";
        }
    };

    const savePassword = async () => {

    if (form.site.length > 3 && form.username.length > 3 && form.password.length > 3) {

        // Delete only while editing
        if (form.id) {
            await fetch("http://localhost:3000/", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: form.id })
            })
        }

        const newPassword = { ...form, id: uuidv4() }

        setPasswordArray([...passwordArray, newPassword])

        await fetch("http://localhost:3000/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newPassword)
        })

        setform({ site: "", username: "", password: "" })

        toast.success("Password saved!")
    }
    else {
        toast("Error: Password not saved!")
    }
}

    const copyText = (text) => {
        toast.success("Copied to Clipboard", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",

        });
        navigator.clipboard.writeText(text)
    }

    const deletePassword = async (id) => {
        console.log("Deleting password with id ", id)
        let c = confirm("Do you really want to delete this password?")
        if (c) {
            setPasswordArray(passwordArray.filter(item => item.id !== id))

            await fetch("http://localhost:3000/", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) })

            toast.success('Password Deleted!', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        }

    }
    const editPassword = (id) => {
        setform({ ...passwordArray.filter(i => i.id === id)[0], id: id })
        setPasswordArray(passwordArray.filter(item => item.id !== id))
    }

    const handleChange = (e) => {
        setform({ ...form, [e.target.name]: e.target.value })
    }

    return (
        <>
            <ToastContainer />
            <div className="absolute inset-0 -z-10 h-full w-full bg-blue-50 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"><div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-blue-400 opacity-20 blur-[100px]"></div></div>
            <div></div>
            <div className="logo font-bold text-black text-3xl my-10 text-center">
                <span className='text-blue-400'> &lt;</span>
                <span>Pass</span><span className='text-blue-400'>OP/&gt;</span>

            </div>
            <h2 className=' text-center -my-8 mx-8'>Your own password manager</h2>
            <div >
                <input value={form.site} onChange={handleChange} name="site" id="site" className='my-10 rounded-full border border-blue-500 w-[70%] mx-[17%] p-4 py-1' type="text" placeholder='Enter webiste URL' />
                <div className='flex gap-8 mx-[17%]'>
                    <input value={form.username} name="username" id="username" onChange={handleChange} className=' rounded-full border border-blue-500 w-full p-4 py-1' type="text" placeholder='Enter username' />
                    <input value={form.password} ref={passwordRef} onChange={handleChange} className=' rounded-full gap-6 border border-blue-500 w-[25%]  p-4 py-1' type="password" name="password" id="password" placeholder='Enter password' />
                    <span className=' w-10 width={26} invert -mx-18 my-1.5' onClick={showPassword}>
                        <img ref={ref} src="/eye.svg" alt="eye" />
                    </span>
                </div>
                <div>


                    <button onClick={savePassword} className='flex items-center gap-2 border border-black rounded-full px-4 py-2 bg-blue-400 mx-auto my-6 hover:bg-blue-300'>

                        <lord-icon
                            src="https://cdn.lordicon.com/vjgknpfx.json"
                            trigger="hover"
                            state="hover-swirl"
                            colors="primary:#121331,secondary:#000000"
                            style={{ "width": "35px", "height": "35px" }}>

                        </lord-icon>
                        <span>Add Password</span>
                    </button>
                </div>
                <div>
                    <h2 className='font-bold text-2xl py-2 mx-[17%]'>Your Passwords</h2>
                    <table className="table-auto w-[65%] mx-auto rounded-md overflow-hidden mb-10">
                        <thead className='bg-blue-800 text-white'>
                            <tr>
                                <th className='py-2'>Site</th>
                                <th className='py-2'>Username</th>
                                <th className='py-2'>Password</th>
                                <th className='py-2'>Actions</th>
                            </tr>
                        </thead>
                        <tbody className='bg-blue-100'>
                            {passwordArray.map((item, index) => {
                                return <tr key={index}>

                                    <td className='py-2 border border-white text-center'>
                                        <div className='flex items-center justify-center '>
                                            <a href={item.site} target='_blank'>{item.site}</a>
                                            <div className='lordiconcopy size-7 cursor-pointer' onClick={() => { copyText(item.site) }} >
                                                <lord-icon
                                                    style={{ "width": "25px", "height": "25px", "paddingTop": "3px", "paddingLeft": "3px" }}
                                                    src="https://cdn.lordicon.com/iykgtsbt.json"
                                                    trigger="hover" >
                                                </lord-icon>
                                            </div>
                                        </div>
                                    </td>
                                    <td className='py-2 border border-white text-center'>
                                        <div className='flex items-center justify-center '>
                                            <span>{item.username}</span>
                                            <div className='lordiconcopy size-7 cursor-pointer' onClick={() => { copyText(item.username) }} >
                                                <lord-icon
                                                    style={{ "width": "25px", "height": "25px", "paddingTop": "3px", "paddingLeft": "3px" }}
                                                    src="https://cdn.lordicon.com/iykgtsbt.json"
                                                    trigger="hover" >
                                                </lord-icon>
                                            </div>
                                        </div>
                                    </td>
                                    <td className='py-2 border border-white text-center'>
                                        <div className='flex items-center justify-center ' onClick={() => { copyText(item.password) }}>
                                            <span>{"*".repeat(item.password.length)}</span>
                                            <div className='lordiconcopy size-7 cursor-pointer' >
                                                <lord-icon
                                                    style={{ "width": "25px", "height": "25px", "paddingTop": "3px", "paddingLeft": "3px" }}
                                                    src="https://cdn.lordicon.com/iykgtsbt.json"
                                                    trigger="hover" >
                                                </lord-icon>
                                            </div>
                                        </div>
                                    </td>
                                    <td className='justify-center py-2 border border-white text-center'>
                                        <span className='cursor-pointer mx-1' onClick={() => { editPassword(item.id) }}>
                                            <lord-icon
                                                src="https://cdn.lordicon.com/gwlusjdu.json"
                                                trigger="hover"
                                                style={{ "width": "25px", "height": "25px" }}>
                                            </lord-icon>
                                        </span>
                                        <span className='cursor-pointer mx-1' onClick={() => { deletePassword(item.id) }} >
                                            <lord-icon
                                                src="https://cdn.lordicon.com/skkahier.json"
                                                trigger="hover"
                                                style={{ "width": "25px", "height": "25px" }}>
                                            </lord-icon>
                                        </span>
                                    </td>
                                </tr>
                            })}
                        </tbody>
                    </table>


                </div>


            </div>



        </>
    )
}


export default body
