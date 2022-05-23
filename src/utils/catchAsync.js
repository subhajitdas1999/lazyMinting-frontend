const catchAsync = (fn) => {
  return (e) => {
    fn(e).catch((err) => alert(err.message));
  };
};

export default catchAsync;
