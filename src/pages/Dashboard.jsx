import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TaskItem from "../components/TaskItem";
import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";
import axios from "axios";

const Dashboard = () => {

  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");

  const [loading, setLoading] = useState(false);
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [toast, setToast] = useState(null);

  const token = localStorage.getItem("token");
  const userName = localStorage.getItem("userName") || "You";


  // FETCH TASKS
  const fetchTasks = async () => {

    setLoadingTasks(true);

    try {

      const res = await axios.get("http://localhost:5000/tasks", {
        headers: { Authorization: `Bearer ${token}` }
      });

      setTasks(res.data.tasks);

    } catch (err) {

      console.log("Fetch tasks error:", err.response?.data);

    } finally {

      setLoadingTasks(false);

    }

  };


  useEffect(() => {
    fetchTasks();
  }, []);



  // AUTO HIDE TOAST
  useEffect(() => {

    if (toast) {

      const timer = setTimeout(() => setToast(null), 3000);

      return () => clearTimeout(timer);

    }

  }, [toast]);



  // ADD TASK
  const addTask = async () => {

    if (!title.trim() || !dueDate) {
      setToast("Please enter task name and due date");
      return;
    }

    if (loading) return;

    setLoading(true);

    try {

      await axios.post(
        "http://localhost:5000/tasks",
        {
          title: title.trim(),
          dueDate
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setTitle("");
      setDueDate("");

      await fetchTasks();

      setToast("Task created successfully");

    } catch (err) {

      console.error("Task creation error:", err);

      setToast(
        err.response?.data?.message ||
        "Failed to create task"
      );

    } finally {

      setLoading(false);

    }

  };



  // DELETE TASK
  const deleteTask = async (taskId) => {

    const originalTasks = [...tasks];

    setTasks(tasks.filter(task => task.taskId !== taskId));

    try {

      await axios.delete(
        `http://localhost:5000/tasks/${taskId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setToast("Task deleted");

    } catch (err) {

      console.log("Delete error:", err.response?.data);

      setTasks(originalTasks);

      setToast("Failed to delete task");

    }

  };



  // UPDATE STATUS
const updateTaskStatus = async (taskId) => {

  const task = tasks.find(t => t.taskId === taskId);

  // If already DONE, do nothing
  if (task?.status === "DONE") {
    setToast("Task already completed");
    return;
  }

  const updatedTasks = tasks.map(t =>
    t.taskId === taskId ? { ...t, status: "DONE" } : t
  );

  setTasks(updatedTasks);

  try {

    await axios.patch(
      `http://localhost:5000/tasks/${taskId}/status`,
      { status: "DONE" },
      { headers: { Authorization: `Bearer ${token}` } }
    );

  } catch (err) {

    console.log("Status update error:", err.response?.data);

  }

};


  // LOGOUT
  const handleLogout = async () => {

    try {

      await axios.post(
        "http://localhost:5000/auth/logout",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

    } catch (err) {

      console.log("Logout API error:", err.response?.data);

    }

    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");

    navigate("/login");

  };



  return (
    <div className="min-h-screen bg-white">


      {/* NAVBAR */}
      <header className="flex justify-between items-center px-6 py-4 bg-slate-900 text-white">

        <div className="flex items-center gap-2">
          <img src="/assets/logo.png" className="h-8" />
        </div>

        <ArrowRightOnRectangleIcon
          onClick={handleLogout}
          className="h-6 w-6 cursor-pointer hover:text-gray-300"
        />

      </header>



      {/* TASK INPUT BAR */}
      <div className="max-w-6xl mx-auto mt-6 px-4">

        <div className="bg-slate-900 rounded-lg px-6 py-5 flex flex-col md:flex-row md:items-end gap-4">

          {/* TASK NAME */}
          <div className="flex-1">

            <label className="text-sm text-[#e68c11] block mb-1">
              Task Name
            </label>

            <input
              className="w-full px-3 py-2 rounded bg-white focus:outline-none focus:ring-2 focus:ring-[#e68c11]"
              placeholder="What needs to be done?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && title && dueDate) addTask();
              }}
            />

          </div>


          {/* DUE DATE */}
          <div className="w-full md:w-56">

            <label className="text-sm text-[#e68c11] block mb-1">
              Due Date
            </label>

            <input
              type="date"
              className="w-full px-3 py-2 rounded bg-white focus:outline-none focus:ring-2 focus:ring-[#e68c11]"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && title && dueDate) addTask();
              }}
            />

          </div>


          {/* ADD BUTTON */}
          <button
            onClick={addTask}
            disabled={loading || !title || !dueDate}
            className={`px-6 py-2 rounded-md font-medium transition
            ${
              loading || !title || !dueDate
                ? "bg-[#e68c11]/50 cursor-not-allowed"
                : "bg-[#e68c11] hover:bg-[#d07b0e]"
            }`}
          >
            {loading ? "Adding..." : "+ Add"}
          </button>

        </div>

      </div>



      {/* TABLE HEADER */}
      <div className="max-w-6xl mx-auto mt-8 px-4 hidden md:grid grid-cols-12 text-sm text-gray-500 border-b pb-2">

        <div className="col-span-5">Task Name</div>
        <div className="col-span-3">Assign</div>
        <div className="col-span-2">Due Date</div>
        <div className="col-span-1">Status</div>
        <div className="col-span-1 text-right">Edit</div>

      </div>



      {/* TASK LIST */}
      <div className="max-w-6xl mx-auto px-4">

        {loadingTasks ? (

          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#e68c11]"></div>
          </div>

        ) : tasks.length === 0 ? (

          <div className="flex flex-col items-center py-16 text-gray-400">
            <p className="text-lg font-medium">No tasks yet</p>
            <p className="text-sm">Add one above to get started</p>
          </div>

        ) : (

          tasks.map((task) => (

            <TaskItem
              key={task.taskId}
              title={task.taskName}
              assign={task.assignedTo || userName}
              dueDate={new Date(task.dueDate).toLocaleDateString()}
              createdAt={new Date(task.createdAt).toLocaleString()}
              status={task.status}
              onDelete={() => deleteTask(task.taskId)}
              onComplete={() => updateTaskStatus(task.taskId)}
            />

          ))

        )}

      </div>



      {/* TOAST */}
      {toast && (
        <div className="fixed bottom-5 right-5 bg-slate-900 text-white px-4 py-2 rounded shadow-lg">
          {toast}
        </div>
      )}

    </div>
  );
};

export default Dashboard;