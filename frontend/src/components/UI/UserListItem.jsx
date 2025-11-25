const UserListItem = ({ user, handleFunction }) => {
  return (
    <div
      onClick={handleFunction}
      className="cursor-pointer border group bg-neutral-100 hover:bg-white transition-all duration-100 border-neutral-300 px-3 py-2 rounded-lg relative font-light z-30 shadow-[0_2px_3px_0_rgba(0,0,0,0.15)]"
    >
      <div className="flex items-center gap-2">
        {user.pic && (
          <div className="flex items-center shrink-0">
            <img
              src={user.pic}
              alt={user.name}
              className="rounded-full shadow-[0px_1px_2px_0px_rgba(0,0,0,0.3)] object-cover border border-white w-10 h-10"
              onError={(e) => {
                e.target.src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/2048px-Default_pfp.svg.png';
              }}
            />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="font-medium group-hover:text-neutral-600 text-neutral-500">
            {user.name}
          </p>
          <p className="text-xs text-neutral-400">
            <b>Email : </b>
            {user.email}
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserListItem;
