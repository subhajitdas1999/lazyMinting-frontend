const catchAsync = (fn, handleModalClose) => {
  return (e) => {
    fn(e).catch((err) => {
      // console.log(err);
      //api error from backend
      if (err.name === "AxiosError") {
        alert(err.response.data.message);
      }
      //error from contract
      else if (err.code === "UNPREDICTABLE_GAS_LIMIT") {
        alert(err.error.message);
      }
      //metamask error
      else if (err.code && err.message) {
        alert(err.message);
      } else {
        alert("something went wrong");
      }
      // console.log(err);
      // if modal close present close the modal
      handleModalClose && handleModalClose();
    });
  };
};

export default catchAsync;
