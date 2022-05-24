const catchAsync = (fn) => {
  return (e) => {
    fn(e).catch((err) => console.log(err));
  };
};

export default catchAsync;
