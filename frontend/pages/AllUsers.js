import React, { useEffect, useState } from 'react';
import SummaryApi from '../common';
import { toast } from 'react-toastify';
import moment from 'moment';
import { MdModeEdit, MdOutlineDeleteForever } from 'react-icons/md';
import ChangeUserRole from '../components/ChangeUserRole';

const AllUsers = () => {
    const [allUser, setAllUsers] = useState([]);
    const [openUpdateRole, setOpenUpdateRole] = useState(false);
    const [updateUserDetails, setUpdateUserDetails] = useState({
        email: "",
        name: "",
        role: "",
        _id: ""
    });

    const fetchAllUsers = async () => {
        const fetchData = await fetch(SummaryApi.allUser.url, {
            method: SummaryApi.allUser.method,
            credentials: 'include'
        });

        const dataResponse = await fetchData.json();

        if (dataResponse.success) {
            setAllUsers(dataResponse.data);
        }

        if (dataResponse.error) {
            toast.error(dataResponse.message);
        }
        console.log(dataResponse);
    };

    useEffect(() => {
        fetchAllUsers();
    }, []);

    const deleteUser = async (userId, userEmail) => {
        const confirmDelete = window.confirm(`Are you sure you want to delete the user with email: ${userEmail}?`);
        if (confirmDelete) {
            const response = await fetch(SummaryApi.deleteUser.url, {
                method: SummaryApi.deleteUser.method,
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userId })
            });

            const responseData = await response.json();

            if (responseData.success) {
                toast.success(responseData.message);
                setAllUsers(allUser.filter(user => user._id !== userId));
            } else {
                toast.error(responseData.message);
            }
        }
    };

    return (
        <div className='bg-white pb-4'>
            <table className='w-full userTable '>
                <thead>
                    <tr className='bg-black text-white'>
                        <th>Sr.</th>
                        <th>Name</th>
                        <th style={{ width: '350px' }}>Email</th>
                        <th>Role</th>
                        <th>Created Date</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody className=''>
                    {allUser.map((el, index) => {
                        return (
                            <tr key={el._id}>
                                <td style={{ height: '50px' }}>{index + 1}</td>
                                <td>{el?.name}</td>
                                <td>{el?.email}</td>
                                <td>{el?.role}</td>
                                <td>{moment(el?.createdAt).format('LL')}</td>
                                <td>
                                    <button className='bg-green-100 p-2 rounded-full cursor-pointer hover:bg-green-500 hover:text-white mr-10'
                                        onClick={() => {
                                            setUpdateUserDetails(el);
                                            setOpenUpdateRole(true);
                                        }}>
                                        <MdModeEdit />
                                    </button>
                                    <button className='bg-red-100 p-2 rounded-full cursor-pointer hover:bg-red-500 hover:text-white'
                                        onClick={() => deleteUser(el._id, el.email)}>
                                        <MdOutlineDeleteForever />
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            {openUpdateRole && (
                <ChangeUserRole
                    onClose={() => setOpenUpdateRole(false)}
                    name={updateUserDetails.name}
                    email={updateUserDetails.email}
                    role={updateUserDetails.role}
                    userId={updateUserDetails._id}
                    callFunc={fetchAllUsers}
                />
            )}
        </div>
    );
};

export default AllUsers;
