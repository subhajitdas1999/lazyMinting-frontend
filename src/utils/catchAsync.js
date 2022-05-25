const catchAsync = (fn) => {
  return (e) => {
    fn(e).catch((err) => {
      // console.log(err);
      //api error from backend
      if(err.name === "AxiosError"){
        alert(err.response.data.message);

      }
      //error from contract
      else if (err.code === "UNPREDICTABLE_GAS_LIMIT") {
        alert(err.error.message);
      }
      //metamask error
      else if (err.code) {
        alert(err.message);
      } else {
        alert(err.code)
      }
      // console.log(err);
    });
  };
};

export default catchAsync;
