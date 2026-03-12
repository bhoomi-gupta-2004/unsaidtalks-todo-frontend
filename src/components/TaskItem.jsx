import {
  TrashIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";

const statusStyles = {
  DONE: "bg-green-100 text-green-700",
  PENDING: "bg-yellow-100 text-yellow-700",
  BACKLOG: "bg-red-100 text-red-700",
};

const TaskItem = ({
  title,
  assign,
  dueDate,
  createdAt,
  status,
  onDelete,
  onComplete
}) => {

  const isOverdue =
    new Date(dueDate) < new Date() && status !== "DONE";

  return (
    <div className="grid grid-cols-12 items-center py-4 border-b text-sm">


      {/* TASK NAME */}

      <div className="col-span-12 md:col-span-5 flex gap-3 items-start">

        <input
          type="checkbox"
          checked={status === "DONE"}
          onChange={onComplete}
          className="mt-1 cursor-pointer"
        />

        <div>

          <p
            className={`font-medium ${
              status === "DONE"
                ? "line-through text-gray-500"
                : ""
            }`}
          >
            {title}
          </p>

          <p className="text-xs text-gray-400 flex items-center gap-1">
            <CheckCircleIcon className="h-4 w-4" />
            {createdAt}
          </p>

        </div>

      </div>



      {/* ASSIGN */}

      <div className="col-span-12 md:col-span-3 text-gray-600 mt-2 md:mt-0">
        {assign}
      </div>



      {/* DUE DATE */}

      <div
        className={`col-span-6 md:col-span-2 ${
          isOverdue
            ? "text-red-500 font-semibold"
            : "text-gray-600"
        }`}
      >
        {dueDate}
      </div>



      {/* STATUS */}

      <div className="col-span-3 md:col-span-1">

        <span
          className={`px-2 py-1 rounded text-xs font-medium ${statusStyles[status]}`}
        >
          {status}
        </span>

      </div>



      {/* DELETE */}

      <div className="col-span-3 md:col-span-1 flex justify-end">

        <TrashIcon
          onClick={onDelete}
          className="h-5 w-5 text-gray-400 hover:text-red-500 cursor-pointer"
        />

      </div>

    </div>
  );
};

export default TaskItem;