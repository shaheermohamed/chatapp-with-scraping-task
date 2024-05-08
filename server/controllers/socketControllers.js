module.exports.authorizedUser = (socket, next) => {
  if (!socket.request.session || !socket.request.session.user) {
    console.log("Bad Requestt");
    next(new Error("Not authorized"));
  } else {
    socket.user = { ...socket.request.session.user };
    next();
  }
};
module.exports.addFriend = (friendName,cb) => {
    console.log('addFriend friendName:',friendName)
    cb({ errorMsg: null, done: true });
};
