import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { v4 as uuidv4 } from "uuid"; // Для генерации уникальных ID

const App = () => {
    const [users, setUsers] = useState([]);
    const [modalMessage, setModalMessage] = useState("");
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();

    const API_URL = "http://localhost:3001/users";

    // Получение списка пользователей
    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get(API_URL);
            setUsers(response.data);
        } catch (error) {
            console.error("Ошибка при получении пользователей:", error);
        }
    };



    const onSubmit = async (data) => {
        try {
            const newUser = { ...data, id: uuidv4() }; // Генерация уникального id
            const response = await axios.post(API_URL, newUser);
            setUsers([...users, response.data]);
            setModalMessage("Пользователь успешно создан");
            reset();
        } catch (error) {
            console.error("Ошибка при создании пользователя:", error);
        }
    };



    const deleteUser = async (id) => {
        try {
            await axios.delete(`${API_URL}/${id}`);
            setUsers(users.filter((user) => user.id !== id));
            setModalMessage("Пользователь удален");
        } catch (error) {
            console.error("Ошибка при удалении пользователя:", error);
        }
    };

    return (
        <div>
            <h1>Управление пользователями</h1>



            <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <label>Имя:</label>
                    <input {...register("name", { required: "Имя обязательно" })} />
                    {errors.name && <p>{errors.name.message}</p>}
                </div>
                <div>
                    <label>Email:</label>
                    <input
                        {...register("email", {
                            required: "Email обязателен",
                            pattern: {
                                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                                message: "Неверный формат email",
                            },
                        })}
                    />
                    {errors.email && <p>{errors.email.message}</p>}
                </div>
                <div>
                    <label>Username:</label>
                    <input {...register("username", { required: "Username обязателен" })} />
                    {errors.username && <p>{errors.username.message}</p>}
                </div>
                <button type="submit">Создать пользователя</button>
            </form>



            {users.length > 0 ? (
                <table>
                    <thead>
                    <tr>
                        <th>Имя</th>
                        <th>Email</th>
                        <th>Username</th>
                        <th>Действия</th>
                    </tr>
                    </thead>
                    <tbody>
                    {users.map((user) => (
                        <tr key={user.id}>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.username}</td>
                            <td>
                                <button onClick={() => deleteUser(user.id)}>Удалить</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            ) : (
                <p>Список пуст</p>
            )}



            {modalMessage && (
                <div className="modal">
                    <p>{modalMessage}</p>
                    <button onClick={() => setModalMessage("")}>Закрыть</button>
                </div>
            )}
        </div>
    );
};

export default App;